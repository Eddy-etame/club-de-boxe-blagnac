const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const requests = new Map();

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  };
}

function clean(value, max) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function clientKey(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
}

function isRateLimited(key) {
  const now = Date.now();
  const recent = (requests.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  requests.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function handle(request) {
  const headers = securityHeaders();
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée.' }), { status: 405, headers: { ...headers, Allow: 'POST' } });
  }

  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Format de requête invalide.' }), { status: 415, headers });
  }

  const key = clientKey(request);
  if (isRateLimited(key)) {
    return new Response(JSON.stringify({ error: 'Trop de demandes. Réessayez dans une minute.' }), { status: 429, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Corps de requête invalide.' }), { status: 400, headers });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 160).toLowerCase();
  /* Optional: a lead without a number is still a lead. Kept loose on purpose —
     rejecting an unusual format would cost a contact for nothing. */
  const phone = clean(body.phone, 30);
  const subject = clean(body.subject, 120);
  const message = clean(body.message, 2000);
  const company = clean(body.company, 120);
  const startedAt = Number(body.startedAt);
  const consent = body.consent === 'yes';

  if (company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500) {
    return new Response(JSON.stringify({ error: 'Envoi trop rapide. Merci de réessayer.' }), { status: 400, headers });
  }

  if (name.length < 2 || !EMAIL_RE.test(email) || subject.length < 2 || message.length < 10 || !consent) {
    return new Response(JSON.stringify({ error: 'Merci de vérifier tous les champs.' }), { status: 400, headers });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  /* Destination boîte du club. Surchargeable par variable d'environnement pour
     les préproductions, mais la valeur de production est le défaut afin qu'un
     déploiement ne puisse pas silencieusement perdre des demandes. */
  const to = process.env.CONTACT_TO_EMAIL || 'bc.combat31@gmail.com';
  if (!apiKey || !from || !to) {
    return new Response(JSON.stringify({ error: 'La messagerie du projet n’est pas encore configurée.' }), { status: 503, headers });
  }

  const mailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Formulaire Blagnac — ${subject}`,
      text: [
        'Nouvelle demande via le formulaire Blagnac',
        '',
        `Nom       : ${name}`,
        `E-mail    : ${email}`,
        `Téléphone : ${phone || '—'}`,
        `Cours     : ${subject}`,
        '',
        'Message :',
        message,
        '',
        '—',
        'Répondre à ce message écrit directement au demandeur.'
      ].join('\n')
    })
  });

  if (!mailResponse.ok) {
    return new Response(JSON.stringify({ error: 'Le message n’a pas pu être transmis. Réessayez plus tard.' }), { status: 502, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}

export default { fetch: handle };
