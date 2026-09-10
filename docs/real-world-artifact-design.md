# VOLTIS — Real-World Artifact Design

## Design problem

Create domain-native visual DNA for an electric automotive brand without copying existing OEM websites or falling back to generic dark-neon UI.

## Artifact inventory

| Artifact | User familiarity | Task relevance | Transfer layer | Decision |
|---|---:|---:|---|---|
| Instrument cluster | High | High | Information + structural | KEEP |
| Energy flow diagram | Medium/high | High | Structural | KEEP |
| Vehicle spec sheet | High | High | Information + structural | KEEP |
| Charging connector | High | Medium | Form | REJECT for v1 |
| Key fob | Medium | Low | Form | REJECT |
| Battery-cell pack | Medium | Medium | Form/pattern | HOLD |
| Workshop manual | Medium | Medium | Editorial structure | HOLD |
| Road lane / navigation path | High | Medium | Structural | SUPPORT |

## Finalist 1 — Instrument cluster

- **Problem solved:** automotive recognition + hierarchy.
- **Transfer:** information/structural.
- **Fidelity:** L1–L2.
- **Keep:** index, arc, meter, “ready” state hierarchy.
- **Do not copy:** OEM dashboard layout, fonts, icons, speedometer face.
- **Digital adaptation:** section numbering, technical meta, cockpit concept block.
- **Mobile:** index remains textual; arc can simplify.
- **Accessibility:** all meaning remains in semantic text; graphic is supplemental.
- **Status:** REPRESENTATIVE / concept.

## Finalist 2 — Electrical energy path

- **Problem solved:** give VOLTIS one ownable cross-page structural motif.
- **Transfer:** structural + information.
- **Fidelity:** L2.
- **Keep:** directional line, node, state-color change.
- **Do not copy:** literal battery schematic or engineering claim.
- **Digital adaptation:** Energy Rail in hero, section transitions, diagrams.
- **Mobile:** reduce line complexity, keep sequence.
- **Accessibility:** node titles/text carry meaning.
- **Status:** CONCEPT.

## Finalist 3 — Technical ledger/spec sheet

- **Problem solved:** trust and evidence presentation.
- **Transfer:** structural/information.
- **Fidelity:** L2.
- **Keep:** numbered rows, revision label, evidence notes.
- **Do not copy:** fake certification marks, government-style stamps.
- **Digital adaptation:** sustainability “Impact Ledger”.
- **Mobile:** rows stack without losing labels.
- **Accessibility:** normal HTML text/table-like grouping, no tiny raster diagram.
- **Status:** REPRESENTATIVE.

## Design DNA extracted

`instrument precision + energy continuity + evidence ledger`

This is enough. Adding key fob, battery texture and charging plug metaphors to the same homepage would turn the site into a metaphor collage and is explicitly rejected.
