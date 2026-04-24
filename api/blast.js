import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // Allow only POST to prevent pre-fetching accidental triggers
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Bypass RLS to fetch all and update
    );
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Fetch ALL reminders that haven't been sent yet! (Manually triggered Blast)
    const { data: reminders, error: fetchErr } = await supabase
      .from('event_reminders')
      .select('*')
      .eq('reminderSent', false);

    if (fetchErr) throw fetchErr;
    if (!reminders || reminders.length === 0) {
      return res.status(200).json({ message: '没有任何等待发送的提醒邮件。' });
    }

    // Attempt to pull custom email templates via EXT_META
    const eventIds = [...new Set(reminders.map(r => r.eventId))];
    const { data: events } = await supabase.from('events').select('id, description').in('id', eventIds);
    const emailTemplates = {};
    events?.forEach(ev => {
      if (ev.description?.includes('EXT_META:')) {
        const metaMatch = ev.description.match(/EXT_META:(.*?)\\|\\|/);
        if (metaMatch) {
          try {
             const meta = JSON.parse(metaMatch[1]);
             if (meta.et) emailTemplates[ev.id] = meta.et.replace(/\\n/g, '<br>');
          } catch(e) {}
        }
      }
    });

    let sentCount = 0;
    let fallbackError = '';

    for (const reminder of reminders) {
      // Resolve content
      const customContent = emailTemplates[reminder.eventId] 
        ? `<div style="margin: 20px 0; padding:15px; background: #fafafa; border-left: 4px solid #c9933b;">${emailTemplates[reminder.eventId]}</div>` 
        : `<p>温馨提醒，您报名的活动不要错过啦 🙌</p><p>非常期待您的到来！</p>`;

      // Send Email via Resend
      const { data: emailData, error: emailErr } = await resend.emails.send({
        from: 'Harvester Music <office@harvestermusic.my>', 
        to: reminder.userEmail,
        subject: `温馨提醒：千万别错过《${reminder.eventTitle}》`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-top: 4px solid #c9933b; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://www.harvestermusic.my/assets/logo.png" style="max-height: 50px;">
            </div>
            <h2 style="color: #c9933b; text-align: center;">活动温馨提醒</h2>
            <p style="font-size: 16px; line-height: 1.6;">亲爱的朋友，平安：</p>
            <p style="font-size: 16px; line-height: 1.6;">您订阅提醒的活动 <strong>《${reminder.eventTitle}》</strong> 就要在 <strong>${reminder.eventDate}</strong> 举行了哦。</p>
            ${customContent}
            <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #888; text-align: center;">
              — Harvester Music Production 收割机音乐工作坊<br>
              <a href="https://www.harvestermusic.my" style="color: #c9933b; text-decoration: none;">访问官网主页</a>
            </p>
          </div>
        `
      });

      if (!emailErr) {
        // Mark as sent immediately to avoid double-sends in case of timeout
        await supabase
          .from('event_reminders')
          .update({ reminderSent: true })
          .eq('id', reminder.id);
        sentCount++;
      } else {
        console.error(`Failed to send email to ${reminder.userEmail}`, emailErr);
        fallbackError = emailErr.message;
      }
    }

    if (sentCount === 0 && reminders.length > 0) {
      return res.status(200).json({ message: `发送被拦截：0封成功。Resend拦截原因: ${fallbackError}\n(如果你使用的是免费的Resend测试账号，必须在后台先验证域名，并且只能发送到你自己的注册邮箱！)` });
    }

    return res.status(200).json({ message: `🚀 成功一键发送了 ${sentCount} 封提醒邮件！` });
    
  } catch (error) {
    console.error('Blast API Execution Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
