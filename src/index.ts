import "dotenv/config";
import WebSocket from "ws";
import Groq from "groq-sdk";

// ── Config ────────────────────────────────────────────────────────
const MM_URL = process.env.MATTERMOST_URL || "http://localhost:54597";
const BOT_TOKEN = process.env.MATTERMOST_BOT_TOKEN ?? "";
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const BOT_USERNAME = (process.env.BOT_USERNAME || "avyu150").toLowerCase();
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

if (!BOT_TOKEN || !GROQ_API_KEY) {
  console.error("❌  Missing MATTERMOST_BOT_TOKEN or GROQ_API_KEY in .env");
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

// ── Tag Definitions ───────────────────────────────────────────────

const TOPIC_TAGS: Record<string, string> = {
  ipo:         "This is about an IPO. Cover: company background, IPO price, GMP if known, bull case, bear case for listing gains.",
  earnings:    "This is about company earnings/results. Cover: revenue, profit, vs estimates, management commentary, stock reaction, what it means.",
  rbi:         "This is about RBI or monetary policy. Cover: the decision, impact on markets, what it means for retail investors and borrowers.",
  crypto:      "This is about cryptocurrency. Be balanced. Include Indian regulatory angle where relevant.",
  nifty:       "This is about Nifty50, Sensex, or Indian stock market indices. Include sector performance, FII/DII data if mentioned, key movers.",
  budget:      "This is about the Union Budget or fiscal/tax policy. Cover: market impact, sectors that win/lose, what retail investors should know.",
  startup:     "This is about the Indian startup ecosystem — funding, valuation, product launches. Include market opportunity angle.",
  forex:       "This is about currency markets or forex. Cover: INR movement, global factors, impact on Indian exporters/importers.",
  gold:        "This is about gold or commodities. Cover: price movement, why it matters, how to play it.",
  fii:         "This is about FII (Foreign Institutional Investor) or DII activity. Cover: net flows, impact on market direction.",
  sector:      "This is a sector analysis. Cover: key players, recent performance, tailwinds, headwinds, outlook.",
  economy:     "This is about macroeconomics — GDP, inflation, jobs. Cover: what the data means, market impact, what to watch next.",
};

const TRADE_TAGS: Record<string, string> = {
  bull:         "Take a bullish angle. Focus on upside potential, catalysts, positive signals. Make a case for buying.",
  bear:         "Take a bearish angle. Focus on downside risks, warning signs, red flags. Make a case for caution or selling.",
  breakout:     "Analyze this as a breakout setup. Mention key levels, volume confirmation, what a successful breakout looks like.",
  support:      "Focus on support levels — where buyers have historically stepped in, what happens if it breaks, what to watch.",
  resistance:   "Focus on resistance levels — where sellers have historically appeared, what a break above means.",
  trend:        "Analyze the trend — is it up, down, or sideways? Use simple descriptions, no jargon without explanation.",
  volume:       "Focus on volume analysis — unusual volume, what it signals, accumulation vs distribution.",
  momentum:     "Focus on momentum — is it accelerating or slowing? What does this mean for near-term price action.",
  reversal:     "Analyze this as a potential trend reversal. What signals suggest a turn? What needs to happen to confirm it.",
  swing:        "Frame this for swing traders — multi-day to multi-week holds. Entry zone, target, stop loss.",
  intraday:     "Frame this for intraday traders — same-day moves. Key levels for the session, what to watch.",
  longterm:     "Frame this for long-term investors — 1-3 year horizon. Fundamentals, compounding angle, patience required.",
  dca:          "Frame this through dollar-cost averaging lens. Is this a good asset to DCA into? At what frequency?",
  fundamentals: "Focus on fundamental analysis — revenue, profit margins, PE ratio, debt, promoter holding, business moat.",
  technical:    "Focus on technical analysis — price action, key levels, chart patterns. Keep it simple and visual.",
  risk:         "Focus on risk management — what can go wrong, how to size the position, stop loss placement, risk/reward.",
};

const FORMAT_PROMPTS: Record<string, string> = {
  thread:   "Write a Twitter/X thread (5-7 tweets, numbered 1/ 2/ 3/ format). Each tweet under 280 chars. Punchy, shareable. End with a CTA.",
  li:       "Write a LinkedIn post (150-300 words). Short paragraphs. First line is a scroll-stopper. Professional but human. End with a question.",
  linkedin: "Write a LinkedIn post (150-300 words). Short paragraphs. First line is a scroll-stopper. Professional but human. End with a question.",
  ig:       "Write an Instagram caption (100-150 words) + line break + 15 relevant hashtags. Conversational, story-driven.",
  instagram:"Write an Instagram caption (100-150 words) + line break + 15 relevant hashtags. Conversational, story-driven.",
  yt:       "Write a YouTube package:\nTitle: [under 60 chars]\nDescription: [150-word SEO description]\nTags: [10 comma-separated tags]",
  youtube:  "Write a YouTube package:\nTitle: [under 60 chars]\nDescription: [150-word SEO description]\nTags: [10 comma-separated tags]",
  all:      "Repurpose this for all 4 platforms. Label each clearly:\n🐦 TWITTER THREAD:\n💼 LINKEDIN:\n📸 INSTAGRAM:\n🎬 YOUTUBE:",
  repurpose:"Repurpose this for all 4 platforms. Label each clearly:\n🐦 TWITTER THREAD:\n💼 LINKEDIN:\n📸 INSTAGRAM:\n🎬 YOUTUBE:",
  score:    "Score this post out of 10. Format:\nScore: X/10\nWhy: [2-3 specific reasons]\nImproved version: [full rewrite]\nWhat changed: [bullet points]\nBe brutally honest.",
  hook:     "Write 10 scroll-stopping opening lines. Use different styles: stat, question, hot take, story, contrast, prediction. Number them 1-10. Just the hooks, no explanations.",
  ideas:    "Give 5 content ideas. For each:\n[number]. Title\nPlatform: [best platform]\nAngle: [unique angle in one line]\nHook: [opening line]",
  explain:  "Explain this as a Twitter thread (5-6 tweets, 1/ 2/ 3/ format). Use one real-world analogy. No jargon without explaining it. End with 'Save this 🔖'",
  story:    "Write a LinkedIn story post (150-250 words). Structure: Hook → What happened → What I expected vs what happened → Lesson. End with a question.",
};

const BASE_STYLE = `
Style rules (always follow):
- Write like a sharp 22-year-old who understands markets — not a finance textbook
- Short sentences. Punchy. No filler words.
- Personal angle: student learning markets in public, paper trading, analyzing without real money yet
- Opinions are fine — say "my take" / "I think" — not "experts suggest"
- Never say "as an AI" or sound robotic
- Use specific numbers and examples when possible
- Not financial advice — always suits a learner's perspective
`;

// ── Hacker News (Algolia free API) ───────────────────────────────

interface HNStory {
  objectID: string;
  title: string;
  url?: string;
  points: number;
  num_comments: number;
  author: string;
  created_at: string;
}

/** Map our topic tags → HN search queries */
const TOPIC_TO_HN_QUERY: Record<string, string> = {
  ipo:         "IPO stock offering listing",
  earnings:    "earnings revenue quarterly results profits",
  rbi:         "RBI india central bank monetary policy interest rate",
  crypto:      "crypto bitcoin ethereum blockchain defi",
  nifty:       "india stock market nifty sensex BSE NSE",
  budget:      "india budget fiscal policy tax government",
  startup:     "startup funding venture capital seed round",
  forex:       "forex currency exchange rate dollar rupee",
  gold:        "gold commodities silver price rally",
  fii:         "foreign investment india FII DII flows",
  sector:      "sector analysis industry technology banking",
  economy:     "economy GDP inflation macroeconomics recession",
};

async function fetchHNStories(query: string, limit = 5): Promise<HNStory[]> {
  const url =
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}` +
    `&tags=story&hitsPerPage=${limit}&numericFilters=points>30`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HN API error: ${res.status}`);
  const data: any = await res.json();
  return (data.hits ?? []) as HNStory[];
}

