# Loom Pitch Scripts — Customer Inbox Triage Tool

---

## 🎬 2-MINUTE VERSION

### Opening (15 sec)
> "Hey everyone! I'm Ismael, and I'm going to walk you through a customer support triage tool I built for Relay AI. The goal? Help support teams handle high volumes of customer messages by automatically categorizing, prioritizing, and routing them to the right person."

### The Problem (20 sec)
> "Picture this: you're a support agent staring at 200 unread emails. Some are people whose servers are down — they need help NOW. Others are just saying 'love your product!' But they all look the same in your inbox. You're playing whack-a-mole hoping you don't miss something urgent. That's the problem this tool solves."

### The Solution (45 sec)
> "My triage tool uses AI to analyze each message and give you three things instantly:
>
> **One** — a category like Billing, Technical Problem, or Outage.
>
> **Two** — an urgency score: High, Medium, or Low. And it's smart — it looks for keywords like 'server down' or 'can't access my account,' weighs them, even detects sentiment like frustration.
>
> **Three** — a recommended action. Should this go to a senior engineer? Does it need escalation? The tool tells you.
>
> I also built in PII detection — so if someone accidentally drops their SSN or credit card, we flag it. And there's a bulk processing mode for handling 50 messages at once."

### Technical Highlights (25 sec)
> "Under the hood, it's React and Vite on the frontend, Node/Express backend, and Groq's Llama 3.3 70B for the AI categorization. I added confidence scores, SLA-based response times, and a full analytics dashboard so managers can see trends — like escalation rates and which categories are spiking."

### Closing (15 sec)
> "This is my baseline. In 8 weeks, I want to add real-time webhooks, Slack integration, and maybe train a custom model on actual support data. Thanks for watching — excited to show you where this goes!"

---

## 🎬 5-MINUTE VERSION

### Opening (30 sec)
> "Hey everyone! I'm Ismael. Today I'm walking you through a project I'm really proud of — a customer inbox triage tool built for Relay AI's Week 2 assessment. 
>
> The mission was simple: take a starter codebase, identify what's broken or missing, and make it production-ready. What I ended up building goes way beyond that. Let me show you."

### The Problem (45 sec)
> "Let's set the scene. You're running customer support for a growing SaaS company. Every day, hundreds of messages flood in — billing questions, feature requests, people whose entire business is down because of a bug.
>
> The challenge? They all look the same. A frustrated customer might write 'This is unacceptable, nothing works' — sounds urgent, right? But maybe they're just upset about a minor UI change. Meanwhile, someone else writes 'Hey, quick question, our production database seems offline' — sounds casual, but that's a five-alarm fire.
>
> Human agents are great, but they can't read 200 messages in 10 seconds. They need help triaging. That's exactly what this tool does."

### The Solution — Demo Walkthrough (90 sec)
> "Let me walk you through the features.
>
> **Analyze Page**: Paste any customer message, hit analyze. The AI returns the category — Billing Issue, Technical Problem, Outage, Account Access, Feature Request, and more. It also gives you an urgency score.
>
> But here's where it gets interesting. My urgency scorer isn't just keyword matching. It uses regex with word boundaries so 'emergency' doesn't trigger on 'emergence.' It weighs critical keywords like 'outage' and 'security breach' at 50-70 points, while frustration words like 'delayed' or 'unable' get 15-40. It even detects positive sentiment — if someone says 'love your product,' that lowers urgency.
>
> **Recommended Actions**: Based on category and urgency, the tool suggests next steps. Billing issues go to the billing team. High-urgency outages get escalated to senior engineers immediately.
>
> **PII Detection**: If someone shares a credit card number, SSN, or phone number, we flag it. There's even a profanity filter for messages that might need special handling.
>
> **Bulk Processing**: Support managers can paste 50 messages at once and get a full breakdown — how many are high urgency, how many need human review, how many should escalate. It's like an X-ray of your inbox.
>
> **Dashboard**: Analytics for managers — total messages processed, category distribution, urgency breakdown, average confidence scores, escalation rates. You can spot trends like 'Outage reports spiked 40% today' at a glance."

### Technical Architecture (60 sec)
> "Let me talk about what's under the hood.
>
> **Frontend**: React 19 with Vite for fast builds, Tailwind CSS for styling. Clean component architecture — pages for Analyze, Bulk, History, Dashboard, Settings.
>
> **Backend**: Node.js with Express. This is important — I moved all AI calls to the server so API keys never hit the browser. There's retry logic with exponential backoff — if Groq's API hiccups, we wait 1 second, then 2, then 4, instead of failing immediately.
>
> **AI**: Groq's Llama 3.3 70B model. I crafted the prompt with few-shot examples — I literally show the model 'here's a billing message, here's how to categorize it' — so it's more accurate than generic instructions.
>
> **Validation Layer**: Client-side validation catches issues before they hit the API. PII regex patterns, spam detection, profanity filtering, sentiment extraction — all running locally for speed.
>
> **Storage**: LocalStorage for history, which means everything persists between sessions. The History page shows a full audit trail with CSV export."

### What I Learned (45 sec)
> "This project taught me a lot.
>
> First — **prompt engineering matters**. My initial prompt gave inconsistent results. Adding few-shot examples and structured JSON output made the AI dramatically more reliable.
>
> Second — **edge cases are everything**. A simple keyword match for 'urgent' would fire on spam. Word boundaries and regex patterns fixed that.
>
> Third — **user experience is about trust**. Confidence scores, 'needs review' flags, and SLA response times aren't just nice-to-haves — they tell users when to trust the AI and when to double-check."

### What's Next (30 sec)
> "This is my baseline. Here's where I want to take it over the next 8 weeks:
>
> - **Real-time webhooks** — messages triaged the moment they hit the inbox
> - **Slack/Teams integration** — alerts for high-urgency issues
> - **Custom model fine-tuning** — train on real support data for higher accuracy
> - **Multi-language support** — our customers aren't all English speakers
>
> I'm excited to come back in 8 weeks and show you how far this has grown."

### Closing (20 sec)
> "That's the customer inbox triage tool. It takes chaos — hundreds of messages with no structure — and turns it into actionable priorities. Built with React, Node, and Llama 3.3, polished to production quality.
>
> Thanks for watching. Can't wait to show you the next iteration!"

---

## 📝 Tips for Recording

1. **Screen share the app** while you talk — show the Analyze page, paste a message, show results
2. **Use the sample messages** in `sample-messages.json` for demo
3. **Show the Dashboard** to highlight analytics
4. **Keep energy up** — you're excited about this!
5. **Don't read verbatim** — use these as talking points, be natural

Good luck! 🚀
