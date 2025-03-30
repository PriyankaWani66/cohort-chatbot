const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

export async function getChatResponse(message) {
  const prompt = `
You are a medical cohort query assistant.

When given a user query like:
"${message}"

You should:
1. Generate an SQL query to filter a 'patients' table.
2. Generate the equivalent Python (Pandas) code for a DataFrame called 'df'.

Respond in this format:
**SQL:**
\`\`\`sql
-- SQL code here
\`\`\`

**Python (Pandas):**
\`\`\`python
# Python code here
\`\`\`
`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await res.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      return "Sorry, I couldn't generate a query.";
    }
  } catch (err) {
    console.error("API Error:", err);
    return "Error: Something went wrong while contacting Gemini API.";
  }
}
