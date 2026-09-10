# VOLTIS — Research / Design Brief cho Trang chủ Desktop

> **Trạng thái:** Design brief cho prototype UI/UX.  
> **Phạm vi:** Trang chủ desktop trước, nhưng mọi quyết định phải có đường lui responsive/mobile.  
> **Ngôn ngữ mặc định:** Tiếng Việt. Tiếng Anh là locale tương đương, chuyển bằng công tắc VI/EN.  
> **Nguồn thiết kế nội bộ đã áp dụng:** `corporate-website`, `design-reference-research-and-benchmark`, `visual-design-direction`, `brand-distinctiveness-and-visual-signature`, `real-world-artifact-and-domain-metaphor-design`, `ux-laws-and-heuristics`, `conversion-and-content`, `responsive-and-device-strategy`, `localization-and-i18n`, `accessibility`, `frontend-implementation`, `motion-and-microinteractions`, `ui-craft-and-visual-qa`, `visual-taste-calibration`.

---

## 1. Tổng quan & bối cảnh dự án

| Hạng mục | Quyết định / thông tin |
|---|---|
| Tên dự án | VOLTIS |
| Ngành | Cửa hàng / thương hiệu giới thiệu xe ô tô điện |
| Loại website | Corporate + product showcase |
| Màn hình lần này | Trang chủ, ưu tiên Desktop |
| Đối tượng chính | Người cân nhắc mua xe điện; đối tác/nhà đầu tư; ứng viên |
| Mục tiêu chính | Tạo ấn tượng thương hiệu đủ mạnh và dẫn người dùng nhanh tới dòng xe / hành động liên hệ |
| Mục tiêu phụ | Xây độ tin cậy doanh nghiệp; diễn giải hướng công nghệ và bền vững; mở đường cho tài liệu, dự án, tin tức, tuyển dụng |
| Tông màu yêu cầu | Đen + xanh lá + cam |
| Phong cách | Hiện đại — Tương lai — Bảo vệ môi trường |
| Locale | VI mặc định, EN tương đương |
| Ràng buộc | Không dùng logo, ảnh, tên sản phẩm hay tài sản thương hiệu của đối thủ trong demo |
| Công nghệ build | HTML/CSS/JS thuần; đường dẫn tương đối; deploy GitHub Pages |

### Mục tiêu trải nghiệm

Trong **1–2 viewport đầu**, người xem phải hiểu được: VOLTIS là một thương hiệu xe điện; hướng thiết kế đặt năng lượng + trải nghiệm lái + trách nhiệm môi trường làm trung tâm; có sản phẩm concept để khám phá; và hành động tiếp theo là **Khám phá dòng xe** hoặc **Hẹn lái thử / Liên hệ**.

Trang chủ không nên biến thành “brochure dài có đủ mọi phòng ban”. Nó phải làm đúng core journey của corporate website:

`Nhận biết thương hiệu → hiểu khác biệt → thấy sản phẩm → thấy năng lực / quan điểm → tin tưởng → hành động`

---

## 2. Bối cảnh thị trường

### Hướng 1 — Product-first, full-bleed vehicle storytelling

Thường gặp ở các site xe điện lớn: sản phẩm chiếm phần lớn màn hình, headline cực ngắn, CTA rõ, sau đó chuyển sang các khối model / feature / specification. Điểm mạnh là **sản phẩm trở thành decision object ngay lập tức**; điểm yếu là dễ thành “hero ảnh xe + 2 nút” giống hàng chục website khác.

**Ứng dụng cho VOLTIS:** giữ sản phẩm làm anchor chính, nhưng dùng artwork concept nguyên bản + “energy rail” thay vì ảnh lifestyle full-bleed kiểu đối thủ.

### Hướng 2 — Editorial premium / brutal minimal

Dùng nhiều khoảng thở, typography lớn, grid rõ, màu trung tính và ít hiệu ứng. Cách này hợp đối tượng đầu tư / premium nhưng có rủi ro trở nên lạnh và “gallery-like” nếu thiếu thông tin ra quyết định.

