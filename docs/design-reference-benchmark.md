# VOLTIS — Design Reference Benchmark

## Project decision

- **Business goal:** giới thiệu thương hiệu xe điện mới, đưa sản phẩm lên trước, đồng thời xây trust corporate.
- **Audience:** prospective buyers, partners/investors, candidates.
- **Page role:** homepage / brand overview + product orientation.
- **Brand constraints:** chưa có guideline; black + green + orange là user input; không dùng asset/logo đối thủ.
- **Implementation reality:** static HTML/CSS/JS, GitHub Pages; không phụ thuộc 3D engine/video nặng.
- **Decision problems:** hero hierarchy, model discovery, technology storytelling, sustainability evidence, visual distinctiveness.

## Search strategy

### Query family A — production/category reality
- Tesla electric vehicle homepage / Model Y
- Lucid Motors homepage / vehicles
- Polestar electric cars homepage

### Query family B — page-role/task
- EV product showcase / model cards
- EV specifications / energy / charging storytelling
- EV sustainability evidence

### Query family C — visual art direction
- dark electric vehicle web design
- technical automotive editorial
- sustainable mobility visual system

## Candidate pool

| Reference | Type | Page/state inspected | Job | Keep / Reject | Rationale |
|---|---|---|---|---|---|
| Tesla | Production | Homepage + Model Y | Product-first hierarchy, direct CTA, spec chunking | KEEP principle | Vehicle and action are immediately clear; avoid cloning full-bleed shell |
| Lucid Motors | Production | Homepage + vehicle/configurator pages | Premium product storytelling, vehicle family structure, lifestyle + spec balance | KEEP principle | Strong progression from product to choice; adapt without pricing/fake claims |
| Polestar | Production | Global homepage | Editorial restraint, sustainability as separate evidence topic | KEEP principle | Useful for quiet hierarchy and content separation |
| Rivian | Production | Autonomy + product story page | Capability storytelling | PARTIAL | Useful for feature narrative, but not needed as visual base |
| Behance EV concepts | Concept/gallery | Hero screenshots | Mood/craft only | PARTIAL | Can inform contrast/composition, never UX proof |
| Dribbble neon EV concepts | Concept/gallery | Hero screenshots | Anti-pattern calibration | REJECT as final look | Dark + neon green is overused and easy to read as generic AI concept |

## Final references by role

### A — Tesla: product clarity

**What works:** product is the primary object; model name, commercial context and CTA are visually obvious; specification groups are easy to scan.

**Transferable principle:** keep the vehicle object dominant and give one primary + one secondary action.

**Do not copy:** full-page vehicle photography, exact CTA wording, model naming, iconography, layout shell, images.

**VOLTIS adaptation:** original concept SVG + editorial left-side message; green CTA only once per primary decision zone; concept status visible.

### B — Lucid Motors: premium vehicle storytelling

**What works:** product family is treated as a decision journey; model blocks combine vehicle, promise and next action instead of generic feature cards.

**Transferable principle:** each vehicle gets its own visual field and concise reason-to-care.

**Do not copy:** imagery, pricing layout, offers, brand typography, configurator visuals.

**VOLTIS adaptation:** AERO and TERRAIN use two independent concept illustrations and need-based descriptions, no price/fake performance number.

### C — Polestar: editorial + sustainability separation

**What works:** product sections remain visually restrained; sustainability is a distinct information layer rather than green decoration.

**Transferable principle:** use neutral space and evidence framing; sustainability needs its own content structure.

**Do not copy:** minimalist brand surface, exact image treatment, product imagery, wording.

**VOLTIS adaptation:** light “Impact Ledger” section interrupts dark automotive rhythm and communicates how verified sustainability content will be structured.

## Page-role reference matrix

| Page role | User question | Reference role | Principle extracted | What not to copy | VOLTIS adaptation |
|---|---|---|---|---|---|
| Home / overview | VOLTIS là gì? | Tesla + Lucid | Product object + clear CTA | Hero shell / imagery | Asymmetric product hero with Energy Rail |
| Product discovery | Xe nào hợp tôi? | Tesla + Lucid | Compare through concise attributes | Pricing/spec claims | 2 concept model stages by need |
| Technology | Khác biệt công nghệ gì? | Rivian/Lucid | Capability as story | Marketing claims | Energy-flow diagram, no numeric claim |
| Responsibility | Có đáng tin về bền vững? | Polestar | Evidence topic gets dedicated space | Copy/visual style | Impact Ledger framework |
| Careers | Công ty có định hướng gì? | Corporate playbook | EVP before vacancy list | Generic job cards | Orange peak section, collaboration CTA |
| Contact | Tôi làm gì tiếp? | Category convention | Clear low-friction next action | Fake booking flow | Safe mailto + `.example` disclaimer |

## Extracted Design DNA

- **Layout grammar:** large object + editorial copy; alternate dense technical dark fields with light “paper” evidence fields.
- **Composition:** not every section is 3 cards; model stage, system diagram, cockpit object, ledger, editorial stories.
- **Typography:** large display scale for owner message; technical micro-index for orientation.
- **Color roles:** green = energy/primary state; orange = motion/secondary emphasis; not decorative fill.
- **Media:** original concept vector art only for prototype.
- **Domain object:** instrument cluster / energy flow / spec ledger.
- **Interaction:** instant feedback, one hero activation moment, restricted reveal.
- **Trust:** no fake numbers, testimonials, certifications or customer logos.

## Rejected patterns

- universal centered hero + 2 buttons + glass nav;
- black/neon-green glow across every section;
- 3 rounded cards repeated section after section;
- 3D tilt/parallax on vehicle for novelty;
- fake “0–100 / range / charging” metrics without product truth;
- competitor imagery as temporary filler;
- green leaf iconography as shorthand for sustainability.

## Handoff to visual direction

The reference set supports a **technical editorial** direction, but VOLTIS must be recognizable through its own system. The final visual commitment is **Energy Rail + instrument indexing**, not the surface look of any reference.

## Nguồn tham khảo đã kiểm tra (10/09/2026)

- Tesla — Homepage: https://www.tesla.com/
- Tesla — Model Y: https://www.tesla.com/modely
- Lucid Motors — Homepage: https://lucidmotors.com/
- Polestar — Global Homepage: https://www.polestar.com/global
- Polestar — Sustainability: https://www.polestar.com/us/sustainability

> Các nguồn trên chỉ dùng để phân tích **nguyên tắc bố cục, hierarchy, cách tổ chức nội dung và evidence framing**. Prototype VOLTIS không sử dụng logo, hình ảnh, tên sản phẩm hay tài sản thương hiệu của các website tham khảo.
