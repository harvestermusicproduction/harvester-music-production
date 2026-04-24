import { Resend } from 'resend';

export default async function handler(req, res) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Harvester Music <office@harvestermusic.my>',
      to: 'harvestermusicproduction@gmail.com',
      subject: '🚀 官方域名发信测试成功！',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-top: 4px solid #c9933b; border-radius: 8px;">
          <h2 style="color: #c9933b; text-align: center;">祝贺！域名验证成功</h2>
          <p>这是一封来自 <strong>harvestermusic.my</strong> 官方域名的测试邮件。</p>
          <p>看到这封信，意味着：</p>
          <ul>
            <li>你的 DNS 配置已经完全生效。</li>
            <li>你可以开始使用官方身份与粉丝沟通了。</li>
            <li>收割机音乐的后台发信引擎已全面就绪。</li>
          </ul>
          <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #888; text-align: center;">
            — Harvester Music Production 系统测试
          </p>
        </div>
      `
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: '测试邮件已发出！请检查 harvestermusicproduction@gmail.com 的收件箱。', id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
