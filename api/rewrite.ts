export const runtime = 'edge';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Μέθοδος δεν επιτρέπεται' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Λείπει το OPENAI_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Μη έγκυρο JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { text, keywords } = body as { text?: string; keywords?: string[] };
  if (!text || typeof text !== 'string') {
    return new Response(JSON.stringify({ error: 'Το πεδίο text είναι υποχρεωτικό' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const kwString = Array.isArray(keywords) && keywords.length
    ? `Λέξεις-κλειδιά για ενσωμάτωση (αν ταιριάζουν φυσικά): ${keywords.join(', ')}`
    : 'Δεν υπάρχουν συγκεκριμένες λέξεις-κλειδιά.';

  const userPrompt = `Βελτίωσε αυτή την κριτική Google Maps:

"${text}"

${kwString}

Απάντηση (μόνο 2-3 προτάσεις):`;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Είσαι ειδικός στη βελτίωση κριτικών Google Maps στα ελληνικά. Στόχος σου είναι να κάνεις την κριτική πιο χρήσιμη για την επιχείρηση και ταυτόχρονα φυσική σαν να γράφτηκε από πελάτη. Η απάντησή σου πρέπει να είναι ΜΟΝΟ 2-3 προτάσεις (σύντομες, όπως εμφανίζονται στην οθόνη κινητού). Να διατηρείται το ίδιο συναίσθημα με το αρχικό κείμενο. Αν δοθούν λέξεις-κλειδιά, προσπάθησε να τις ενσωματώσεις φυσικά χωρίς να φαίνεται διαφήμιση. Μην εφευρίσκεις ποτέ πληροφορίες που δεν υπάρχουν στο κείμενο ή στις λέξεις-κλειδιά.',
          },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 150,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: `OpenAI error: ${errText.slice(0, 500)}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await resp.json();
    const improved = data?.choices?.[0]?.message?.content?.trim();
    if (!improved) {
      return new Response(JSON.stringify({ error: 'Άγνωστη απάντηση OpenAI' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ improved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Αποτυχία κλήσης OpenAI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = { runtime: 'edge' };