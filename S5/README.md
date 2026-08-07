# ERA V5 - S5 — Mixture & Curriculum Specification

**Session:** Data Mixtures and Curriculum (EVA5 / ERA V5 Session 5)  
**Claim:** a mixture is a **capability decision composed backward from the benchmarks you intend to pass**  
**Budget frame:** planning numbers below use the course composer’s **2T-token** run (scales linearly)

> Every share is a **hypothesis**. It is not trusted at full scale until **1B and 3B proxy runs** confirm or refute it (§7).

---

## 0. Target model (from Session 5)

We are composing a mixture that deliberately produces:

1. **Coding + agentic** — Codex-style: plan, call tools across steps, read results, recover, hold growing task history  
2. **Controllable reasoning** — short effort on easy problems, longer/deeper on hard ones  
3. **Native Indic** — primary differentiator; protected so English web cannot push it out  

Same clean shards → different models if mixture / stage / frequency change.

---

## 1. Capability mixture — main pretraining run

Session 5’s default composer is **general-web-heavy**. Scarce lanes (**agentic**, **verified Indic**, **long reasoning**) stay **small on purpose** here and are **concentrated in the short anneal**.

| Slot | Share | @ 2T demand | Inventory fill (Session 5 + S3/S4) | Benchmarks this share is meant to win | Supply status @ 2T |
|------|------:|------------:|-----------------------------------|----------------------------------------|--------------------|
| **General web** | **34%** | 680B | FineWeb-Edu, DCLM / Nemotron-CC extracts, cleaned CC (S4 pipeline) | MMLU | **Covered** (~4.8T supply) |
| **Code** | **24%** | 480B | The Stack v2 (~900B), D3 Code / V4 (~199B), CommitPack (~4B) → ~1.1T class | LiveCodeBench, Aider | **Covered** (~1.1T) |
| **Indic** | **16%** | 320B | Verified native + unverified crawl + translated + synthetic (§2); Sangraha / IndicCorp / wiki | MILU, IndicGenBench | **Needs repetition** (supply ~276B) |
| **STEM / math** | **12%** | 240B | arXiv, Proof-Pile, OpenWebMath, Dolmino-class math | AIME, GPQA, HLE | **Covered** (~250B) |
| **Reasoning traces** | **6%** | 120B | Process / CoT open sets; held mostly for anneal uplift | AIME/GPQA process quality | **Needs repetition** (~85B) |
| **Long-context** | **6%** | 120B | Packed books, multi-doc wiki, long repos, concatenated judgments | long-eval | **Needs repetition** (~100B) |
| **Agentic / tool-use** | **2%** | 40B | ToolBench, Glaive FC, ToolACE, xLAM/APIGen, NexusRaven, SWE-bench traces, … (~0.63B unique) | SWE-bench, τ-bench, BFCL, GAIA, BrowseComp | **Must synthesize** |

**Total = 100%.**

### Why these shares (defended, not copied blindly)

- Align with Session 5’s **main-pretrain preset** so the plan matches the course inventory math and “funded vs starved” framing.  
- **Agentic at 2%** is intentional poverty in pretrain: unique supply is **~0.63B** vs **40B** demand → saying “5–15% agentic from crawls” would be wishful accounting. Pretrain teaches *syntax* of tools; **anneal + SFT/RL** carry real agentic weight.  
- **Indic at 16%** is higher than V4’s protected 8% mean exposure target for India-first, but still honest: **320B demand > ~276B supply** → we **repeat** verified-heavy packs rather than invent native tokens.  
- **Code 24% / STEM 12%** fund LiveCodeBench/Aider and AIME/GPQA/HLE without starving web breadth (34%).

### India civic & dialogue (not separate composer slots)

Session 5’s taxonomy has **seven** lanes. India civic / forums are **not** fake eighth/ninth slots:

- **India civic** → counted inside **Indic verified** + a slice of **General web** (English IndiaCode / judgments) with explicit packing tags  
- **Dialogue / forums** → **General web** (Reddit/SE after ghost-tag unification) + Indic conversational in **Indic unverified/translated**

---

## 2. Indic slot — tier split (of the 16% / 320B @ 2T)

Session 5 requires the split across **verified / unverified / translated / synthetic**. It does **not** prescribe percentages — these are our defended hypothesis:

