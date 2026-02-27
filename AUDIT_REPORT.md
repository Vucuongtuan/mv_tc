# Audit Report: Next.js 16 Project Audit

**Project:** `movie_next`
**Date:** 2024-05-22
**Auditor:** Senior Frontend Architect (Jules)

---

## 🔴 Critical

### 1. Hydration Mismatch & Responsive Design in `MovieSectionCarousel`

- **Vấn đề:**
  Component `MovieSectionCarousel` sử dụng hook `useMediaQuery` (client-side) để xác định `itemWidth`.
  - Server render với giá trị mặc định (thường là `false` hoặc `undefined`).
  - Client hydrate và nhận diện màn hình thật -> update state -> re-render.
  - Điều này gây ra lỗi **Hydration Mismatch** và layout bị nhảy (CLS) ngay khi load trang.

- **Tác động:**
  - **CLS (Cumulative Layout Shift):** Layout carousel thay đổi kích thước items ngay trước mắt người dùng.
  - **Hydration Cost:** React phải thực hiện thêm patch update ngay sau khi mount.
  - **SEO:** Google Bot có thể thấy layout bị vỡ hoặc không đúng kích thước mong muốn.

- **Cách sửa:**
  Loại bỏ `useMediaQuery` cho mục đích styling layout. Sử dụng CSS Media Queries (Tailwind CSS) để điều chỉnh kích thước item.

- **Commit Message:**
  ```text
  fix(ui): replace useMediaQuery with CSS responsive classes for carousel items

  - Remove useMediaQuery hook usage in MovieSectionCarousel
  - Update MovieCard to use Tailwind responsive width classes (e.g., w-[160px] md:w-[240px])
  - Ensure consistent server/client rendering to fix hydration mismatch
  ```

### 2. Main Thread Blocking in `SecurityGuard`

- **Vấn đề:**
  Component `SecurityGuard` sử dụng vòng lặp `setTimeout` (100ms) kết hợp `debugger` để chống devtools.
  Việc chạy code liên tục trên main thread với tần suất cao (100ms) có thể gây jank, đặc biệt trên thiết bị di động yếu.

- **Tác động:**
  - **INP (Interaction to Next Paint):** Tăng độ trễ phản hồi khi người dùng tương tác, do main thread bị chiếm dụng.
  - **Battery Drain:** Tốn pin thiết bị người dùng.

- **Cách sửa:**
  Giảm tần suất kiểm tra (ví dụ: 2000ms) hoặc loại bỏ hoàn toàn cơ chế `debugger` loop nếu không thực sự cần thiết cho app phim ảnh (trải nghiệm người dùng quan trọng hơn bảo mật client-side yếu).

- **Commit Message:**
  ```text
  perf(security): throttle debugger check interval to reduce main thread blocking

  - Increase security check interval from 100ms to 2000ms
  - Reduce impact on Interaction to Next Paint (INP) metric
  ```

### 3. Invalid Directive in `src/app/page.tsx`

- **Vấn đề:**
  File `page.tsx` chứa directive `"use memo"`. Đây không phải là directive hợp lệ của React/Next.js.

- **Tác động:**
  - Gây nhiễu mã nguồn.
  - Tiềm ẩn lỗi build trong tương lai.

- **Cách sửa:**
  Xóa dòng `"use memo"`.

- **Commit Message:**
  ```text
  fix(app): remove invalid 'use memo' directive from page.tsx
  ```

---

## 🟠 Warning

### 1. Uncached Fetching in `getTopicParams`

- **Vấn đề:**
  Hàm `getTopicParams` trong `src/services/movie.ts` thực hiện `fetch` mà không có cấu hình cache (không `'use cache'`, không `next: { revalidate }`).
  Trong Next.js 15/16, fetch mặc định có thể là `no-store` (tùy config), dẫn đến việc fetch API mỗi lần request trang.

- **Tác động:**
  - Làm chậm thời gian phản hồi server (TTFB).
  - Tăng tải không cần thiết lên backend API.

- **Cách sửa:**
  Thêm directive `'use cache'` và `cacheLife` tương tự các hàm khác trong service.

- **Commit Message:**
  ```text
  perf(data): enable caching for getTopicParams fetching

  - Add 'use cache' directive
  - Set cacheLife to 'weeks' to match other static params patterns
  ```

### 2. Risk of Caching Errors (`tryC` / `tryCache`)

- **Vấn đề:**
  Hàm `tryCache` catch toàn bộ lỗi và trả về `null`.
  Các hàm service dùng `cacheLife('weeks')` bao bọc `tryCache`.
  Nếu API bị lỗi tạm thời (network blip), hệ thống sẽ cache kết quả `null` trong nhiều tuần.

- **Tác động:**
  - Dữ liệu có thể bị mất (trang trắng) trong thời gian dài ngay cả khi API đã hoạt động lại.

- **Cách sửa:**
  Trong `tryCache`, nếu gặp lỗi, nên throw error để Next.js không cache kết quả đó (hoặc dùng `revalidate: 0`). Chỉ return `null` cho các trường hợp logic hợp lệ (ví dụ 404 Not Found chuẩn).

- **Commit Message:**
  ```text
  fix(cache): prevent caching of transient errors in data services

  - Update tryCache to throw on 5xx errors to avoid caching bad responses
  - Ensure null results are only cached for valid 404s
  ```

### 3. Layout Shift Risk in `SectionInView`

- **Vấn đề:**
  `SectionInView` render fallback placeholder rồi thay thế bằng content thật. Nếu chiều cao fallback không khớp pixel-perfect với content, sẽ gây layout shift.

- **Tác động:**
  - Điểm CLS (Cumulative Layout Shift) bị ảnh hưởng xấu.
  - Trải nghiệm cuộn trang bị giật.

- **Cách sửa:**
  Đảm bảo `fallback` component có chiều cao cố định hoặc `aspect-ratio` chính xác như content thật.

- **Commit Message:**
  ```text
  perf(ui): stabilize SectionInView fallback dimensions to minimize CLS

  - Set explicit min-height for section fallbacks matching content
  ```

---

## 🟢 Suggestion

### 1. Invalid Config in `next.config.ts`

- **Vấn đề:**
  `cacheComponents: true` không phải là option chuẩn của Next.js (có thể là nhầm lẫn với `ppr` hoặc feature flag cũ).

- **Cách sửa:**
  Kiểm tra lại document và loại bỏ nếu không cần thiết.

- **Commit Message:**
  ```text
  chore(config): remove unsupported cacheComponents option
  ```

### 2. Optimize YouTube Embed Loading

- **Vấn đề:**
  `MovieCard` load `YouTubeEmbed` khi hover. Iframe YouTube khá nặng (JS, requests).

- **Cách sửa:**
  Sử dụng thư viện nhẹ hơn như `lite-youtube-embed` hoặc chỉ load thumbnail ảnh và load video thật khi click vào nút Play.

- **Commit Message:**
  ```text
  perf(media): optimize video embed loading strategy

  - Delay iframe loading until explicit user interaction
  - Use facade pattern for video thumbnails
  ```

---

## 📊 Core Web Vitals Summary

| Metric | Status | Primary Cause | Solution |
| :--- | :--- | :--- | :--- |
| **LCP** | 🟢 Good | `HeroSlide` uses `priority`. | Keep current implementation. |
| **CLS** | 🟠 Risk | `useMediaQuery` in Carousel, `SectionInView`. | Use CSS media queries, fix fallback heights. |
| **INP** | 🟠 Risk | `SecurityGuard` main thread blocking. | Throttle/Debounce security checks. |
