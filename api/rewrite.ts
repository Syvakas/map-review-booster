export const runtime = 'edge';

import { businessConfig } from '../src/lib/business-config';
import { getCategoryPrompt } from '../src/lib/category-prompts';

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

  // Λήψη category prompt για την επιχείρηση
  const categoryPrompt = getCategoryPrompt(businessConfig.category);
  
  // Συνδυασμός keywords από το request και από τη διαμόρφωση
  const allKeywords = [
    ...(Array.isArray(keywords) ? keywords : []),
    ...businessConfig.keywords,
    ...(categoryPrompt?.keywords || [])
  ];
  
  const uniqueKeywords = [...new Set(allKeywords)];
  
  const kwString = uniqueKeywords.length
    ? `Χρησιμοποίησε αυτές τις λέξεις-κλειδιά αν ταιριάζουν: ${uniqueKeywords.join(', ')}.`
    : '';

  // Δημιουργία εξατομικευμένου prompt
  const businessContext = `
ΠΛΗΡΟΦΟΡΙΕΣ ΕΠΙΧΕΙΡΗΣΗΣ:
- Όνομα: ${businessConfig.name}
- Κατηγορία: ${businessConfig.category}
- Τοποθεσία: ${businessConfig.location}
- Ειδικότητες: ${businessConfig.specialties.join(', ')}
- Εστίαση: ${categoryPrompt?.focusAreas.join(', ') || 'Γενική βελτίωση'}`;

  const userPrompt = `Βελτίωσε το παρακάτω κείμενο κριτικής (ελληνικά, φυσικός τόνος, σαφήνεια, χωρίς υπερβολές). ${kwString}${businessContext}

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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: categoryPrompt?.systemPrompt || 
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