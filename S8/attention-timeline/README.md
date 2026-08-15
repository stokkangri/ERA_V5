# Attention, Chronologically

Interactive timeline of attention mechanisms in **launch order**, each framed as an answer to a bill the field was trying not to pay.

**Live app:** *(add Netlify URL after deploy)*  
**This folder:** static site (`index.html` + `data.js` + `app.js` + `styles.css`)

## Run locally

```bash
cd attention-timeline
python3 -m http.server 8765
# open http://localhost:8765
```

Or drag `index.html` into a browser (ES modules not required).

## What Question 2 asks — what the timeline shows

As a **list** (or grouped by family), these look like alternative recipes: MQA vs GQA vs MLA, RoPE vs ALiBi, linear vs softmax.

In **date order**, a different story appears:

1. **2017 — Exactness.** Scaled dot-product attention + positions. The field accepts the n² bill because the model finally works and parallelizes.
2. **2019 — First memory panic (decode).** MQA: training was fine; *serving* reloading per-head KV was not.
3. **2020 — Attack the asymptotics and locality.** Linear attention changes the math; sliding windows (Longformer) refuse to pay for distant keys you barely use.
4. **2021 — Length without new PE tables.** RoPE and ALiBi make relative distance first-class so models can grow context.
5. **2022 — Same math, better IO.** FlashAttention: the matrix was an HBM problem, not only a FLOP problem.
6. **2023 — Memory and length at once.** GQA walks back MQA’s quality hit; PI / NTK / YaRN stretch RoPE; sinks fix streaming windows; Ring Attention buys length with a cluster.
7. **2024 — Memory again, harder.** Long context made KV huge *again* → MLA compresses cache; delta / gated delta revive linear-time memory with better recall.
8. **2025 — Drop the scaffold.** DroPE: positional embeddings helped training but blocked extrapolation — so remove them after pretrain.

You cannot see that **oscillation** (exactness → memory → length → memory → asymptotics → drop PE) from a syllabus list. Once you see it, the next paper is predictable: either compress state further, or remove another training crutch that limits test-time length.

## Date sources (checked)

| Mechanism | Date used | Source |
|-----------|-----------|--------|
| Scaled Dot-Product Attention | 2017-06-12 | [Vaswani et al., arXiv:1706.03762](https://arxiv.org/abs/1706.03762) |
| Absolute learned PE | 2017-06-12 (alt. in Transformer); also Gehring et al. 2017-05-09 | [1706.03762](https://arxiv.org/abs/1706.03762), [1705.03122](https://arxiv.org/abs/1705.03122) |
| Sinusoidal PE | 2017-06-12 | [1706.03762](https://arxiv.org/abs/1706.03762) |
| Sparse Transformer | 2019-04-23 | [Child et al., 1904.10509](https://arxiv.org/abs/1904.10509) |
| MQA | 2019-11-06 | [Shazeer, 1911.02150](https://arxiv.org/abs/1911.02150) |
| Sliding window | 2020-04-10 (Longformer); Mistral prod. 2023-09-27 | [2004.05150](https://arxiv.org/abs/2004.05150) |
| Linear attention | 2020-06-29 | [Katharopoulos et al., 2006.16236](https://arxiv.org/abs/2006.16236) |
| RoPE | 2021-04-20 | [Su et al., 2104.09864](https://arxiv.org/abs/2104.09864) |
| ALiBi | 2021-08-27 | [Press et al., 2108.12409](https://arxiv.org/abs/2108.12409) |
| FlashAttention | 2022-05-27 | [Dao et al., 2205.14135](https://arxiv.org/abs/2205.14135) |
| GQA | 2023-05-22 | [Ainslie et al., 2305.13245](https://arxiv.org/abs/2305.13245) |
| Position Interpolation | 2023-06-27 | [Chen et al., 2306.15595](https://arxiv.org/abs/2306.15595) |
| NTK-aware RoPE | ~2023-06-29 | [bloc97 LocalLLaMA post](https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/ntkaware_scaled_rope_allows_llama_models_to_have/) (cited by YaRN) |
| YaRN | 2023-08-31 | [Peng et al., 2309.00071](https://arxiv.org/abs/2309.00071) |
| Attention sinks | 2023-09-29 | [Xiao et al., 2309.17453](https://arxiv.org/abs/2309.17453) |
| Ring Attention | 2023-10-03 | [Liu et al., 2310.01889](https://arxiv.org/abs/2310.01889) |
| Infini-attention | 2024-04-10 | [Munkhdalai et al., 2404.07143](https://arxiv.org/abs/2404.07143) |
| MLA | 2024-05-07 | [DeepSeek-V2, 2405.04434](https://arxiv.org/abs/2405.04434) |
| DeltaNet (scaled) | 2024-06-10 | [Yang et al., 2406.06484](https://arxiv.org/abs/2406.06484) |
| Gated DeltaNet | 2024-12-09 | [Yang et al., 2412.06464](https://arxiv.org/abs/2412.06464) |
| DroPE | **2025-12-13** | [Gelberg et al., 2512.12167](https://arxiv.org/abs/2512.12167) |

### Corrections / extras

- **DroPE year:** course page said 2024; arXiv first version is **13 Dec 2025**. Flagged in the app.
- **Sliding window:** taught via Mistral (2023), but Longformer published the pattern in **Apr 2020** — timeline uses the earlier paper date and notes Mistral.
- **Beyond the required list (bonus):** Sparse Transformer (2019), FlashAttention (2022), Position Interpolation (2023), Ring Attention (2023), Infini-attention (2024).

## Assignment coverage checklist

- [x] Standard scaled dot-product attention  
- [x] Absolute learned positions  
- [x] Sinusoidal PE  
- [x] RoPE, ALiBi  
- [x] MQA, GQA  
- [x] Sliding window, attention sinks  
- [x] NTK-aware scaling, YaRN  
- [x] Linear attention, delta rule, Gated DeltaNet  
- [x] MLA, sparse/top-k + DeepSeek-style compression  
- [x] DroPE  
- [x] Pros / cons / when to pick each  
- [x] Chronological order (not teaching order)

## Deploy (Netlify Drop)

1. Zip the contents of `attention-timeline/` (or deploy the folder).
2. Drag to [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Paste the live URL into the assignment + update this README.
