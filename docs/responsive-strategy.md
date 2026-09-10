# VOLTIS — Responsive Strategy

## Breakpoints

Content-driven, mobile-first:

| Breakpoint | Value | Rationale |
|---|---:|---|
| Base | <640px | Single column, large tap targets |
| sm | 640px | Two-column opportunities for editorial/support content |
| lg | 1024px | Full desktop nav + asymmetric hero |
| xl | 1440px | Larger product media and max editorial scale |

No device-name-specific breakpoints are used.

## Navigation

- **Mobile:** menu button → full-screen overlay; 44px+ targets; Escape closes; click link closes.
- **640–1023px:** same compact nav pattern; header CTA visible where space allows.
- **1024px+:** horizontal 6-item nav; menu button hidden.

## Layout transformations

### Hero
- Mobile: copy first → vehicle object second.
- Desktop: asymmetric 2-column composition.
- The vehicle asset is vector, so there is no raster upscaling issue.

### Models
- Mobile/tablet: stacked models.
- Desktop: two equal decision objects side by side.

### Energy system
- Mobile: copy above diagram.
- Desktop: copy left, diagram right.

### Experience
- Mobile: all cockpit objects stack.
- Desktop: one tall primary cluster + two supporting objects.

### Responsibility
- Mobile: statement → ledger.
- Desktop: split message/evidence.

## Typography / text expansion

- Display/H2 use `clamp()`.
- No fixed-height copy cards.
- Body max line length is controlled.
- VI/EN switch must be tested with 30–50% expansion pressure.
- Model names are brand-like labels and do not translate.

## Touch / input

- Interactive controls min-height 44–48px.
- Hover effects are wrapped in `(hover: hover) and (pointer: fine)`.
- Touch does not depend on hover.
- `:focus-visible` is explicit.

## Motion / safe areas

- `prefers-reduced-motion` reduces/transparently disables animation.
- Header/footer include safe-area insets.
- Fixed bottom bars are not used.

## Test matrix

| Width | Priority | Must check |
|---:|---|---|
| 320 | P0 | Nav, display wrapping, no horizontal scroll |
| 375 | P0 | Hero CTA, model spec rows |
| 414 | P0 | Bilingual expansion |
| 768 | P0 | Header space, model cards, ledger |
| 1024 | P0 | Nav switch, hero 2-column pressure |
| 1280 | P0 | Standard desktop composition |
| 1440 | P1 | Intended desktop art direction |
| 1920 | P1 | Max shell and empty-space control |
| 2560 | P2 | No uncontrolled stretching |

## Claim status

CSS is implemented for these transformations. Responsive quality is only marked verified after rendered screenshots/browser inspection at representative widths.