**Ứng dụng cho VOLTIS:** dùng typography lớn và grid kỹ thuật, nhưng xen các object “instrument cluster / energy flow” để giữ bản chất automotive.

### Hướng 3 — Tech + sustainability evidence

Các website EV hiện đại thường tách rõ phần hiệu suất, sạc, công nghệ, bền vững. Hướng tốt nhất là dùng **bằng chứng có nguồn** thay vì slogan xanh lá. Khi chưa có dữ liệu thực, prototype phải thể hiện **khung dữ liệu**, không bịa KPI.

**Ứng dụng cho VOLTIS:** section “Impact Ledger” trình bày logic dữ liệu bền vững, không đưa số lượng pin, phát thải hay chứng nhận giả.

### Hướng được chọn

**Product-first + technical editorial**, với một visual signature riêng: **Energy Rail** lấy cảm hứng từ luồng điện và instrument cluster. Điều này giúp VOLTIS khác một site “EV neon green” thông thường nhưng vẫn giữ convention đủ quen.

---

## 3. Định hướng phong cách — 3 tính từ

### Hiện đại — Tương lai — Có trách nhiệm

**Hiện đại:** bố cục linh hoạt, hierarchy mạnh, ít decoration vô nghĩa, interaction nhanh.

**Tương lai:** không đồng nghĩa với “neon + glassmorphism”. Tương lai ở đây đến từ tỷ lệ, typography, data/instrument cues, năng lượng chuyển động và cách trình bày sản phẩm.

**Có trách nhiệm:** thay cụm “bảo vệ môi trường” bằng một tiêu chuẩn thiết kế có thể kiểm chứng: không bịa số liệu, không greenwashing, dành chỗ cho provenance / lifecycle / transparency.

Mọi lựa chọn màu, type, motion và content hierarchy phía dưới phải quay lại ba tính từ này.

---

## 4. Bảng màu

### Phương án A — Carbon / Energy / Motion (được chọn để build)

| Vai trò | Màu | Mã tham khảo | Cách dùng |
|---|---|---:|---|
| Primary surface | Carbon Black | `#090C0B` | Hero, section công nghệ, footer |
| Secondary surface | Graphite | `#101512` | Card kỹ thuật, cockpit, visual stage |
| Primary accent | Energy Green | `#8DFF63` | CTA chính, trạng thái năng lượng, focus cue |
| Secondary accent | Motion Orange | `#FF7A1A` | Chuyển động, index quan trọng, section Careers |
| Light neutral | Warm Paper | `#F0F2EC` | Section nội dung / sustainability |
| Light text | Off White | `#F8FAF6` | Text trên dark |
| Muted text | Steel Grey | `#9AA49E` | Supporting content |
| Semantic focus | Light Green | `#B7FF9B` | `:focus-visible` |

**Vai trò màu:** xanh không phủ toàn trang; nó chỉ báo **energy / primary action / state**. Cam chỉ báo **motion / secondary emphasis**. Nền chủ yếu là đen graphite hoặc paper neutral.

**Cảnh báo “AI-generated look”:** Đen + xanh neon là công thức rất phổ biến trong concept EV/crypto/AI. Tránh bằng cách:
- không phủ glow / gradient neon toàn page;
- không dùng glass card hàng loạt;
- không đặt icon trong badge tròn chỉ để trang trí;
- đưa màu vào **information behavior** (rail, trạng thái, CTA), không chỉ mood.

### Phương án B — Mineral / Copper / Ice

| Vai trò | Màu | Mã tham khảo | Lý do |
|---|---|---:|---|
| Primary surface | Deep Mineral Blue | `#0E1820` | Tương lai nhưng bớt “EV neon” |
| Secondary surface | Slate | `#1B2931` | Kỹ thuật, premium |
| Primary accent | Copper | `#D96A36` | Năng lượng / nhiệt / chế tác |
| Secondary accent | Ice Cyan | `#BFEFF0` | Điện / dữ liệu |
| Neutral | Mist | `#EEF2F0` | Giữ độ nhẹ |
| Text | Chalk | `#F8FAF7` | Contrast |

