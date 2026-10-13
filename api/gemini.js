export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Use POST method" });
}

try {
const { message } = req.body || {};

if (!message || typeof message !== "string") {
  return res.status(400).json({ error: "Message is required" });
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  return res.status(500).json({ error: "API key not configured" });
}

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message.slice(0, 10000) }]
        }
      ]
    })
  }
);

const data = await response.json();

if (!response.ok) {
  return res.status(502).json({ error: "AI request failed" });
}

const reply =
  data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("") || "Sorry bro, reply nahi mila.";

return res.status(200).json({ reply });

} catch (error) {
return res.status(500).json({ error: "Server error" });
}
  }
