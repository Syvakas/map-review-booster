export const runtime = 'edge';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Μέθοδος δεν επιτρέπεται' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Λείπει το OPENAI_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Μη έγκυρο JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { text, keywords } = body || {};
  if (!text || typeof text !== 'string') {
    return new Response(JSON.stringify({ error: 'Το πεδίο text είναι υποχρεωτικό' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const kwString =
    Array.isArray(keywords) && keywords.length
      ? `Χρησιμοποίησε αυτές τις λέξεις-κλειδιά αν ταιριάζουν: ${keywords.join(', ')}.`
      : '';

  const userPrompt = `Βελτίωσε το παρακάτω κείμενο κριτικής (ελληνικά, φυσικός τόνος, σαφήνεια, χωρίς υπερβολές). ${kwString}

Κείμενο:
${text}`;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Είσαι ένας βοηθός που βελτιώνει σύντομα κείμενα κριτικών για Google Maps, κρατώντας το αρχικό νόημα.',
          },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: `OpenAI error: ${errText.slice(0, 500)}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const improved = data?.choices?.[0]?.message?.content?.trim();
    if (!improved) {
      return new Response(JSON.stringify({ error: 'Άγνωστη απάντηση OpenAI' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ improved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Αποτυχία κλήσης OpenAI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}