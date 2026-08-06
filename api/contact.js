export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prenom, nom, email, tel, profil, message } = req.body;

  if (!prenom || !nom || !email) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LIP Academy <contact@lip-academie.com>',
        to: ['stephanehennequin@hotmail.com', 'contact@lip-academie.com'],
        reply_to: email,
        subject: `Nouveau message — ${prenom} ${nom}`,
        html: `
          <h2 style="font-family:sans-serif;color:#3DBDB6">Nouveau message — L.I.P Academy</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">
            <tr><td style="padding:8px 0;color:#888;width:140px">Prénom</td><td>${prenom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Nom</td><td>${nom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Téléphone</td><td>${tel || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Profil</td><td>${profil || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top">Message</td><td>${message ? message.replace(/\n/g, '<br>') : '—'}</td></tr>
          </table>
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
