export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email manquant' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LIP Academy <onboarding@resend.dev>',
        to: ['stephanehennequin@hotmail.com'],
        reply_to: email,
        subject: `Nouvelle inscription newsletter — ${email}`,
        html: `
          <h2 style="font-family:sans-serif;color:#3DBDB6">Nouvelle inscription newsletter</h2>
          <p style="font-family:sans-serif;font-size:15px">Email : <a href="mailto:${email}">${email}</a></p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
          <p style="font-family:sans-serif;font-size:12px;color:#aaa">Envoyé depuis lip-academy.vercel.app</p>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.message || 'Erreur Resend' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
