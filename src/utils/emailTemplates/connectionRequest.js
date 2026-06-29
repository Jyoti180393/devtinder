function connectionRequestTemplate({
  type = "request", // 'sent' or 'received'
  fromName = "Someone",
  toName = "You",
  message = "",
  acceptUrl = "#",
  declineUrl = "#",
  appName = "DevTinder",
  logoUrl = "",
}) {
  const title =
    type === "sent"
      ? `${fromName} sent a connection request` 
      : `${fromName} wants to connect with you`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <style>
      body { background:#f2f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin:0; padding:0; }
      .email-wrap{ width:100%; padding:24px 0 }
      .container{ max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
      .header{ padding:20px; text-align:left; border-bottom:1px solid #eef0f3 }
      .logo{ height:36px }
      .content{ padding:24px }
      .greeting{ font-size:20px; margin:0 0 8px 0 }
      .body-text{ color:#334155; font-size:15px; line-height:1.5; margin:0 0 16px 0 }
      .card{ display:flex; gap:12px; align-items:center; padding:12px; border:1px solid #eef0f3; border-radius:8px; margin-bottom:16px }
      .avatar{ width:56px; height:56px; border-radius:50%; background:#e2e8f0; display:inline-block }
      .name{ font-weight:600 }
      .message{ color:#475569; font-size:14px; margin-top:6px }
      .actions{ display:flex; gap:8px }
      .btn{ display:inline-block; padding:10px 16px; border-radius:6px; text-decoration:none; font-weight:600 }
      .btn-accept{ background:#0ea5a4; color:#fff }
      .btn-decline{ background:#f1f5f9; color:#0f172a; border:1px solid #e2e8f0 }
      .footer{ padding:16px; font-size:12px; color:#94a3b8; text-align:center }
      @media (max-width:420px){ .container{ margin:0 12px } }
    </style>
  </head>
  <body>
    <div class="email-wrap">
      <div class="container">
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" alt="${appName}" class="logo"/>` : `<strong>${appName}</strong>`}
        </div>
        <div class="content">
          <p class="greeting">${title}</p>
          <p class="body-text">${fromName} has invited ${toName} to connect on ${appName}.</p>

          <div class="card">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <div class="name">${fromName}</div>
              ${message ? `<div class="message">${message}</div>` : ""}
            </div>
          </div>

          <div class="actions">
            <a class="btn btn-accept" href="${acceptUrl}">Accept</a>
            <a class="btn btn-decline" href="${declineUrl}">Decline</a>
          </div>

          <p class="body-text" style="margin-top:18px;">You can also reply to this email or visit your <a href="#">Connections</a> page to manage requests.</p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </div>
    </div>
  </body>
</html>`;
}

module.exports = { connectionRequestTemplate };
