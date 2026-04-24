import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // Allow GET for manual debugging/triggering
  if (req.method !== 'POST' && req.method !== 'GET') {
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
        subject: `活动提醒：请准时参与明日活动《${reminder.eventTitle}》`,
        html: `
          <div style="font-family: 'Microsoft YaHei', sans-serif; padding: 30px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-top: 5px solid #c9933b; border-radius: 12px; line-height: 1.8;">
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="https://www.harvestermusic.my/assets/logo.png" style="max-height: 55px;" alt="Harvester Music">
            </div>
            
            <h3 style="color: #c9933b; margin-top: 0;">尊敬的参与者：</h3>
            <p>您好！</p>
            <p>特此提醒您，您报名参加的活动将于明日举行，敬请您提前安排时间并准时参与。</p>
            
            <div style="background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin: 25px 0;">
              <h4 style="margin-top: 0; color: #c9933b; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">📌 活动信息如下：</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px;">
                <li style="margin-bottom: 8px;"><strong>活动名称：</strong> ${reminder.eventTitle}</li>
                <li style="margin-bottom: 8px;"><strong>日期：</strong> ${reminder.eventDate}</li>
                <li style="margin-bottom: 8px;"><strong>时间：</strong> ${reminder.eventTime}</li>
                <li style="margin-bottom: 8px;"><strong>地点：</strong> ${reminder.eventLocation || '见详情页面'}</li>
              </ul>
            </div>

            ${customContent ? '<div style="margin-bottom: 20px;">' + customContent + '</div>' : ''}

            <p style="font-size: 15px; color: #555;">请您提前 <strong>10–15 分钟</strong> 进入会场（或抵达现场），以确保活动顺利开始。如为线上活动，请提前检查网络与设备。</p>
            <p style="font-size: 15px; color: #555;">如您因特殊情况无法出席，请提前与我们联系。</p>
            
            <p style="margin-top: 30px; font-weight: bold;">期待您的参与！</p>
            <p>祝好</p>
            <p style="color: #c9933b; font-weight: bold;">收割机创作工作坊</p>

            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              © 2026 Harvester Music Production<br>
              <a href="https://www.harvestermusic.my" style="color: #c9933b; text-decoration: none;">访问官网</a> | 本邮件由系统自动发出，请勿直接回复
            </div>
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