| Tier | % of Indic | Tokens @ 2T | What counts | Why this % |
|------|-----------:|------------:|-------------|------------|
| **Verified** | **35%** | 112B | Native wiki, audited books/news, gov/legal OCR spot-checked, IndicCorp **verified** slices | “Sort by verified native tokens, not headline dataset size.” Anchor quality. |
| **Unverified** | **25%** | 80B | AIR/Bharat/Sangraha web after S4 clean + LID pass | Volume; capped so marketing crawl doesn’t define the model |
| **Translated** | **20%** | 64B | EN→Indic MT with back-translation filter (Samanantar-class) | Structure/parallel; translationese risk → ≤20% |
| **Synthetic** | **20%** | 64B | Filtered textbook Q&A / paraphrase / instruct over verified seeds | **Required gap filler**: 25% Indic cannot be met from verified alone (Session 5). Hard-capped to avoid Sangraha-style ~65% synth culture |

**Focus languages:** HI, MR, BN, GU, PA, OR, TA, TE, KN, ML (+ Hinglish). Others via byte-fallback.

---

## 3. Protected always-on floor

| Rule | Value |
|------|------:|
| **Always-on floor (every batch)** | **8% Indic** (V4 production lesson; Session 5 OPUS demo) |
| **Extended protection (V5)** | Selector may not let **Indic**, **agentic**, or **reasoning** fall below configured floors: Indic **8%**, agentic **1%**, reasoning traces **2%** |
| Aggressive EN quality (OPUS-style) | **Does not apply** to always-on protected draws |

Rationale: English-heavy selectors erase scarce lanes. Session 5: “V5 extends the same protection to Indic, agentic and reasoning.” Floors are **minima**; mean Indic target remains **16%**.

---

## 4. Anneal reserve (cooldown)

| Parameter | Commitment |
|-----------|------------|
| **Lifecycle size** | Mid-train / anneal ≈ **~2% of total tokens** (pretrain ~95%; SFT/reasoning/pref each &lt;1%) |
| **Hold-back reserve** | **Tier-A scarce data held out of early training:** best **verified Indic**, **agentic**, and **long reasoning** packs — target hold-back **≥80B tokens** tagged `anneal_only` (not spent in Seed/General) |
| **Anneal mix behavior** | General web **falls sharply**; **code, reasoning, Indic, agentic** receive much larger shares (Session 5 annealing preset) |
| **LR** | Low-LR cooldown on held-back best data |

Hypothesis: “the best data must be saved deliberately, not merely discovered at the end.”

**Mixture-shift safety:** change shares only inside a **warmup band of several billion tokens**; avoid spikes like V4’s Hindi ~150× gradient (instability ~3×).

---

## 5. Curriculum stages & bands

### Pretrain diet order (Session 5)

**Seed** (warm start) → **General** (broad base) → **Reasoning** (code + logic) → **Long-context** (stretch ctx) → **Anneal** (low-LR cool)

Illustrative early **Seed→General** snapshot (~40% of tokens into General): web **~51%**, code **~17%**, Indic **16%**, STEM **~10%**, reasoning **~4%**, long-ctx **~2%** — “the model does not need 55% web forever.”

### Difficulty bands (B0–B5) — with examples

| Band | Level | Example |
|------|-------|---------|
| **B0** Nursery | Simple children’s sentences | “The cat sat on the mat.” |
| **B1** Grade-school | Basic school text | “If Ravi has 3 apples and gets 2 more, how many?” |
| **B2** High-school | Secondary material | “Factor \(x^2-5x+6\). Explain each step.” |
| **B3** Undergraduate | Coursework | “Derive the normal equations for least squares.” |
| **B4** Graduate | Advanced texts | “State and sketch the proof of the central limit theorem.” |
| **B5** Research / PhD | Papers | arXiv-style abstract + method section packing |

### Reasoning-length / effort dial — with examples

Effort is **quantised by training**, not a smooth knob. Hard+short ≠ easy+ultra.

| Band | Meaning | Example behavior |
|------|---------|------------------|
| **LOW / short** | Near-direct | “Integers 1–1000 divisible by 3 or 5?” → answer **467** with ~tens of tokens (~62% thin solve in Session demo) |
| **MEDIUM** | A few steps | Same problem with explicit inclusion-exclusion written out |
| **HIGH / long** | Derive + check | Derive formula, recompute, verify edge cases |
| **ULTRA** | Deliberate + verify | Multiple candidate approaches + self-critique before final |

