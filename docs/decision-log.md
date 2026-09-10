# VOLTIS — Design Decision Log

## Decision: Rút menu Desktop còn 6 mục trực tiếp
- **User task:** hiểu nhanh các nhóm nội dung chính.
- **Law applied:** Hick’s Law + Miller’s Law như heuristic.
- **Rationale:** sitemap gốc có 10 mục; một hàng nav với 10 lựa chọn làm giảm tốc độ định hướng và dễ overflow khi đổi sang English.
- **Trade-off:** một số mục như Tuyển dụng / Thư viện ảnh cần thêm một bước qua Công ty/Khám phá/footer.
- **How to verify:** tree test / first-click test khi tách route thật; kiểm EN text expansion.

## Decision: Một CTA xanh chủ đạo ở mỗi decision zone
- **User task:** biết bước tiếp theo là gì.
- **Law applied:** Von Restorff Effect.
- **Rationale:** Energy Green được giữ hiếm để CTA chính nổi bật giữa dark neutral.
- **Trade-off:** secondary action ít nổi hơn.
- **How to verify:** 5-second test; hỏi người dùng “nút nào bạn sẽ bấm để xem xe?”.

## Decision: Product object chiếm phần lớn hero
- **User task:** nhận biết ngay đây là thương hiệu xe điện.
- **Law applied:** recognition over recall + Aesthetic-Usability Effect.
- **Rationale:** xe là decision object mạnh hơn abstract gradient/3D decoration.
- **Trade-off:** cần asset concept chất lượng cao và crop tốt.
- **How to verify:** test 5 giây không hiển thị logo; người dùng vẫn nhận ra category automotive.

## Decision: Energy Rail thay cho glow/gradient làm motif chính
- **User task:** nhận diện hệ thống và theo dõi flow.
- **Law applied:** Gestalt Continuity.
- **Rationale:** rail có chức năng dẫn mắt và gắn với domain energy.
- **Trade-off:** cần dùng tiết chế để không thành decorative line spam.
- **How to verify:** screenshot recognition review trên 3 section.

## Decision: Không dùng số liệu hiệu suất giả
- **User task:** đánh giá độ tin cậy.
- **Heuristic:** match system to reality / trust.
- **Rationale:** chưa có product truth chính thức; KPI giả làm prototype trông thật nhưng phá trust.
- **Trade-off:** model cards bớt “salesy”.
- **How to verify:** content audit; mọi number claim phải có source hoặc label concept.

## Decision: Mobile menu là overlay đơn giản với native link/button
- **User task:** điều hướng bằng touch/keyboard.
- **Law applied:** Fitts’s Law + consistency/standards.
- **Rationale:** target lớn, đóng bằng Escape, focus rõ; không phát minh gesture.
- **Trade-off:** overlay chiếm toàn màn hình.
- **How to verify:** keyboard-only, 320px, touch simulation, Escape + focus return.

## Decision: Scroll reveal chỉ dùng cho major composition groups
- **User task:** đọc nội dung không bị trì hoãn.
- **Heuristic:** motion should support hierarchy, not block task.
- **Rationale:** tránh pattern generated site “mọi thứ fade up”.
- **Trade-off:** ít hiệu ứng hơn.
- **How to verify:** reduced-motion test + scroll nhanh; content vẫn đọc ngay.
