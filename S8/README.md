# ERA V5 — Session 8

## Attention, Chronologically

Web app: chronological timeline of attention mechanisms (problem → trade-offs → when to pick).

- **App folder:** [`attention-timeline/`](./attention-timeline/)
- **Live:** *(Netlify URL after deploy)*
- **Date sources:** see [`attention-timeline/README.md`](./attention-timeline/README.md)

### Question 2 (short)

In date order the field oscillates: pay for exact n² attention → reclaim decode memory (MQA/GQA/MLA) → reclaim length (RoPE/ALiBi/windows/sinks/YaRN) → reclaim memory again under long context → change asymptotics (linear/delta) → drop positional scaffolds (DroPE). That oscillation is invisible in a family-grouped list.

### Bonus mechanisms not on the lecture checklist

| Mechanism | Date | Source |
|-----------|------|--------|
| Sparse Transformer | 2019-04-23 | [arXiv:1904.10509](https://arxiv.org/abs/1904.10509) |
| FlashAttention | 2022-05-27 | [arXiv:2205.14135](https://arxiv.org/abs/2205.14135) |
| Position Interpolation | 2023-06-27 | [arXiv:2306.15595](https://arxiv.org/abs/2306.15595) |
| Ring Attention | 2023-10-03 | [arXiv:2310.01889](https://arxiv.org/abs/2310.01889) |
| Infini-attention | 2024-04-10 | [arXiv:2404.07143](https://arxiv.org/abs/2404.07143) |

### Course-page correction

DroPE is listed as 2024 on the Session 8 page; Sakana’s paper is [arXiv:2512.12167](https://arxiv.org/abs/2512.12167) (**13 Dec 2025**).
