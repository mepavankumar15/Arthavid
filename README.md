# FinMind — AI Fintech Content Bot for Switch

> Turn market events into viral content in seconds — right from your team chat.

Built for the **[WeMakeDevs "Flip the Switch" Hackathon](https://www.wemakedevs.org/hackathons/switch)** · Powered by **Groq (free)** · Runs on **Switch (Mattermost)**

---

## The Problem

You're a student learning markets, paper trading, building financial literacy. You have opinions on IPOs, RBI policy, Nifty movements — but turning those thoughts into quality Twitter threads, LinkedIn posts, and YouTube content takes hours.

**FinMind solves this in seconds.**

---

## What It Does

FinMind is an AI agent that lives in your Switch workspace. Mention it with hashtag commands — it instantly creates platform-ready fintech content using Groq's LLM.

### 3-Tag Command System

Combine tags from 3 categories to get exactly the content you need:

| Category | Tags |
|----------|------|
| **1. Topic** | `#ipo` `#earnings` `#rbi` `#crypto` `#nifty` `#budget` `#startup` `#forex` `#gold` `#fii` `#sector` `#economy` |
| **2. Format** | `#thread` `#linkedin` `#instagram` `#youtube` `#all` `#score` `#hook` `#ideas` `#explain` `#story` |
| **3. Trade** | `#bull` `#bear` `#breakout` `#support` `#resistance` `#trend` `#volume` `#momentum` `#reversal` `#swing` `#intraday` `#longterm` `#fundamentals` `#technical` `#risk` `#dca` |
| **4. Live Data** | `#hn` — pulls top stories from Hacker News in real time |

### Example Commands

```
@finmind #nifty #breakout #thread Nifty crossing 25000 resistance today
```
→ Twitter thread on Nifty breakout

```
@finmind #ipo #bear #linkedin Ola Electric IPO at ₹76 — overvalued?
```
→ LinkedIn post with bearish IPO take

```
@finmind #crypto #bull #hook Bitcoin crossed $100k
```
→ 10 scroll-stopping opening lines for a bullish Bitcoin post

```
@finmind #earnings #fundamentals #youtube Reliance Q3 missed estimates
```
→ YouTube title + SEO description + tags

```
@finmind #rbi #all RBI kept rates unchanged today
```
→ All 4 platform versions at once

```
@finmind #score [paste your draft here]
```
→ Brutal 1-10 score + full rewrite

```
@finmind #hn #crypto
```
→ Top 5 crypto stories trending on Hacker News right now (live data, no API key)

```
@finmind #hn #startup #thread
```
→ Fetches the top HN startup story + generates a Twitter thread from it automatically

---

## Real Daily Workflow

**You see market news** → type one command → get content for Twitter, LinkedIn, Instagram, YouTube in under 10 seconds.

No more staring at a blank screen. No more spending 2 hours writing what FinMind writes in 10 seconds.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Chat platform | Switch (Mattermost — local Docker) |
| AI model | Groq API — `openai/gpt-oss-120b` (free) |
| Live data | Hacker News via Algolia API (free, no key) |
| Runtime | Node.js + TypeScript |
| Protocol | Mattermost WebSocket API |
| Cost | **$0** — entirely free stack |

---

## Setup

### Prerequisites
- [Switch Console](https://github.com/sandbox-quantum/switch/releases/latest) installed and running
- Node.js 18+
- Free [Groq API key](https://console.groq.com)

### 1. Install

```bash
git clone https://github.com/YOUR_USERNAME/finmind.git
cd finmind
npm install
cp .env.example .env
```

### 2. Create a bot in Mattermost

1. Open `http://localhost:54597` in your browser
2. Go to **Integrations → Bot Accounts → Add Bot Account**
3. Create a bot, copy the token

### 3. Configure `.env`

```env
MATTERMOST_URL=http://localhost:54597
MATTERMOST_BOT_TOKEN=your_bot_token_here
BOT_USERNAME=your_bot_username
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run

```bash
npm run dev
```

Go to Mattermost → mention your bot with any hashtag combo → get instant fintech content.

---

## Why This Workflow

Most AI content tools are generic. FinMind is built specifically for fintech creators:

- **Topic tags** give the bot market context automatically — no need to explain what an IPO or RBI rate decision is
- **Trade tags** add a specific analytical angle — bullish, bearish, technical, fundamental
- **Format tags** output for the exact platform you're posting to
- **Runs in your chat** — no browser tabs, no context switching, no copy-pasting between tools

---

## Built With Free Tools Only

| Tool | Free tier used |
|------|---------------|
| Groq | Free API — fast LLM inference |
| Switch | Open source — self-hosted |
| Mattermost | Open source — bundled with Switch |
| Node.js | Open source |

Zero paid APIs. Zero subscriptions. Runs entirely on your own machine.

---

*Built for the WeMakeDevs "Flip the Switch" Hackathon — Nov 4–7, 2026*
