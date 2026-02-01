# Relay AI Triage: Reliability & Safety Upgrade

## One‑Line Pitch
Upgrade Relay AI’s triage engine to deliver consistent categories, safer routing, and configurable actions—cutting manual review time while improving trust.

## The Problem
Support teams lose time due to:
- inconsistent AI categorization
- poor urgency scoring for short critical messages
- no confidence or review signal
- static, incorrect recommendations
- exposed API keys and no operational controls

## The Solution
This upgrade adds:
- **Structured multi‑label categorization** with confidence scores
- **Needs‑review flag** driven by confidence, multi‑label, and PII detection
- **Keyword‑weighted urgency scoring** for critical short messages
- **Configurable templates and routing rules** per team
- **Audit log + CSV export** for QA and training data
- **Backend LLM proxy** for secure API usage
- **Caching + retry** to control cost and latency

## Why It Matters
- **Faster routing**: fewer misroutes and re-triage
- **Safer handling**: PII and low confidence get flagged
- **Operational control**: teams can edit actions and routing without code
- **Better ROI**: fewer LLM calls through caching + retries

## Expected Impact
- 30–50% reduction in manual review time
- 2–3x improvement in urgent message detection
- lower support risk due to PII and confidence flags

## Next Steps
- Add multi‑team SLAs and auto‑assignments
- Analytics dashboard for false positives/negatives
- Human‑in‑the‑loop review queue
