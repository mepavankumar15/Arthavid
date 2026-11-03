# ContentMind — AI Content Creation Bot

Your AI content creation assistant, living directly in Switch (Mattermost).

Built for the **WeMakeDevs "Flip the Switch" Hackathon**.

## What it does

| You say | ContentMind does |
|---------|-----------------|
| `@avyu150 thread how to learn coding fast` | Writes a full Twitter/X thread |
| `@avyu150 linkedin remote work productivity` | Writes a LinkedIn post |
| `@avyu150 instagram morning routine` | Caption + 15 hashtags |
| `@avyu150 youtube how to build a SaaS` | SEO title + description + tags |
| `@avyu150 repurpose [paste content here]` | Rewrites for all 4 platforms |
| `@avyu150 ideas coding tutorials` | 5 content ideas with descriptions |
| `@avyu150 hook developer productivity` | 10 scroll-stopping opening lines |

## Tech stack

- **Runtime**: Node.js + TypeScript
- **Chat**: Mattermost (via Switch local server)
- **AI**: [Groq](https://console.groq.com) (Llama 3.3 70B) — free tier
- **Protocol**: Mattermost WebSocket API

## Setup

### 1. Install
```bash
npm install
cp .env.example .env
```

### 2. Fill in .env
```
MATTERMOST_URL=http://localhost:54597
MATTERMOST_BOT_TOKEN=<your bot token from Mattermost>
BOT_USERNAME=avyu150
GROQ_API_KEY=<your free Groq API key>
```

### 3. Run
```bash
npm run dev
```

Go to Mattermost → Town Square → type `@avyu150 thread [your topic]`
