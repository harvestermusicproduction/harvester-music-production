import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel Edge Runtime or Serverless Node
// Requires Environment Variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Needs to bypass RLS to update rows
    );

    // Ensure it's called internally by Vercel Cron (CRON_SECRET) or an authenticated admin Bearer token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized CRON execution' });
    }

    const isCronSecret = Boolean(process.env.CRON_SECRET && token === process.env.CRON_SECRET);
    if (!isCronSecret) {
      const { data: userData, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !userData?.user) {
        return res.status(401).json({ error: 'Unauthorized CRON execution' });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get "tomorrow" date formatted as YYYY-MM-DD in Asia/Kuala_Lumpur timezone
    const dateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(Date.now() + 86400000));

    // Fetch reminders for tomorrow that haven't been sent
    const { data: reminders, error: fetchErr } = await supabase
      .from('event_reminders')
      .select('*')
      .eq('eventDate', dateStr)
      .eq('reminderSent', false);

    if (fetchErr) throw fetchErr;
    if (!reminders || reminders.length === 0) {
      return res.status(200).json({ message: 'No reminders to send for ' + dateStr });
    }

    // Pull custom email templates via email_template column or EXT_META fallback
    const eventIds = [...new Set(reminders.map(r => r.eventId).filter(Boolean))];
    const emailTemplates = {};
    if (eventIds.length > 0) {
      const { data: events } = await supabase.from('events').select('*').in('id', eventIds);
      events?.forEach(ev => {
        if (ev.email_template && String(ev.email_template).trim()) {
          emailTemplates[ev.id] = escapeHtml(ev.email_template).replace(/\n/g, '<br>');
        } else if (ev.description?.includes('EXT_META:')) {
          const metaMatch = ev.description.match(/EXT_META:(.*?)\|\|/);
          if (metaMatch) {
            try {
              const meta = JSON.parse(metaMatch[1]);
              if (meta.et) emailTemplates[ev.id] = escapeHtml(meta.et).replace(/\n/g, '<br>');
            } catch (e) {}
          }
        }
      });
    }

    let sentCount = 0;

    for (const reminder of reminders) {
      const safeTitle = escapeHtml(reminder.eventTitle || 'Harvester 活动');
      const safeDate = escapeHtml(reminder.eventDate || dateStr);

      // Resolve content
      const customContent = emailTemplates[reminder.eventId]
        ? `<div style="margin: 20px 0; padding:15px; background: #fafafa; border-left: 4px solid #c9933b;">${emailTemplates[reminder.eventId]}</div>`
        : `<p>明天见，我们已经准备好等你了 🙌</p><p>期待您的到来</p>`;

      // Send Email via Resend
      const { data: emailData, error: emailErr } = await resend.emails.send({
        from: 'Harvester Music <no-reply@harvestermusic.my>', // Make sure this domain is verified in Resend
        to: reminder.userEmail,
        subject: `温馨提醒：明天参加《${reminder.eventTitle || 'Harvester 活动'}》`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <img src="https://www.harvestermusic.my/assets/logo.png" style="max-height: 50px; margin-bottom: 20px;" alt="Harvester Music">
            <h2 style="color: #c9933b;">活动提醒</h2>
            <p>亲爱的朋友，平安：</p>
            <p>您报名的活动 <strong>《${safeTitle}》</strong> 即将在这一个美好的明天 (<strong>${safeDate}</strong>) 举行。</p>
            ${customContent}
            <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
              — Harvester Music Production 收割机音乐工作坊<br>
              <a href="https://www.harvestermusic.my">官网主页</a>
            </p>
          </div>
        `
      });

      if (!emailErr) {
        // Update database row as sent
        await supabase
          .from('event_reminders')
          .update({ reminderSent: true })
          .eq('id', reminder.id);
        sentCount++;
      } else {
        console.error(`Failed to send email to ${reminder.userEmail}`, emailErr);
      }
    }

    return res.status(200).json({ message: `Successfully sent ${sentCount} reminders.` });
    
  } catch (error) {
    console.error('Cron Job Execution Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
