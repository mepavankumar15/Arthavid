# ArthaVid — Command Reference

> Mix hashtags from 3 categories to generate exactly the content you need.
> Usage: `@arthavid #[topic] #[trade] #[format] [your text]`

---

## 1️⃣ Topic Tags — What it's about

| Tag | Use for |
|-----|---------|
| `#ipo` | IPO analysis — price, GMP, bull/bear case |
| `#earnings` | Company results — revenue, profit, vs estimates |
| `#rbi` | RBI/monetary policy — rate decisions, market impact |
| `#crypto` | Cryptocurrency — price, news, India regulatory angle |
| `#nifty` | Nifty50/Sensex/indices — market moves, sector performance |
| `#budget` | Union Budget/fiscal policy — market impact, winners/losers |
| `#startup` | Startup ecosystem — funding, valuation, launches |
| `#forex` | Currency markets — INR movement, global factors |
| `#gold` | Gold/commodities — price move, why it matters |
| `#fii` | FII/DII flows — foreign investor activity, market direction |
| `#sector` | Sector analysis — key players, tailwinds, headwinds |
| `#economy` | Macro — GDP, inflation, jobs data, what it means |

---

## 2️⃣ Format Tags — Where to post

| Tag | Output |
|-----|--------|
| `#thread` | Twitter/X thread (5-7 tweets, 1/ 2/ 3/ format) |
| `#li` | LinkedIn post (150-300 words, professional but human) |
| `#ig` | Instagram caption (100-150 words + 15 hashtags) |
| `#yt` | YouTube title + SEO description + 10 tags |
| `#all` | All 4 platforms at once (repurpose) |
| `#score` | Score your draft 1-10 + brutally honest rewrite |
| `#hook` | 10 scroll-stopping opening lines |
| `#ideas` | 5 content ideas with angle, platform, hook |
| `#explain` | Simple explainer thread with real-world analogy |
| `#story` | Personal story post (paper trade, learning moment) |

> Default format is `#thread` if no format tag is used.

---

## 3️⃣ Stock/Trade Tags — Technical angle

| Tag | Adds this angle |
|-----|----------------|
| `#bull` | Bullish case — upside potential, catalysts, buy signal |
| `#bear` | Bearish case — downside risks, red flags, caution |
| `#breakout` | Breakout setup — key levels, volume confirmation |
| `#support` | Support levels — where buyers step in, what if it breaks |
| `#resistance` | Resistance levels — where sellers appear, what a break means |
| `#trend` | Trend analysis — up/down/sideways, what it signals |
| `#volume` | Volume analysis — unusual volume, accumulation vs distribution |
| `#momentum` | Momentum — accelerating or slowing, near-term implication |
| `#reversal` | Trend reversal signals — what to watch for confirmation |
| `#swing` | Swing trade angle — multi-day hold, entry/target/stoploss |
| `#intraday` | Intraday angle — key levels for the session |
| `#longterm` | Long-term investor angle — fundamentals, compounding |
| `#dca` | Dollar-cost averaging — is this a good DCA asset? |
| `#fundamentals` | Fundamental analysis — PE, revenue, margins, moat |
| `#technical` | Technical analysis — price action, chart patterns, levels |
| `#risk` | Risk management — what can go wrong, position sizing, stop loss |

---

## Example Combos

```
@arthavid #nifty #breakout #thread Nifty crossing 25000 today
```
→ Twitter thread on Nifty breakout above 25000

```
@arthavid #ipo #bear #li Ola Electric IPO at ₹76 — overvalued?
```
→ LinkedIn post with bearish take on Ola Electric IPO

```
@arthavid #earnings #fundamentals #yt Reliance Q3 missed estimates
```
→ YouTube video package analyzing Reliance earnings fundamentally

```
@arthavid #crypto #bull #hook Bitcoin crossed $100k
```
→ 10 scroll-stopping hooks for a bullish Bitcoin post

```
@arthavid #rbi #li RBI kept rates unchanged today
```
→ LinkedIn post on RBI policy decision

```
@arthavid #swing #risk #ideas Bank Nifty this week
```
→ 5 swing trade content ideas for Bank Nifty with risk angle

```
@arthavid #nifty #technical #score [paste your draft here]
```
→ Score and improve your Nifty technical analysis post

```
@arthavid #startup #all Zepto raised $1B at $5B valuation
```
→ All 4 platform versions for Zepto funding news

---

## 4️⃣ Live Data — Hacker News

| Command | What it does |
|---------|-------------|
| `#hn` | Top 5 fintech/tech stories trending on HN right now |
| `#hn #crypto` | Top crypto stories on HN |
| `#hn #startup` | Top startup/VC stories on HN |
| `#hn #ipo` | IPO-related HN stories |
| `#hn #crypto #thread` | Fetches top HN crypto story + generates a Twitter thread from it |
| `#hn #startup #li` | Fetches top HN startup story + writes a LinkedIn post from it |

> **How it works:** Uses the free Algolia HN API — no API key needed. Stories are filtered by topic and sorted by HN score (upvotes). Adding a format tag (`#thread`, `#li`, etc.) makes the bot generate content directly from the top trending story.

---

## Tips

- **More tags = more specific output** — combine freely
- No format tag? Defaults to `#thread`
- Use `#score` before posting anything — it makes your content noticeably better
- Use `#all` after creating something good — instant content calendar
- `#bear` on a stock you're watching = great contrarian content that drives engagement
- `#hn #[topic] #thread` = content grounded in real trending stories, not AI guesses — judges love this