**Vì sao đáng cân nhắc:** khác biệt hơn trong category xe điện, có cảm giác vật liệu / công nghiệp / chế tác. Tuy nhiên, phương án này xa yêu cầu “xanh lá” ban đầu nên chỉ giữ làm phương án so sánh.

---

## 5. Typography

### Hướng chữ

- **Heading:** grotesk / neo-grotesk hiện đại, nét chắc, counters mở, hỗ trợ variable weight nếu sau này có font brand.
- **Body:** sans-serif humanist/grotesk dễ đọc, x-height tốt.
- **Prototype hiện tại:** system stack (`Inter` fallback → `system-ui`, `Segoe UI`, `Noto Sans`, Arial) để tránh phụ thuộc CDN/font license và đảm bảo triển khai GitHub Pages ổn định.

### Type scale

| Cấp | Kích thước gợi ý | Line-height | Vai trò |
|---|---:|---:|---|
| Display hero | `clamp(48px, 8vw, 131px)` | `0.87–0.92` | Brand statement |
| H2 | `clamp(34px, 5.1vw, 86px)` | `0.96–1.0` | Section intent |
| H3 | `clamp(22px, 2.4vw, 35px)` | `1.0–1.08` | Object/component |
| Body large | `16–19px` | `1.5–1.6` | Intro / explanation |
| Body | `16px` | `1.55` | Main reading |
| Meta/index | `10–12px` | `1.3–1.45` | Technical labels |

**Line length:** body tối đa khoảng `55–68ch`; hero lead khoảng `50–58ch`.

**Tiếng Việt:** bắt buộc kiểm tra glyph `ă â ê ô ơ ư đ` và dấu kép như `ấ`, `ễ`, `ượ`; line-height không được quá thấp ở body/meta. Tránh uppercase + letter-spacing quá mạnh cho câu dài tiếng Việt.

---

## 6. Sitemap / cấu trúc thông tin

```text
VOLTIS
├─ Trang chủ
├─ Sản phẩm
│  ├─ Dòng xe
│  ├─ So sánh
│  └─ Trải nghiệm / lái thử
├─ Công ty
│  ├─ Giới thiệu
│  ├─ Hồ sơ năng lực
│  └─ Tuyển dụng
├─ Dự án
├─ Tài liệu
│  ├─ Brochure
│  ├─ Năng lực / công nghệ
│  └─ Phát triển bền vững
├─ Tin tức
├─ Khám phá
│  └─ Thư viện ảnh / video
└─ Liên hệ
```

### Menu chính Desktop

Áp dụng **Hick’s Law + Miller’s Law** theo hướng giảm lựa chọn ở top level, không áp dụng như giới hạn cứng:

`Sản phẩm / Công ty / Dự án / Tin tức / Tài liệu / Liên hệ`

“Giới thiệu”, “Hồ sơ năng lực”, “Tuyển dụng” đi dưới **Công ty**; “Thư viện ảnh/video” có thể đi dưới **Khám phá** hoặc footer. Prototype home dùng anchor sections; site production có thể tách route.

---

## 7. Cấu trúc layout chi tiết theo từng section

