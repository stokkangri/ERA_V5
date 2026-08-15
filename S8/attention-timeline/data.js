/**
 * Chronological attention mechanisms.
 * dateISO = first public appearance we could verify (arXiv v1 / release / post).
 * Sources listed in README.md — do not invent dates.
 */
window.ATTENTION_MECHANISMS = [
  {
    id: "sdp",
    year: 2017,
    dateISO: "2017-06-12",
    dateLabel: "Jun 2017",
    name: "Scaled Dot-Product Attention",
    short: "Vanilla softmax attention",
    era: "exactness",
    problem:
      "RNNs were sequential and hard to parallelize. Sequence models needed a way for every token to look at every other token in one shot.",
    answer:
      "Compute Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V. Multi-head lets different heads specialize. Exact, dense, and fully parallel over the sequence during training.",
    buys: "Expressive all-to-all mixing; the default quality floor everything else is judged against.",
    costs: "O(n²) compute and memory in sequence length. KV cache grows linearly with n × heads × layers at decode time.",
    pickWhen:
      "Short-to-medium context (roughly ≤4–8K) when quality matters more than memory — teaching demos, 2K chatbots, research baselines.",
    formula: "softmax(QKᵀ / √dₖ) V",
    source: {
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      url: "https://arxiv.org/abs/1706.03762",
      note: "arXiv v1: 12 Jun 2017",
    },
    bonus: false,
  },
  {
    id: "abs-pe",
    year: 2017,
    dateISO: "2017-06-12",
    dateLabel: "Jun 2017",
    name: "Absolute Learned Positions",
    short: "Trainable position vectors",
    era: "exactness",
    problem:
      "Self-attention is permutation-invariant. Without position signals, “dog bites man” and “man bites dog” look the same.",
    answer:
      "Add a learned embedding vector e_pos for each absolute index. The Transformer paper treats this as a drop-in alternative to sinusoids; ConvS2S used learned absolute PE slightly earlier (May 2017).",
    buys: "Simple, flexible, can fit whatever positional quirks the data has inside the training length.",
    costs: "Does not extrapolate past the max training index. Absolute indices do not transfer cleanly to longer contexts.",
    pickWhen:
      "Fixed, short context windows where you will never need to go beyond train length.",
    formula: "xᵢ ← xᵢ + Emb(i)",
    source: {
      title: "Attention Is All You Need §3.5 (learned PE alternative)",
      authors: "Vaswani et al.",
      url: "https://arxiv.org/abs/1706.03762",
      note: "Also Gehring et al. ConvS2S, arXiv:1705.03122 (9 May 2017)",
    },
    bonus: false,
  },
  {
    id: "sin-pe",
    year: 2017,
    dateISO: "2017-06-12",
    dateLabel: "Jun 2017",
    name: "Sinusoidal Positional Encoding",
    short: "Fixed sin/cos PE",
    era: "exactness",
    problem:
      "Learned absolute tables cannot represent positions they never saw. You want a closed-form position code that might extrapolate.",
    answer:
      "Fixed PE with sin/cos at geometric wavelengths across dimensions. Relative offsets become linear transforms of the encodings.",
    buys: "No position parameters; theoretically defined for any length; relative geometry baked in.",
    costs: "Still absolute in how it is added; extrapolation is limited in practice; later work largely abandoned additive PE for RoPE/ALiBi.",
    pickWhen:
      "Reproducing the original Transformer, or pedagogically showing why fixed PE was proposed.",
    formula: "PE(pos,2i)=sin(pos/10000^(2i/d))",
    source: {
      title: "Attention Is All You Need §3.5",
      authors: "Vaswani et al.",
      url: "https://arxiv.org/abs/1706.03762",
      note: "arXiv v1: 12 Jun 2017",
    },
    bonus: false,
  },
  {
    id: "sparse-transformer",
    year: 2019,
    dateISO: "2019-04-23",
    dateLabel: "Apr 2019",
    name: "Sparse & Factorized Attention",
    short: "Sparse Transformer",
    era: "compute",
    problem:
      "Dense n² attention cannot afford long sequences (images, audio, documents) even if you want exact-ish mixing.",
    answer:
      "Replace the full mask with sparse patterns (strided, fixed, factorized) so each token attends to O(n√n) or fewer keys — still softmax, just fewer pairs.",
    buys: "Longer sequences on the same hardware while keeping softmax attention semantics.",
    costs: "Hand-designed patterns miss interactions; quality depends on the mask; engineering complexity.",
    pickWhen:
      "Long sequences where you can choose a sparsity pattern that matches the data (e.g. local + periodic).",
    formula: "softmax(QKᵀ ⊙ M_sparse / √d) V",
    source: {
      title: "Generating Long Sequences with Sparse Transformers",
      authors: "Child et al.",
      url: "https://arxiv.org/abs/1904.10509",
      note: "arXiv v1: 23 Apr 2019",
    },
    bonus: true,
  },
  {
    id: "mqa",
    year: 2019,
    dateISO: "2019-11-06",
    dateLabel: "Nov 2019",
    name: "Multi-Query Attention (MQA)",
    short: "Shared K/V heads",
    era: "memory",
    problem:
      "At decode time, reloading per-head K and V dominates memory bandwidth. Training is fine; serving is the bill.",
    answer:
      "Keep many query heads, but share a single K and a single V across heads — shrink the KV cache dramatically.",
    buys: "Much faster incremental decoding; much smaller KV cache.",
    costs: "Quality usually drops vs full MHA; less head diversity on the key/value side.",
    pickWhen:
      "Latency-sensitive serving where a small quality hit is acceptable (early PaLM-style serving tricks).",
    formula: "Q: h heads · K,V: 1 head",
    source: {
      title: "Fast Transformer Decoding: One Write-Head is All You Need",
      authors: "Shazeer",
      url: "https://arxiv.org/abs/1911.02150",
      note: "arXiv v1: 6 Nov 2019",
    },
    bonus: false,
  },
  {
    id: "longformer",
    year: 2020,
    dateISO: "2020-04-10",
    dateLabel: "Apr 2020",
    name: "Sliding Window Attention",
    short: "Local window (Longformer)",
    era: "length",
    problem:
      "Documents are long; most useful signal is local. Paying full n² is wasteful.",
    answer:
      "Each token attends only to a fixed window of neighbors (plus optional global tokens). Mistral (2023) later shipped this as a production default with rolling cache.",
    buys: "Linear(ish) cost in sequence length; natural fit for local structure.",
    costs: "Long-range links need stacking layers or global tokens; naive windowed KV cache alone can break without sinks.",
    pickWhen:
      "Long documents, code files, or streaming chat where local context dominates — not single-hop needle-in-haystack across 1M tokens in one layer.",
    formula: "attend to [i−w, i]",
    source: {
      title: "Longformer: The Long-Document Transformer",
      authors: "Beltagy, Peters, Cohan",
      url: "https://arxiv.org/abs/2004.05150",
      note: "arXiv v1: 10 Apr 2020; production popularized by Mistral 7B (27 Sep 2023)",
    },
    bonus: false,
  },
  {
    id: "linear",
    year: 2020,
    dateISO: "2020-06-29",
    dateLabel: "Jun 2020",
    name: "Linear Attention",
    short: "Kernelized O(n) attention",
    era: "compute",
    problem:
      "Softmax attention is quadratic. Can we keep a similar form but rewrite the kernel so cost is linear?",
    answer:
      "Replace softmax with a positive feature map φ so Attention ≈ φ(Q)(φ(K)ᵀ V) / … — associate the products and keep a running state.",
    buys: "O(n) time and constant-size state during recurrent decode.",
    costs: "Weaker retrieval / associative recall than softmax; approximations lose the sharp “pick this key” behavior.",
    pickWhen:
      "Very long sequences where exact token retrieval is secondary to throughput (and you accept hybrid designs later).",
    formula: "φ(Q)(φ(K)ᵀV)",
    source: {
      title: "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention",
      authors: "Katharopoulos et al.",
      url: "https://arxiv.org/abs/2006.16236",
      note: "arXiv v1: 29 Jun 2020",
    },
    bonus: false,
  },
  {
    id: "rope",
    year: 2021,
    dateISO: "2021-04-20",
    dateLabel: "Apr 2021",
    name: "RoPE",
    short: "Rotary positional embeddings",
    era: "length",
    problem:
      "Additive absolute PE fights relative geometry. Models need relative distance inside the attention product itself.",
    answer:
      "Rotate Q and K in 2D planes by an angle proportional to position so QᵢᵀKⱼ depends on (i−j).",
    buys: "Relative positions; becomes the default in LLaMA/Mistral/etc.; plays well with modern LLMs.",
    costs: "Naive use beyond train length degrades; needs scaling tricks (PI, NTK, YaRN) to stretch.",
    pickWhen:
      "Default choice for new decoder LLMs in 2021–2025 unless you have a specific reason otherwise.",
    formula: "Q̃=R_θ^m Q,  K̃=R_θ^n K",
    source: {
      title: "RoFormer: Enhanced Transformer with Rotary Position Embedding",
      authors: "Su et al.",
      url: "https://arxiv.org/abs/2104.09864",
      note: "arXiv v1: 20 Apr 2021",
    },
    bonus: false,
  },
  {
    id: "alibi",
    year: 2021,
    dateISO: "2021-08-27",
    dateLabel: "Aug 2021",
    name: "ALiBi",
    short: "Attention with Linear Biases",
    era: "length",
    problem:
      "Models trained at length L fall apart at >L. Absolute/rotary embeddings overfit the train window.",
    answer:
      "Skip position embeddings; add a head-specific linear distance penalty to attention logits before softmax.",
    buys: "Strong length extrapolation with almost no extra parameters; simple.",
    costs: "Less widely adopted than RoPE in the Llama-era stack; inductive bias is a blunt distance prior.",
    pickWhen:
      "You care about extrapolating past train length without RoPE-scaling gymnastics (e.g. some MPT-style models).",
    formula: "softmax(QKᵀ/√d + m·bias)",
    source: {
      title: "Train Short, Test Long: Attention with Linear Biases",
      authors: "Press, Smith, Lewis",
      url: "https://arxiv.org/abs/2108.12409",
      note: "arXiv v1: 27 Aug 2021",
    },
    bonus: false,
  },
  {
    id: "flash",
    year: 2022,
    dateISO: "2022-05-27",
    dateLabel: "May 2022",
    name: "FlashAttention",
    short: "IO-aware exact attention",
    era: "memory",
    problem:
      "The n×n matrix is not just FLOPs — reading/writing it to HBM is the bottleneck. Exact attention was “slow” for IO reasons.",
    answer:
      "Tiling + recomputation in SRAM: still exact softmax attention, but never materializes the full score matrix in HBM.",
    buys: "Exact attention, much faster and less memory on GPUs; unlocked longer practical contexts.",
    costs: "Does not change asymptotics of the algorithm; still O(n²) FLOPs; implementation/hardware specific.",
    pickWhen:
      "Always, when available — it is an implementation win, not a quality trade against vanilla attention.",
    formula: "exact attn, tiled IO",
    source: {
      title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
      authors: "Dao et al.",
      url: "https://arxiv.org/abs/2205.14135",
      note: "arXiv v1: 27 May 2022",
    },
    bonus: true,
  },
  {
    id: "gqa",
    year: 2023,
    dateISO: "2023-05-22",
    dateLabel: "May 2023",
    name: "Grouped-Query Attention (GQA)",
    short: "Groups of Q share K/V",
    era: "memory",
    problem:
      "MQA saves memory but hurts quality too much. Full MHA is too fat to serve.",
    answer:
      "Partition query heads into G groups; each group shares one K/V head — interpolate between MHA and MQA.",
    buys: "Near-MHA quality with near-MQA cache size (Llama 2/3 default).",
    costs: "Still a compromise; picking G is another hyperparameter; not free vs full MHA.",
    pickWhen:
      "Production decoder LLMs where KV cache is the serving bottleneck — the 2023–2025 default.",
    formula: "Q: h · K,V: g  (1≤g≤h)",
    source: {
      title: "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints",
      authors: "Ainslie et al.",
      url: "https://arxiv.org/abs/2305.13245",
      note: "arXiv v1: 22 May 2023",
    },
    bonus: false,
  },
  {
    id: "pi",
    year: 2023,
    dateISO: "2023-06-27",
    dateLabel: "Jun 2023",
    name: "Position Interpolation (PI)",
    short: "Linear RoPE stretch",
    era: "length",
    problem:
      "RoPE models die past train length. Fine-tuning at 32K from scratch is expensive.",
    answer:
      "Downscale position indices so extended positions map back into the original RoPE range, then lightly fine-tune.",
    buys: "Practical context extension with little fine-tuning data.",
    costs: "Uniform stretch crowds high-frequency detail; local resolution suffers — motivates NTK-aware fixes.",
    pickWhen:
      "Historical baseline for RoPE extension; usually superseded by YaRN/NTK variants now.",
    formula: "θ' = θ / s",
    source: {
      title: "Extending Context Window of Large Language Models via Positional Interpolation",
      authors: "Chen et al.",
      url: "https://arxiv.org/abs/2306.15595",
      note: "arXiv v1: 27 Jun 2023 (preceded by kaiokendev blog experiments)",
    },
    bonus: true,
  },
  {
    id: "ntk",
    year: 2023,
    dateISO: "2023-06-29",
    dateLabel: "Jun 2023",
    name: "NTK-aware RoPE Scaling",
    short: "Non-uniform frequency stretch",
    era: "length",
    problem:
      "Linear PI destroys high-frequency RoPE components that encode local token distinctions.",
    answer:
      "Scale RoPE base/frequencies non-uniformly (NTK intuition): stretch low frequencies more, preserve high frequencies.",
    buys: "Often stronger zero-shot extension than naive PI; community-born, quickly adopted.",
    costs: "Heuristic; still not perfect at extreme scales; RoPE-specific.",
    pickWhen:
      "Extending a RoPE model with minimal or no fine-tuning before YaRN-style methods.",
    formula: "base' = base · s^(d/(d-2))",
    source: {
      title: "NTK-Aware Scaled RoPE (LocalLLaMA)",
      authors: "bloc97",
      url: "https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/ntkaware_scaled_rope_allows_llama_models_to_have/",
      note: "Reddit post ~29 Jun 2023; cited by YaRN as [bloc97, 2023]",
    },
    bonus: false,
  },
  {
    id: "yarn",
    year: 2023,
    dateISO: "2023-08-31",
    dateLabel: "Aug 2023",
    name: "YaRN",
    short: "Yet another RoPE extensioN",
    era: "length",
    problem:
      "NTK and PI each leave residual damage. Need a practical recipe that fine-tunes little and extrapolates far.",
    answer:
      "Combine NTK-by-parts interpolation with attention temperature scaling; strong length extension with tiny fine-tune budgets.",
    buys: "State-of-the-art practical RoPE extension for many open models (DeepSeek used YaRN to 128K).",
    costs: "More knobs; still a patch on RoPE rather than a new position theory.",
    pickWhen:
      "Taking a RoPE-pretrained model to 32K–128K+ with limited long-context fine-tuning.",
    formula: "NTK-by-parts + logit scale t",
    source: {
      title: "YaRN: Efficient Context Window Extension of Large Language Models",
      authors: "Peng et al.",
      url: "https://arxiv.org/abs/2309.00071",
      note: "arXiv v1: 31 Aug 2023",
    },
    bonus: false,
  },
  {
    id: "sinks",
    year: 2023,
    dateISO: "2023-09-29",
    dateLabel: "Sep 2023",
    name: "Attention Sinks",
    short: "StreamingLLM",
    era: "length",
    problem:
      "Sliding-window KV cache collapses once the initial tokens fall out — softmax needs a “dump” mass.",
    answer:
      "Keep a few initial tokens (sinks) permanently in the cache along with the recent window; reindex positions inside the cache.",
    buys: "Stable infinite streaming with fixed cache size; huge win for multi-turn chat.",
    costs: "Does not create true long-range memory of dropped middle tokens; sinks are a crutch for softmax normalization.",
    pickWhen:
      "Streaming / endless chat with a fixed KV budget — not for lossless 1M-token reasoning over the whole history.",
    formula: "cache = sinks ∪ recent window",
    source: {
      title: "Efficient Streaming Language Models with Attention Sinks",
      authors: "Xiao et al.",
      url: "https://arxiv.org/abs/2309.17453",
      note: "arXiv v1: 29 Sep 2023",
    },
    bonus: false,
  },
  {
    id: "ring",
    year: 2023,
    dateISO: "2023-10-03",
    dateLabel: "Oct 2023",
    name: "Ring Attention",
    short: "Blockwise attention across devices",
    era: "length",
    problem:
      "One GPU cannot hold million-token context. How do you distribute exact-ish attention across devices?",
    answer:
      "Partition the sequence into blocks arranged in a ring; overlap communication of KV blocks with computation.",
    buys: "Near-arbitrary context length given enough devices; keeps softmax attention.",
    costs: "System complexity; communication; still quadratic total FLOPs — you buy length with a cluster, not asymptotics.",
    pickWhen:
      "Research / infra for ultra-long context when you have multi-GPU/TPU rings and need dense attention semantics.",
    formula: "block-KV circulating on a ring",
    source: {
      title: "Ring Attention with Blockwise Transformers for Near-Infinite Context",
      authors: "Liu, Zaharia, Abbeel",
      url: "https://arxiv.org/abs/2310.01889",
      note: "arXiv v1: 3 Oct 2023",
    },
    bonus: true,
  },
  {
    id: "infini",
    year: 2024,
    dateISO: "2024-04-10",
    dateLabel: "Apr 2024",
    name: "Infini-attention",
    short: "Local + compressive memory",
    era: "length",
    problem:
      "Local windows forget the distant past; full history does not fit. Need a compressive long-term memory inside attention.",
    answer:
      "Combine masked local attention with a compressive linear-attention memory that accumulates the whole history.",
    buys: "Bounded memory with theoretically unbounded context; hybrid of exact local + compressed global.",
    costs: "Compression loses detail; another design to train well; less ubiquitous than RoPE+GQA stacks.",
    pickWhen:
      "Architectures that must stream forever with a fixed state and still peek at a summary of the past.",
    formula: "local softmax + compressive state",
    source: {
      title: "Leave No Context Behind: Efficient Infinite Context Transformers with Infini-attention",
      authors: "Munkhdalai, Faruqui, Gopal",
      url: "https://arxiv.org/abs/2404.07143",
      note: "arXiv v1: 10 Apr 2024",
    },
    bonus: true,
  },
  {
    id: "mla",
    year: 2024,
    dateISO: "2024-05-07",
    dateLabel: "May 2024",
    name: "MLA (Multi-head Latent Attention)",
    short: "DeepSeek compressed KV",
    era: "memory",
    problem:
      "Even GQA’s KV cache is too large for long-context agents. Sharing heads was not enough — compress the cache itself.",
    answer:
      "Low-rank joint compression of keys/values into a latent vector; up-project per head when needed. DeepSeek-V2 reports ~93% KV cache reduction vs MHA.",
    buys: "Huge KV savings with quality at or above MHA in DeepSeek’s results.",
    costs: "Architectural complexity; training recipe tied to DeepSeek stack; less “drop-in” than GQA.",
    pickWhen:
      "Long-context serving where KV RAM dominates — DeepSeek-style agents at 128K.",
    formula: "KV ← low-rank latent c_t",
    source: {
      title: "DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model",
      authors: "DeepSeek-AI",
      url: "https://arxiv.org/abs/2405.04434",
      note: "arXiv v1: 7 May 2024",
    },
    bonus: false,
  },
  {
    id: "topk",
    year: 2024,
    dateISO: "2024-05-07",
    dateLabel: "2024 (family)",
    name: "Top-k / Compressed Sparse Attention",
    short: "Selective keys + DeepSeek compression",
    era: "memory",
    problem:
      "Most attention mass sits on a few keys. Paying for every key (or storing every KV) wastes the bill twice.",
    answer:
      "Retrieve or keep only top-k keys (routing / sparsity) and/or store compressed latents (MLA). DeepSeek pairs compressed attention with sparse MoE FFNs — sparsity in both memory and compute.",
    buys: "Scales context and model size by skipping work that does not matter.",
    costs: "Routing errors; load imbalance; hard to batch; can miss rare but critical tokens.",
    pickWhen:
      "1M-token agents and huge MoE models where dense attention+FFN is economically impossible.",
    formula: "attend(top-k(K)) + latent KV",
    source: {
      title: "DeepSeek-V2 (MLA) + lineage of top-k / sparse attention",
      authors: "DeepSeek-AI; earlier Reformer / Routing / NSA lineage",
      url: "https://arxiv.org/abs/2405.04434",
      note: "MLA date: 7 May 2024. Sparse patterns date back to Sparse Transformer 2019; Native Sparse Attention (DeepSeek) later as arXiv:2502.11089 (18 Feb 2025).",
    },
    bonus: false,
  },
  {
    id: "delta",
    year: 2024,
    dateISO: "2024-06-10",
    dateLabel: "Jun 2024",
    name: "DeltaNet (Delta Rule)",
    short: "Linear attn + delta updates",
    era: "compute",
    problem:
      "Classic linear attention’s additive state update is weak at associative recall. Softmax still wins retrieval.",
    answer:
      "Update the recurrent state with a delta rule (write the difference needed to store the new association), with a hardware-efficient parallel training algorithm.",
    buys: "Better recall than vanilla linear attention while staying linear-time.",
    costs: "Still behind strong softmax transformers on many tasks unless hybridized with sliding/global layers.",
    pickWhen:
      "Linear-time backbones where retrieval matters more than plain φ(Q)φ(K)ᵀ linear attention.",
    formula: "S ← S + Δ(association)",
    source: {
      title: "Parallelizing Linear Transformers with the Delta Rule over Sequence Length",
      authors: "Yang et al.",
      url: "https://arxiv.org/abs/2406.06484",
      note: "arXiv v1: 10 Jun 2024 (DeltaNet lineage older; this scales training)",
    },
    bonus: false,
  },
  {
    id: "gated-delta",
    year: 2024,
    dateISO: "2024-12-09",
    dateLabel: "Dec 2024",
    name: "Gated DeltaNet",
    short: "Gating + delta rule",
    era: "compute",
    problem:
      "Delta writes are precise but you also need to erase stale memory quickly — gating and delta were complementary and separate.",
    answer:
      "Unify gated memory control with delta updates; parallel training; hybrids with sliding window or Mamba2 layers.",
    buys: "Stronger linear-time model; competitive with Mamba2-class architectures on several benchmarks.",
    costs: "Complexity; ecosystem still maturing vs Transformer+GQA; hybrids often still needed.",
    pickWhen:
      "Building efficient long-context models in the linear-RNN / SSM family rather than pure softmax transformers.",
    formula: "gated delta state update",
    source: {
      title: "Gated Delta Networks: Improving Mamba2 with Delta Rule",
      authors: "Yang, Kautz, Hatamizadeh",
      url: "https://arxiv.org/abs/2412.06464",
      note: "arXiv v1: 9 Dec 2024",
    },
    bonus: false,
  },
  {
    id: "drope",
    year: 2025,
    dateISO: "2025-12-13",
    dateLabel: "Dec 2025",
    name: "DroPE",
    short: "Drop positional embeddings after training",
    era: "length",
    problem:
      "RoPE helps training converge but the same PE prevents clean length extrapolation — scaling patches paper over the addiction.",
    answer:
      "Pretrain with PE, then drop positional embeddings and briefly recalibrate at the original context length so the model keeps in-window quality and extrapolates better zero-shot.",
    buys: "Context extension without long-context fine-tuning; challenges “just scale RoPE” folklore.",
    costs: "Requires a recalibration stage; newer result — less battle-tested in production stacks than YaRN.",
    pickWhen:
      "You control pretrain→adapt and want extrapolation without a long-context SFT campaign.",
    formula: "pretrain w/ PE → drop PE → short recalibration",
    source: {
      title: "Extending the Context of Pretrained LLMs by Dropping Their Positional Embeddings",
      authors: "Gelberg, Eguchi, Akiba, Cetin (Sakana AI)",
      url: "https://arxiv.org/abs/2512.12167",
      note: "arXiv v1: 13 Dec 2025 — course page listed “2024”; paper is Dec 2025",
    },
    bonus: false,
    correction: true,
  },
];

window.ERAS = {
  exactness: {
    label: "Exactness",
    blurb: "Pay the full bill for correct all-to-all mixing.",
  },
  compute: {
    label: "Compute asymptotics",
    blurb: "Change the algorithm so cost grows slower than n².",
  },
  memory: {
    label: "Memory / bandwidth",
    blurb: "Same math, smaller KV — serving is the bottleneck.",
  },
  length: {
    label: "Context length",
    blurb: "Survive past the training window; stream forever.",
  },
};