**Agentic difficulty contrast:** BFCL-style schema + 1 call vs ~10-step tool use + recovery.

---

## 6. Wishful-accounting refusal

| Lane | Demand @ 2T | Real supply order | Honest policy |
|------|------------:|-------------------|---------------|
| Agentic | 40B | **~0.63B** unique | **Must synthesize** (ToolACE/xLAM-style + verified trajectories); pretrain share stays **2%** |
| Indic | 320B | **~276B** | **Repetition** of verified-heavy packs + tiered synth ≤20% of Indic |
| Reasoning | 120B | **~85B** | **Repetition** + anneal concentration |
| Long-context | 120B | **~100B** | **Repetition** / packing; no fake “books we don’t have” |
| Code / STEM / Web | 480B / 240B / 680B | 1.1T / 250B / 4.8T | **Covered** |

---

## 7. Proxy experiments (required before full scale)

### Proxy A — Indic floor @ **1B** / 20B tokens

| | |
|--|--|
| Arms | Always-on Indic **4% vs 8% vs 12%** |
| Metrics | MILU or Belebele (HI, TE); MMLU-lite |
| Confirm | Indic +≥2 pts from 4→8%; EN drop ≤0.5 |
| Refute | EN collapse &gt;1 **or** Indic flat → revise floor |

### Proxy B — Agentic synth vs crawl fantasy @ **3B** / 60B tokens

| | |
|--|--|
| Arms | Agentic **2% synth-heavy** vs **2% thin real-only** vs **8% (would require fake supply)** — third arm only if synth factory ready |
| Metrics | BFCL schema validity; τ-bench or SWE-bench lite subset |
| Confirm | 2% synth-heavy beats real-only on tool metrics without MMLU crash |
| Refute | Synth hurts general quality → cut synth, move agentic weight to anneal/SFT |

### Proxy C — Anneal hold-back @ **1B** / 20B tokens

| | |
|--|--|
| Arms | **No reserve** vs **≥80B-equivalent scaled hold-back** (~4% of 20B) spent only in final low-LR phase |
| Metrics | MMLU-lite, LiveCodeBench-lite, Belebele HI |
| Confirm | Anneal improves ≥1 pt on ≥1 primary metric without Indic drop |
| Refute | Indic regresses → raise verified Indic inside anneal preset |

**Promotion rule:** §1 shares ship to full V5 only if A and C pass; B informs anneal/SFT agentic factory sizing.

---

## 8. Cleaning aimed at starved slots (continues S4)

Priority for data-gating (mixture review only after these manifests exist):

1. **Agentic** — schema-valid JSON; drop broken traces; unify ghost tags → real special tokens  
2. **Verified Indic** — LID fail-loud; keep ZWNJ/ZWJ; no EN punctuation heuristics that delete Dravidian text  
3. **Reasoning traces** — decontaminate bench leaks; keep process, not only answers  
4. **Long-context packs** — hash after `clean_text()`; no cross-doc contamination  
5. **Code** — license filter; StarCoder↔Stack global dedup  

---

## 9. Review card (numbers to defend aloud)

| Commitment | Number |
|------------|--------|
| Main-pretrain slots | Web **34** · Code **24** · Indic **16** · STEM **12** · Reasoning **6** · Long-ctx **6** · Agentic **2** |
| Indic tiers V/U/T/S | **35 / 25 / 20 / 20** |
| Always-on floors | Indic **8%**; agentic **1%**; reasoning **2%** |
| Anneal | Stage **~2%** of tokens; hold-back **≥80B** Tier-A scarce @ 2T scale |
| Agentic honesty | Unique ~**0.63B** → **must synthesize**; not a crawl story |
| Proxies | **1B** floor · **3B** agentic · **1B** anneal |

---

## Repo

```
S5/
  README.md            ← this plan (submission surface)
  inventory.md         ← supply table
  proxy_protocol.md    ← pass/fail metrics
```

## Submission

Publish this repo and submit the GitHub **README.md** URL.

---

*Aligned to Session 5 composer inventory and curriculum language. Tier % and proxy arms are explicit hypotheses — not silent inventions of supply.*
