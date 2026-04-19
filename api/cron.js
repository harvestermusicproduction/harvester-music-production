import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel Edge Runtime or Serverless Node
// Requires Environment Variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY

export default async function handler(req, res) {
  // Ensure it's called internally by Vercel Cron or protected
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized CRON execution' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Needs to bypass RLS to update rows
    );
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get "tomorrow" date formatted as YYYY-MM-DD in the local timezone (assume UTC+8 usually for MY/CN)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Fallback simple ISO offset logic
    const locTzOffset = 8 * 60; // UTC+8
    const localTomorrow = new Date(tomorrow.getTime() + locTzOffset * 60 * 1000);
    const dateStr = localTomorrow.toISOString().split('T')[0];

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

    let sentCount = 0;

    for (const reminder of reminders) {
      // Send Email via Resend
      const { data: emailData, error: emailErr } = await resend.emails.send({
        from: 'Harvester Music <no-reply@harvestermusic.my>', // Make sure this domain is verified in Resend
        to: reminder.userEmail,
        subject: `温馨提醒：明天参加《${reminder.eventTitle}》`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <img src="https://www.harvestermusic.my/assets/logo.png" style="max-height: 50px; margin-bottom: 20px;">
            <h2 style="color: #c9933b;">活动提醒</h2>
            <p>亲爱的朋友，平安：</p>
            <p>您报名的活动 <strong>《${reminder.eventTitle}》</strong> 即将在这一个美好的明天 (<strong>${reminder.eventDate}</strong>) 举行。</p>
            <p>期待您的到来，共同在这个空间中见证灵之火的燃烧。</p>
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