| # | Section | Mục đích | Nội dung chính | Ghi chú UX / law thực sự áp dụng |
|---:|---|---|---|---|
| 0 | Announcement + Header | Orientation + action | Brand, 6 nav item, VI/EN, Hẹn lái thử | **Jakob’s:** logo trái, nav trên, CTA phải. **Fitts’s:** target ≥44px. **Hick’s:** 6 mục chính. |
| 1 | Hero / Product anchor | Giải thích VOLTIS là gì và tạo “first impression” | Headline 2 dòng, lead, 2 CTA, concept AERO, 3 meta | **Von Restorff:** green CTA là action duy nhất nổi bật. **Aesthetic-Usability:** craft cao nhưng CTA/hierarchy không hy sinh. |
| 2 | Model stage | Cho người dùng nhận diện dải xe | AERO + TERRAIN, ảnh nguyên bản, nhu cầu/đặc tính | **Gestalt:** mỗi xe là một common region; spec chunk 3 nhóm. **Recognition > recall:** mô tả trực tiếp. |
| 3 | Energy Architecture | Giải thích khác biệt công nghệ / tư duy | Energy flow diagram, 3 node, CTA năng lực | **Match real world:** mượn mental model luồng năng lượng; không mô phỏng vật lý quá literal. |
| 4 | Experience / Cockpit | Thể hiện product philosophy | Cluster, vật liệu, control feedback | **Doherty:** “feedback tức thì” là nguyên tắc interaction; không tuyên bố latency thực. |
| 5 | Responsibility / Impact Ledger | Xây trust, tránh greenwashing | Sourcing, battery lifecycle, emissions evidence framework | **Trust / consistency:** claim gần proof strategy. Không dùng số liệu giả. |
| 6 | Visual Signature | Xây brand memory | Energy rail, index, signal color behavior | **Gestalt/continuity:** rail dẫn mắt; distinctiveness nhưng vẫn giữ controls quen thuộc. |
| 7 | Stories | Mở chiều sâu nội dung | 3 editorial cards | **Miller:** 3 story là lượng scan tốt; không hiển thị cả feed. |
| 8 | Careers | Audience phụ nhưng có giá trị corporate | EVP framing + hợp tác | **Peak-End:** orange section tạo peak khác nhịp trước CTA cuối. |
| 9 | Final CTA | Chốt next action | Contact + back to top | **Peak-End:** kết thúc rõ. **Fitts’s:** CTA lớn, gần copy. |
| 10 | Footer | Orientation phụ / legal / sitemap | Nhóm link, disclaimer prototype | **Jakob’s:** cấu trúc footer quen thuộc; không giấu contact. |

---

## 8. Mẫu nội dung / copy tham khảo

> Đây là copy **tham khảo cho prototype**, không phải nội dung thương mại final.

| Tiếng Việt (mặc định) | English |
|---|---|
| **Năng lượng sạch. Cảm giác lái không thỏa hiệp.** | **Clean energy. Driving feel without compromise.** |
| Một thương hiệu xe điện mới được thiết kế từ tư duy năng lượng, công nghệ và trải nghiệm con người. | A new electric vehicle brand designed around energy, technology and human experience. |
| **Khám phá dòng xe** | **Explore vehicles** |
| **Thiết kế chiếc xe như một hệ năng lượng chuyển động.** | **Design the vehicle as a moving energy system.** |
| **Bền vững không phải một màu xanh trên giao diện.** | **Sustainability is not a green color on a screen.** |
| **Sẵn sàng cho bước chuyển động tiếp theo?** | **Ready for the next move?** |

---

## 9. Chi tiết thị giác tạo dấu ấn riêng

### Ý tưởng A — Energy Rail **(chọn dùng)**

Một đường năng lượng mảnh chạy ngang / chéo, đôi khi có node, index hoặc đoạn chuyển từ xanh → cam. Nó vừa làm continuity, vừa mang meaning: xanh = energy/state; cam = motion/change.

### Ý tưởng B — Instrument Indexing **(chọn dùng)**

Các số `01 / 02 / 03`, tick marks, meter và meta đặt như bảng đồng hồ kỹ thuật. Không dùng capsule badge. Giữ fidelity L1–L2: lấy cấu trúc, không “vẽ nguyên dashboard xe”.

### Ý tưởng C — Battery-cell tessellation **(không dùng ở v1)**

Pattern hình học lấy cảm hứng cell/pack. Tạm loại vì dễ trở thành decoration và cạnh tranh với Energy Rail.

**Nguyên tắc:** chỉ A + B là signature chính. Nếu bỏ logo, người xem vẫn nên nhận ra VOLTIS nhờ **energy rail + technical indexing + carbon/paper rhythm**.

---

## 10. Tương tác & chuyển động

### Khoảnh khắc animation chính

**Hero activation:** nút tròn “Kích hoạt” làm concept AERO scale/translate rất nhẹ và xoay vòng dashed rail. Motion job = **delight + state change**, không phải decoration chạy liên tục.

