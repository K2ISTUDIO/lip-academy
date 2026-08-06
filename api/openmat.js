export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prenom, nom, email, tel } = req.body;

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
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0D1117;color:#E6EDF3;border-radius:16px;overflow:hidden">

            <div style="background:linear-gradient(135deg,#1a2a28,#0D1117);padding:40px 36px 32px;text-align:center">
              <p style="margin:0 0 12px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#3DBDB6;font-weight:700">L.I.P ACADEMY — LOST IN PARADISE</p>
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;line-height:1.2">🌴 Open Mat Gratuit<br>Spécial Été</h1>
              <p style="margin:0;color:rgba(230,237,243,.6);font-size:15px">Août 2026 · À partir du 10 août</p>
            </div>

            <div style="padding:32px 36px">
              <p style="font-size:16px;margin:0 0 24px">Bonjour <strong>${prenom}</strong>,</p>
              <p style="color:rgba(230,237,243,.8);line-height:1.7;margin:0 0 28px">
                Votre inscription à l'<strong style="color:#3DBDB6">Open Mat &amp; Cours gratuits de Août 2026</strong> est confirmée. Présentez ce billet lors de votre premier passage à L.I.P Academy.
              </p>

              <!-- BILLET -->
              <div style="background:#161B22;border:2px dashed #3DBDB6;border-radius:14px;padding:28px 24px;text-align:center;margin-bottom:28px">
                <p style="margin:0 0 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(230,237,243,.5)">PASS VALABLE DU 10 AU 31 AOÛT 2026</p>
                <div style="font-size:32px;font-weight:800;color:#3DBDB6;letter-spacing:.05em;margin:12px 0">${code}</div>
                <p style="margin:0;font-size:14px;color:rgba(230,237,243,.7)">${prenom} ${nom.toUpperCase()}</p>
              </div>

              <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:28px">
                <tr>
                  <td style="padding:10px 0;color:rgba(230,237,243,.5);width:140px;vertical-align:top">Ce qui est inclus</td>
                  <td style="padding:10px 0;color:#E6EDF3">
                    ✅ Open Mat adhérents (accès libre)<br>
                    ✅ Cours JJB tous niveaux<br>
                    ✅ Cours No-Gi
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:rgba(230,237,243,.5);border-top:1px solid rgba(255,255,255,.06);vertical-align:top">Lieu</td>
                  <td style="padding:10px 0;color:#E6EDF3;border-top:1px solid rgba(255,255,255,.06)">Fit'Teix — Quincy-Voisins (77860)</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:rgba(230,237,243,.5);border-top:1px solid rgba(255,255,255,.06);vertical-align:top">Période</td>
                  <td style="padding:10px 0;color:#E6EDF3;border-top:1px solid rgba(255,255,255,.06)">Du 10 au 31 août 2026</td>
                </tr>
              </table>

              <div style="background:rgba(61,189,182,.1);border:1px solid rgba(61,189,182,.25);border-radius:10px;padding:16px 20px;margin-bottom:28px">
                <p style="margin:0;font-size:13px;color:rgba(230,237,243,.8)">
                  📱 <strong>Présentez ce mail</strong> (ou votre code <strong style="color:#3DBDB6">${code}</strong>) lors de votre premier cours.
                </p>
              </div>

              <p style="color:rgba(230,237,243,.6);font-size:14px;line-height:1.6;margin:0">
                Des questions ? Répondez à cet email ou retrouvez-nous sur les réseaux.<br>
                À très vite sur le tatami !
              </p>
            </div>

            <div style="background:#161B22;padding:20px 36px;text-align:center;border-top:1px solid rgba(255,255,255,.06)">
              <p style="margin:0;font-size:12px;color:rgba(230,237,243,.4)">© 2026 L.I.P Academy · Quincy-Voisins (77) · <a href="https://lip-academie.com" style="color:#3DBDB6;text-decoration:none">lip-academie.com</a></p>
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
        to: ['stephanehennequin@hotmail.com'],
        reply_to: email,
        subject: `🌴 Nouvelle inscription Open Mat Été — ${prenom} ${nom}`,
        html: `
          <h2 style="font-family:sans-serif;color:#3DBDB6">Nouvelle inscription Open Mat Spécial Été</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">
            <tr><td style="padding:8px 0;color:#888;width:140px">Prénom</td><td>${prenom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Nom</td><td>${nom}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Téléphone</td><td>${tel}</td></tr>
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
