export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prenom, nom, email, tel, ceinture } = req.body;

  if (!prenom || !nom || !email || !tel) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  const code = `LIP-${tel.replace(/\s/g, '').slice(-4)}-${prenom.slice(0,2).toUpperCase()}`;

  try {
    // Confirmation à l'inscrit
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LIP Academy <contact@lip-academie.com>',
        to: [email],
        subject: '🌴 Votre pass Open Mat Gratuit — Août 2026 | L.I.P Academy',
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff">

            <!-- HEADER -->
            <div style="background:#1a2a28;padding:36px 32px;text-align:center">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#3DBDB6;font-weight:700">L.I.P ACADEMY — LOST IN PARADISE</p>
              <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">🌴 Open Mat Gratuit · Spécial Été</h1>
              <p style="margin:0;color:rgba(255,255,255,.6);font-size:14px">Août 2026 · À partir du 24 août</p>
            </div>

            <!-- BODY -->
            <div style="padding:36px 32px;background:#ffffff">
              <p style="font-size:16px;margin:0 0 20px;color:#1a1a1a">Bonjour <strong>${prenom}</strong>,</p>
              <p style="color:#444;line-height:1.7;margin:0 0 28px;font-size:15px">
                Votre inscription à l'<strong style="color:#2EA09A">Open Mat &amp; Cours gratuits d'Août 2026</strong> est confirmée. Présentez ce billet lors de votre premier passage à L.I.P Academy.
              </p>

              <!-- BILLET -->
              <div style="background:#f0fafa;border:2px dashed #3DBDB6;border-radius:12px;padding:28px 24px;text-align:center;margin-bottom:28px">
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#888">PASS VALABLE DU 10 AU 31 AOÛT 2026</p>
                <div style="font-size:30px;font-weight:800;color:#2EA09A;letter-spacing:.06em;margin:14px 0">${code}</div>
                <p style="margin:0;font-size:14px;color:#555;font-weight:600">${prenom} ${nom.toUpperCase()}</p>
              </div>

              <!-- INFOS -->
              <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:28px">
                <tr>
                  <td style="padding:11px 0;color:#888;width:140px;vertical-align:top;border-bottom:1px solid #f0f0f0">Inclus</td>
                  <td style="padding:11px 0;color:#222;border-bottom:1px solid #f0f0f0">
                    ✅ Open Mat adhérents<br>
                    ✅ Cours JJB tous niveaux<br>
                    ✅ Cours No-Gi
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 0;color:#888;border-bottom:1px solid #f0f0f0;vertical-align:top">Lieu</td>
                  <td style="padding:11px 0;color:#222;border-bottom:1px solid #f0f0f0">Fit'Teix — Quincy-Voisins (77860)</td>
                </tr>
                <tr>
                  <td style="padding:11px 0;color:#888;vertical-align:top">Période</td>
                  <td style="padding:11px 0;color:#222">Du 24 au 31 août 2026</td>
                </tr>
              </table>

              <div style="background:#f0fafa;border-left:4px solid #3DBDB6;border-radius:4px;padding:14px 18px;margin-bottom:28px">
                <p style="margin:0;font-size:13px;color:#333">
                  📱 <strong>Présentez ce mail</strong> ou votre code <strong style="color:#2EA09A">${code}</strong> lors de votre premier cours.
                </p>
              </div>

              <p style="color:#666;font-size:14px;line-height:1.7;margin:0">
                Des questions ? Répondez à cet email.<br>
                À très vite sur le tatami ! 🥋
              </p>
            </div>

            <!-- FOOTER -->
            <div style="background:#f7f7f7;padding:18px 32px;text-align:center;border-top:1px solid #eee">
              <p style="margin:0;font-size:12px;color:#aaa">© 2026 L.I.P Academy · Quincy-Voisins (77) · <a href="https://lip-academie.com" style="color:#3DBDB6;text-decoration:none">lip-academie.com</a></p>
            </div>
          </div>
        `,
      }),
    });

    // Notification à Stéphane
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LIP Academy <contact@lip-academie.com>',
        to: ['stephanehennequin@hotmail.com', 'contact@lip-academie.com'],
        reply_to: email,
        subject: `🌴 Nouvelle inscription Open Mat Été — ${prenom} ${nom}`,
        html: `
          <h2 style="font-family:sans-serif;color:#3DBDB6">Nouvelle inscription Open Mat Spécial Été</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">
            <tr><td style="padding:8px 0;color:#888;width:140px">Prénom</td><td>${prenom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Nom</td><td>${nom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Téléphone</td><td>${tel}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Niveau</td><td>${ceinture || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Code pass</td><td><strong>${code}</strong></td></tr>
          </table>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
          <p style="font-family:sans-serif;font-size:12px;color:#aaa">Envoyé depuis lip-academie.com</p>
        `,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
