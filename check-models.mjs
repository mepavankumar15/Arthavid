// Run with: node check-models.mjs YOUR_GROQ_API_KEY
const apiKey = process.argv[2];

if (!apiKey) {
  console.error("Usage: node check-models.mjs YOUR_GROQ_API_KEY");
  process.exit(1);
}

const res = await fetch("https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${apiKey}` },
});

const data = await res.json();

if (!data.data) {
  console.error("Error:", JSON.stringify(data));
  process.exit(1);
}

console.log("\n✅ Available Groq models:\n");
data.data
  .sort((a, b) => a.id.localeCompare(b.id))
  .forEach(m => console.log(" -", m.id));
