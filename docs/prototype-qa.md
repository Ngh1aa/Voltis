# VOLTIS — Prototype UI/UX QA

**Ngày kiểm tra:** 10/09/2026  
**Phạm vi:** `index.html`, `css/style.css`, `js/main.js`, responsive behavior, localization, accessibility basics, GitHub Pages readiness.

## 1. Gate đã áp dụng

Bản prototype được đối chiếu trực tiếp với R1–R4 trong master prompt và các playbook của `Ngh1aa/skills_UIUX`, đặc biệt:

- `ui-craft-and-visual-qa`
- `accessibility`
- `responsive-and-device-strategy`
- `localization-and-i18n`
- `frontend-implementation`
- `FINAL-UIUX-VISUAL-CONTENT-QA-REMEDIATION-V3.2.md`
- `ui-craft-and-visual-qa/checklists/elementary-visual-sanity-gate.md`

Tên file `checklist-prototype-ui-ux.md` **không xuất hiện trong default branch hiện tại** của cả `Ngh1aa/skills_UIUX` và `Ngh1aa/uiux-ai-workspace` khi kiểm tra. Vì vậy QA không giả định nội dung của file đó; thay vào đó dùng các gate gần nhất ở trên cùng R1–R4 do người dùng cung cấp.

## 2. Responsive matrix

| Viewport | Horizontal overflow | Header / nav | Language switch | Mobile menu | JS errors |
|---|---|---|---|---|---|
| 320 × 900 | PASS | PASS | PASS | PASS | 0 |
| 375 × 900 | PASS | PASS | PASS | PASS | 0 |
| 768 × 1024 | PASS | PASS | PASS | PASS | 0 |
| 1440 × 1000 | PASS | PASS | PASS | Desktop nav | 0 |

Các touch target chính đã kiểm tra đạt xấp xỉ **44 × 44 px hoặc lớn hơn**. CTA desktop khoảng 157 × 44 px; menu mobile khoảng 46 × 46 px.

## 3. R1–R4

| Rule | Kết quả | Ghi chú |
|---|---|---|
| R1 — Dấu/ký tự đúng | PASS | Copy tiếng Việt dùng UTF-8, kiểm tra trực tiếp ở UI; không dùng chuỗi tổ hợp lỗi. |
| R2 — Một ngôn ngữ chủ đạo | PASS | Tiếng Việt mặc định; VI/EN đổi toàn khối nội dung, `html.lang` và title. |
| R3 — Không placeholder/dev-only | PASS có chủ đích | Không Lorem ipsum. Nội dung concept được ghi rõ là concept; email `.example` có disclaimer để không giả làm thông tin thật. |
| R4 — Thành phần tự giải thích | PASS | Icon-only/menu có `aria-label`; label kỹ thuật được diễn giải; CTA có text rõ. |

## 4. Localization / i18n

- 140 key i18n duy nhất được tham chiếu từ HTML.
- Mọi key tham chiếu có đủ bản `vi` và `en`.
- `data-i18n`, `data-i18n-aria`, `data-i18n-alt` đều được cập nhật khi đổi locale.
- Ảnh concept có alt text ở cả hai ngôn ngữ.
- Không dùng framework hoặc API bên ngoài cho locale; GitHub Pages chạy tĩnh được.

## 5. Accessibility basics

- Skip link là focusable element đầu tiên khi dùng bàn phím.
- Focus outline kiểm tra thực tế: **3 px solid**, offset 4 px.
- `prefers-reduced-motion: reduce` đưa transition xuống gần 0 và tắt smooth scrolling.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) và accessible labels được dùng cho các vùng chính.
- Không dựa vào màu sắc duy nhất để diễn giải CTA/trạng thái quan trọng.

## 6. Static integrity

- Không có duplicate `id`.
- Mọi local path được tham chiếu từ `index.html` tồn tại.
- 3 thẻ `<img>` đều có `alt`.
- `node --check js/main.js`: PASS.
- Không có dependency localhost, framework hay build step.
- `.nojekyll` được thêm để GitHub Pages phục vụ static asset trực tiếp.

## 7. Các lỗi đã phát hiện và sửa trong QA

1. CTA header mobile từng bị `.btn` ghi đè `display`, gây overflow ở 320–375 px → đã tăng specificity cho `.btn.header__cta`.
2. Announcement/brand target ban đầu nhỏ hơn 44 px → đã nâng min-height/min-width.
3. Mobile menu dùng `position: fixed` bên trong sticky/backdrop-filter header gây lỗi containment trong Chromium → chuyển sang absolute dưới header và khóa chiều cao theo viewport.
4. Một số technical labels tiếng Anh xuất hiện trong locale VI → đã bản địa hóa để tránh trộn ngôn ngữ không cần thiết.

## 8. Definition of Done

- [x] Build đủ section theo research brief.
- [x] Rà R1–R4 và các QA gate gần nhất trong skill system.
- [x] VI/EN hoạt động, VI mặc định.
- [x] Responsive không overflow ở 320/375/768/1440.
- [x] Keyboard focus + reduced motion được xử lý.
- [x] Relative paths; không localhost.
- [x] Không dùng logo/ảnh/tài sản đối thủ.
- [x] Sẵn sàng deploy GitHub Pages từ branch `main`, thư mục `/`.
