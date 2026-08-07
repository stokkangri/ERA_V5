# Proxy protocol (Session 5 requirement)

Mixture numbers are hypotheses until **1B and 3B** proxies test them.

## Shared

- Freeze tokenizer across arms  
- Same S4 cleaning gates  
- Log **actual** drawn mixture every 1B tokens  
- Report mean ± std over seeds {0,1,2}

## Proxy A — Indic floor @ 1B / 20B tokens

| Item | Spec |
|------|------|
| Arms | Always-on Indic **4% / 8% / 12%** |
| Metrics | Belebele or MILU (HI, TE); MMLU-lite |
| Pass | Indic +≥2 pts (4→8%); EN drop ≤0.5 |
| Fail | EN drop &gt;1 or Indic flat |

## Proxy B — Agentic honesty @ 3B / 60B tokens

| Item | Spec |
|------|------|
| Arms | Agentic **2% synth-heavy** vs **2% real-only** |
| Metrics | BFCL schema validity; τ-bench or SWE-bench lite |
| Pass | Synth-heavy wins tools without MMLU crash |
| Fail | Synth regresses general quality → push agentic to anneal/SFT |

## Proxy C — Anneal hold-back @ 1B / 20B tokens

| Item | Spec |
|------|------|
| Arms | No reserve vs scaled `anneal_only` hold-back (~4% of run) |
| Metrics | MMLU-lite, LiveCodeBench-lite, Belebele HI |
| Pass | ≥1 pt gain on a primary metric; no Indic drop |
| Fail | Indic regresses → raise verified Indic in anneal preset |

## Report stub

```
proxy: A|B|C
arm: ...
tokens_seen: ...
metrics: {...}
decision: promote | adjust | abort
```
