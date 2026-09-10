# VOLTIS — UX Review

## Context

- **Primary user task:** hiểu thương hiệu, khám phá dòng xe, quyết định có tìm hiểu/liên hệ tiếp.
- **Primary audiences:** prospective buyer; partner/investor; candidate.
- **Device focus:** Desktop homepage, responsive path included.
- **Reality status:** UI/UX prototype; no commerce/booking backend.

## Evaluation

| Criterion | Rating | Evidence in prototype | Follow-up |
|---|---|---|---|
| Clarity of CTA | 🟢 | Hero has “Khám phá dòng xe” as dominant green CTA; contact CTA repeats at end | Validate first-click |
| Information hierarchy | 🟢 | Product → energy → experience → responsibility → stories → contact | Test 5-second comprehension |
| Cognitive load | 🟢 | 6 desktop nav items, grouped footer | Tree test once routes exist |
| Findability | 🟡 | Prototype uses anchors, not separate routes/search | Add real route IA in phase 2 |
| Error handling | N/A | No data submission flow | Re-audit when forms exist |
| Accessibility | 🟡 | Semantic headings, native controls, focus styles, reduced motion, Escape menu | Manual screen-reader/zoom still required |
| Responsiveness | 🟡 | Mobile-first CSS implemented | Actual rendered matrix must be inspected |
| Trust / reality | 🟢 | Concept disclaimer; `.example` email; no fake customer/proof KPI | Replace with verified product truth later |
| Bilingual consistency | 🟢 | Single locale dictionary, VI default, EN switch | Full locale QA at all breakpoints |

## UX laws applied

| Law / heuristic | Specific application | Trade-off |
|---|---|---|
| Hick’s | 6 direct desktop nav items | Some content moves to secondary navigation |
| Fitts’s | 44px+ touch targets, generous buttons | Header consumes slightly more vertical space |
| Jakob’s | Familiar top nav, logo left, CTA right | Less room for unconventional navigation |
| Von Restorff | Green primary CTA | Green must remain rare |
| Gestalt Continuity | Energy Rail guides technical story | Overuse would create noise |
| Doherty Threshold | Interaction feedback designed to feel immediate; no slow animation blocking action | Does not claim measured system latency |
| Peak-End | Orange Careers peak + dark final CTA | Must not overpower primary vehicle journey |
| Aesthetic-Usability | High visual craft supports trust | Does not excuse IA/accessibility issues |

## Open UX risks

1. Product cards currently express needs qualitatively because real specs are unknown.
2. `mailto:` is intentionally not a production lead-capture solution.
3. Mobile focus trapping is not implemented as a strict modal trap; menu remains simple overlay navigation. If production requires modal semantics, upgrade the pattern with tested focus management.
4. Separate pages may need different top-of-page composition families; do not replicate the homepage hero.