### State system

- Hover/focus: `170–260ms`, natural ease.
- Card/media hover: chỉ `transform` nhỏ; không tilt 3D.
- Button press: feedback ngay bằng `translateY(1px)`.
- Header: chuyển surface khi scroll.
- Scroll reveal: chỉ áp dụng cho **major composition groups**, chạy một lần. Không stagger từng dòng chữ dài.

### Reduced motion

`prefers-reduced-motion: reduce` tắt ticker/reveal/large transform; content vẫn hiện đầy đủ và interaction không mất chức năng.

---

## 11. Rủi ro cần kiểm tra kỹ trước khi build / release

| Rủi ro | Vì sao liên quan dự án này | Cách kiểm |
|---|---|---|
| R1 — Dấu tiếng Việt | Heading rất lớn + nhiều dấu kép | Inspect Chrome/Firefox, 320–1440px; không clip dấu |
| R2 — Trộn ngôn ngữ | Site có VI/EN + nhiều label kỹ thuật | Tất cả content user-facing đi qua locale dictionary; brand/model name được giữ |
| R3 — Placeholder/dev-only | Prototype dễ chứa Lorem/“TODO” | Không dùng Lorem; dùng concept copy có nghĩa và ghi rõ status |
| R4 — Icon/viết tắt mơ hồ | Automotive có nhiều thuật ngữ | Text label đi kèm; không dùng icon-only cho action chính |
| Ảnh đối thủ | EV category dễ bị kéo ảnh Tesla/Lucid/Polestar | Prototype chỉ dùng SVG concept nguyên bản |
| Greenwashing | Tông “eco” dễ dẫn tới claim giả | Dùng evidence framework; không bịa số liệu phát thải |
| Generic AI look | Đen + neon + card là pattern phổ biến | Giảm glow; bỏ glass; dùng rail/index có meaning; section composition khác nhau |
| Responsive | Hero typography + bilingual text expansion | Mobile-first, `clamp()`, text expansion 30–50%, test 320/375/768/1024/1440 |
| Accessibility | Dark surface, sticky header, menu overlay | Contrast, focus visible, Escape close, native elements, reduced motion |
| Prototype reality | CTA/email có thể trông “thật” | Dùng `.example`, concept disclaimer, không giả booking backend |

---

## 12. Bước tiếp theo đề xuất

1. **Chốt visual route A hay B:** prototype hiện implement Route A (Carbon / Energy / Motion). Nếu stakeholder thích Route B, đổi token + media treatment trước khi nhân thêm page.
2. **Thay dữ liệu concept bằng product truth:** tên model, thông số, hình ảnh, brochure, certification chỉ được thay khi có nguồn chính thức.
3. **Tách các route quan trọng:** `products`, `company`, `projects`, `resources`, `stories`, `careers`, `contact`; không copy cùng một hero shell cho mọi page.
4. **Chạy visual QA thật trên render:** desktop + tablet + mobile; kiểm 5-second test, crop SVG, text wrap, hover/focus, VI/EN.
5. **Deploy GitHub Pages và kiểm production URL:** assets relative path, MIME, cache, keyboard, no console errors; sau đó mới coi prototype là handoff-ready.

---

## Design contract tóm tắt

**Business goal:** giới thiệu VOLTIS + sản phẩm + credibility, dẫn tới exploration/contact.  
**Primary user question:** “Đây là thương hiệu gì, xe nào phù hợp, có đáng để tôi tìm hiểu thêm không?”  
**First visual anchor:** concept vehicle object + energy-rail system.  
**Primary CTA:** Khám phá dòng xe.  
**Secondary CTA:** Hẹn lái thử / Liên hệ.  
**Visual signature:** Energy Rail + technical indexing + restrained green/orange on carbon/paper.  
**Do:** product object lớn, typography quyết đoán, claim có provenance, nhiều composition family.  
**Do not:** neon glow khắp trang, glass cards, fake metrics, competitor assets, 12 card giống nhau, icon-only action.