function getTimeAgo(dateStr: string): string {
  const diffH = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3_600_000);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function formatHNStories(stories: HNStory[], label: string): string {
  if (stories.length === 0) return `No HN stories found for **${label}** right now. Try a broader topic tag.`;

  const lines: string[] = [`🔥 **Top HN Stories — ${label}**\n`];
  stories.forEach((s, i) => {
    const hnUrl = `https://news.ycombinator.com/item?id=${s.objectID}`;
    lines.push(
      `**${i + 1}. ${s.title}**`,
      `⬆️ ${s.points} pts · 💬 ${s.num_comments} comments · ${getTimeAgo(s.created_at)}`,
      s.url ? `📎 [Article](${s.url})  |  🗣 [HN Discussion](${hnUrl})` : `🗣 [HN Discussion](${hnUrl})`,
      ""
    );
  });
  lines.push("_Tip: Add a format tag to generate content from the top story — e.g. `#hn #crypto #thread`_");
  return lines.join("\n");
}

// ── Tag Parser ────────────────────────────────────────────────────

interface ParsedTags {
  topicTags: string[];
  tradeTags: string[];
  formatTag: string;
  content: string;
}

function parseTags(message: string): ParsedTags {
  const hashtagRegex = /#(\w+)/g;
  const found = [...message.matchAll(hashtagRegex)].map(m => m[1].toLowerCase());

  const topicTags = found.filter(t => t in TOPIC_TAGS);
  const tradeTags = found.filter(t => t in TRADE_TAGS);
  const formatTag = found.find(t => t in FORMAT_PROMPTS) ?? "thread";
  const content = message.replace(/#\w+/g, "").trim();

  return { topicTags, tradeTags, formatTag, content };
}

function buildPrompt(parsed: ParsedTags): string {
  const parts: string[] = ["You are ArthaVid, an AI fintech content assistant for a student content creator.\n"];

  if (parsed.topicTags.length > 0) {
    parts.push("TOPIC CONTEXT:");
    parsed.topicTags.forEach(t => parts.push(`• ${TOPIC_TAGS[t]}`));
    parts.push("");
  }

  if (parsed.tradeTags.length > 0) {
    parts.push("TRADING ANGLE:");
    parsed.tradeTags.forEach(t => parts.push(`• ${TRADE_TAGS[t]}`));
    parts.push("");
  }

  parts.push("OUTPUT FORMAT:");
  parts.push(FORMAT_PROMPTS[parsed.formatTag]);
  parts.push("");
  parts.push(BASE_STYLE);

  return parts.join("\n");
}

// ── Groq ──────────────────────────────────────────────────────────

async function askGroq(prompt: string, message: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message || "Create content based on the context above." },
    ],
    max_tokens: 1500,
    temperature: 0.75,
  });
  return completion.choices[0]?.message?.content ?? "No response.";
}

