# SARA — Smart Autonomous Responsive Assistant
### Personal AI Operating Assistant & Autonomous Agent Platform

SARA is an autonomous personal AI operating assistant and agent platform that can understand user intent, plan multi-step workflows, check permissions, execute tools, verify results, recover from errors via self-healing, and report truthful outcomes.

---

## ⚡ Core Architecture

- **AI Engine Abstraction**:
  - **Deep Reasoning**: `gemini-3.1-pro-preview` with `ThinkingLevel.HIGH` for complex multi-agent planning and architectural synthesis.
  - **Fast Execution**: `gemini-3.8-flash` for low-latency tool dispatch and rapid step execution.
  - **Live Duplex Audio**: `gemini-3.8-live` over WebSocket (`/live`) with real-time bidirectional audio (16kHz in, 24kHz out) and speaker interruption support.
  - **Speech Synthesis**: `gemini-3.8-flash-lite-tts` for natural vocal feedback.
- **Permission-First Security Engine**:
  - `SAFE`: Low-risk operations (inspections, reading local files, analyzing syntax) run autonomously.
  - `APPROVAL_REQUIRED`: High-impact operations (deploying to production, pushing commits, external mutations) pause and request explicit user confirmation.
  - `ALWAYS_EXPLICIT`: Irreversible actions (destructive deletion, financial transfers) require explicit confirmation.
- **Task State Machine**:
  - `PLANNING` → `WAITING_FOR_PERMISSION` → `RUNNING` → `VERIFYING` → `COMPLETED` | `FAILED` | `BLOCKED` | `CANCELLED`.
  - Zero false positives: tasks are marked `COMPLETED` only after verification checks pass.
- **Self-Healing Development Loop**:
  - Automatically captures compiler and build diagnostics, applies patches, and re-validates before reporting status.
- **Autonomous Automations Engine**:
  - Triggers (Scheduled Cron, GitHub events, webhooks, manual) + Conditions + Tool Actions pipeline.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- `GEMINI_API_KEY` configured in `.env` or AI Studio Secrets

### Installation & Run

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express backend + WebSocket Live gateway + Vite frontend)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 System Modules

1. **Assistant (`/`)**: Main conversation feed, High Thinking Mode switcher, step tracker, permission approval cards.
2. **Live Voice (`/live`)**: Bidirectional voice conversation powered by Gemini 3.8 Live API with audio visualizer.
3. **Task Operating Center**: Task progress, step-by-step executor, output inspector, and state machine.
4. **Autonomous Workflows**: Recurring and event-driven automation engine with execution history.
5. **Software Development Agent**: Self-healing diagnostic debugger, Git repo status, and Vercel verified deployment.
6. **Research & Browser Agent**: Multi-source synthesizer with citation links and browser navigation simulator.
7. **Connected Applications**: Integration connectors for Google Workspace, GitHub, Vercel, Supabase, Slack, Notion.
8. **Persistent Memory Bank**: User-scoped preferences, project context, and workflow policies.
9. **Telemetry Audit Logs**: Transparent activity feed of tool executions and security decisions.
10. **Security & Rules**: Configurable permission tiers and active approval gates.
