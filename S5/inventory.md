# Inventory (Session 5 composer + S3/S4)

Supply figures below follow the Session 5 mixture-composer / inventory UI (approximate). Provenance tiers A/B/C/D as in Session 3.

## Code — ~1.1T class

| Dataset | Samples | Tokens | Tier |
|---------|--------:|-------:|------|
| The Stack v2 (BigCode / Software Heritage) | 600M | 900B | B |
| D3 Code (V4 corpus) | 250M | 199B | B |
| CommitPack / CommitPackFT | 4M | 4B | B |

## Agentic & tool-use — slot runs thin (~0.63B)

| Dataset | Samples | Tokens | Tier |
|---------|--------:|-------:|------|
| ToolBench | 120K | 80M | D |
| Glaive function-calling v2 | 113K | 50M | D |
| ToolACE | 110K | 60M | A/D |
| xLAM / APIGen | 60K | 25M | A/D |
| Nexus / NexusRaven | 40K | 30M | A |
| SWE-bench (partial) | ~2K | ~120M | A/B |

→ Main-pretrain agentic share stays **2%**; remainder of agentic capability is **synthesized** and/or deferred to **anneal / SFT / RL**.

## Indic

| Source | Note |
|--------|------|
| Sangraha / AIR | Confirmed in Session 5; headline size ≠ verified native |
| IndicCorp | Prefer **verified** slices |
| Wikipedia Indic | Verified core |
| Samanantar / parallel MT | Translated tier |

## STEM / web / reasoning / long-context

| Lane | Sources |
|------|---------|
| STEM | arXiv, Proof-Pile, OpenWebMath, Dolmino-class |
| General web | FineWeb-Edu (~1.3T cited in S3), DCLM/Nemotron-CC, cleaned CC (~4.8T class in composer) |
| Reasoning | Open process/CoT sets (exact card names evolve); anneal concentration |
| Long-context | Books, multi-doc wiki packs, long repos, judgment concatenations |

## Starved lanes (clean first)

Agentic schemas · Verified Indic · Reasoning traces · Long-context packs · Code license-dedup  