// ── Mattermost REST ───────────────────────────────────────────────

async function mmAPI(method: string, path: string, body?: object): Promise<any> {
  const res = await fetch(`${MM_URL}/api/v4${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BOT_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`MM API ${method} ${path} → ${res.status}`);
  return res.json();
}

async function createPost(channelId: string, message: string, rootId?: string): Promise<any> {
  return mmAPI("POST", "/posts", { channel_id: channelId, message, root_id: rootId ?? "" });
}

async function deletePost(postId: string): Promise<void> {
  await mmAPI("DELETE", `/posts/${postId}`);
}

let BOT_USER_ID = "";
async function getBotUserId(): Promise<string> {
  if (!BOT_USER_ID) { const me = await mmAPI("GET", "/users/me"); BOT_USER_ID = me.id; }
  return BOT_USER_ID;
}

// ── Help message ──────────────────────────────────────────────────

const HELP_MESSAGE = `👋 I'm **ArthaVid** — your AI fintech content assistant.

Use hashtag combos to generate content:

**1️⃣ Topic Tags** — what it's about
\`#ipo\` \`#earnings\` \`#rbi\` \`#crypto\` \`#nifty\` \`#budget\` \`#startup\` \`#forex\` \`#gold\` \`#fii\` \`#sector\` \`#economy\`

**2️⃣ Format Tags** — where to post
\`#thread\` \`#li\` \`#ig\` \`#yt\` \`#all\` \`#score\` \`#hook\` \`#ideas\` \`#explain\` \`#story\`

**3️⃣ Stock/Trade Tags** — technical angle
\`#bull\` \`#bear\` \`#breakout\` \`#support\` \`#resistance\` \`#trend\` \`#volume\` \`#momentum\` \`#reversal\` \`#swing\` \`#intraday\` \`#longterm\` \`#dca\` \`#fundamentals\` \`#technical\` \`#risk\`

**🔥 Hacker News Integration** — real trending stories
\`#hn\` — show top fintech stories from HN right now
\`#hn #crypto\` — top crypto stories on HN
\`#hn #startup #thread\` — generate a thread from the top HN startup story

**Examples:**
\`@${BOT_USERNAME} #nifty #breakout #thread Nifty crossing 25000 today\`
\`@${BOT_USERNAME} #ipo #bear #li Ola Electric IPO overvalued\`
\`@${BOT_USERNAME} #hn #crypto\` — live HN crypto stories
\`@${BOT_USERNAME} #hn #startup #thread\` — thread from top HN startup story
\`@${BOT_USERNAME} #crypto #bull #hook Bitcoin hitting $100k\`

Mix any tags together — more tags = more specific output!`;

// ── Message handler ───────────────────────────────────────────────

async function handlePost(post: any): Promise<void> {
  const content: string = post.message ?? "";
  const mention = `@${BOT_USERNAME}`;
  if (!content.toLowerCase().includes(mention.toLowerCase())) return;

  const botId = await getBotUserId();
  if (post.user_id === botId) return;

  const cleanMessage = content.replace(new RegExp(`@${BOT_USERNAME}`, "gi"), "").trim();
  const threadRoot = post.root_id || post.id;

  if (!cleanMessage) {
    await createPost(post.channel_id, HELP_MESSAGE, threadRoot);
    return;
  }

  // ── Hacker News mode ──────────────────────────────────────────────
  if (/#hn\b/i.test(cleanMessage)) {
    const parsed = parseTags(cleanMessage);
    const topicTag = parsed.topicTags[0];
    const label    = topicTag ? `#${topicTag}` : "fintech";
    const query    = topicTag ? TOPIC_TO_HN_QUERY[topicTag] : "fintech startup technology";

    const thinkingPost = await createPost(post.channel_id, "🔍 Fetching from Hacker News...", threadRoot);

    try {
      const stories = await fetchHNStories(query);

      // If a format tag is explicitly in the message, generate content from the top story
      const hasExplicitFormat = Object.keys(FORMAT_PROMPTS).some(
        key => new RegExp(`#${key}\\b`, "i").test(cleanMessage)
      );
      if (stories.length > 0 && hasExplicitFormat) {
        const top = stories[0];
        const storyContext = `Title: "${top.title}"\nURL: ${top.url ?? "N/A"}\nHN Score: ${top.points} pts | ${top.num_comments} comments\n\nThis is a REAL trending story on Hacker News right now. Use this as your source.`;
        const contentPrompt = buildPrompt(parsed);
        const [storiesMsg, contentMsg] = await Promise.all([
          Promise.resolve(formatHNStories(stories, label)),
          askGroq(contentPrompt, storyContext),
        ]);

        await deletePost(thinkingPost.id);
        await createPost(post.channel_id, storiesMsg, threadRoot);
        await createPost(post.channel_id, `✍️ **Content based on top story:**\n\n${contentMsg}`, threadRoot);
      } else {
        await deletePost(thinkingPost.id);
        await createPost(post.channel_id, formatHNStories(stories, label), threadRoot);
      }
    } catch (err) {
      await deletePost(thinkingPost.id).catch(() => {});
      await createPost(post.channel_id, `❌ HN fetch failed: ${err instanceof Error ? err.message : "unknown"}`, threadRoot);
    }
    return;
  }

  const parsed = parseTags(cleanMessage);
  const prompt = buildPrompt(parsed);

  const tagSummary = [
    ...parsed.topicTags.map(t => `#${t}`),
    ...parsed.tradeTags.map(t => `#${t}`),
    `#${parsed.formatTag}`,
  ].join(" ");

  console.log(`[ArthaVid] ${tagSummary} | "${parsed.content}"`);

  const thinkingPost = await createPost(post.channel_id, "✍️ Working on it...", threadRoot);

  try {
    const response = await askGroq(prompt, parsed.content);
    await deletePost(thinkingPost.id);
    await createPost(post.channel_id, response, threadRoot);
  } catch (err) {
    await deletePost(thinkingPost.id).catch(() => {});
    await createPost(
      post.channel_id,
      `❌ Error: ${err instanceof Error ? err.message : "unknown error"}`,
      threadRoot
    );
    console.error("[ArthaVid] Error:", err);
  }
}

// ── WebSocket ─────────────────────────────────────────────────────

let seqNum = 1;

function connect(): void {
  const wsUrl = MM_URL.replace(/^http/, "ws") + "/api/v4/websocket";
  console.log(`[ArthaVid] Connecting to ${wsUrl} ...`);
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    ws.send(JSON.stringify({ seq: seqNum++, action: "authentication_challenge", data: { token: BOT_TOKEN } }));
  });

  ws.on("message", (raw: Buffer) => {
    let msg: any;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.event === "hello") {
      console.log("[ArthaVid] ✅ Authenticated!");
      console.log(`[ArthaVid] Listening for @${BOT_USERNAME} ...\n`);
    }
    if (msg.event === "posted") {
      try { handlePost(JSON.parse(msg.data.post)).catch(console.error); } catch {}
    }
  });

  ws.on("error", (err) => console.error("[ArthaVid] WS error:", err.message));
  ws.on("close", () => { console.log("[ArthaVid] Disconnected — reconnecting in 5s..."); setTimeout(connect, 5000); });

  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ seq: seqNum++, action: "ping" }));
  }, 30_000);
}

// ── Boot ──────────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════╗
║   ArthaVid — AI Fintech Content Bot      ║
║   Powered by Groq · Free                 ║
╠══════════════════════════════════════════╣
║  Bot:   @${BOT_USERNAME.padEnd(30)}  ║
║  Model: ${MODEL.padEnd(31)}  ║
╚══════════════════════════════════════════╝
`);

connect();
process.on("SIGINT", () => { console.log("\n[ArthaVid] Shutting down..."); process.exit(0); });
