# Hệ thống ứng dụng công thức nấu ăn - ChefMate

# [I. Client - Ứng dụng di động](https://github.com/PhongDayNai/ChefMate_Client)

# [II. Server - Máy chủ](https://github.com/PhongDayNai/ChefMate_Server)

# III. Client - Admin Web

## 1. Công nghệ

- **ReactJS**: Xây dựng SPA với component tái sử dụng.
- **React Router**: Quản lý điều hướng, tích hợp Sidebar.
- **Lucide-React**: Cung cấp biểu tượng cho Sidebar (Home, Users, BookOpen, MessageSquareText, BarChart).

## 2. Kiến trúc: Mô hình **React Component-based** với kiến trúc **Single Page Application (SPA)**

- **Components**:
    - **Chức năng**: Các thành phần giao diện độc lập, tái sử dụng (bảng danh sách thành viên, công thức, quản lý bình luận, báo cáo).
    - **Vai trò**: Xây dựng giao diện động, dễ bảo trì và mở rộng.
- **State Management**:
    - **Chức năng**: Quản lý trạng thái bằng **React Hooks**, đồng bộ dữ liệu giữa các component.
    - **Vai trò**: Cập nhật dữ liệu (thành viên, công thức, bình luận, báo cáo) theo thời gian thực.
- **API Integration**:
    - **Chức năng**: Tương tác với server qua RESTful API để lấy, cập nhật hoặc xóa dữ liệu.
    - **Vai trò**: Đảm bảo dữ liệu từ server hiển thị chính xác trên giao diện.
- **Routing**:
    - **Chức năng**: Sử dụng **React Router** để điều hướng giữa các trang (Trang chủ, Thành viên, Công thức, Bình luận, Báo cáo), tích hợp với Sidebar.
    - **Vai trò**: Cung cấp trải nghiệm điều hướng mượt mà, với Sidebar làm trung tâm điều khiển.

## 3. Tính năng

- **Hiển thị tổng quát**: Số thành viên, số công thức, số bình luận
- **Hiển thị danh sách thành viên**: Xem thông tin người dùng (tên, email, ngày đăng ký) qua trang "Thành viên" trên Sidebar.
- **Hiển thị danh sách công thức**: Xem chi tiết công thức (tên, tác giả, ngày đăng, trạng thái) qua trang "Công thức".
- **Hiển thị công thức**: Xem thông tin công thức.
- **Quản lý bình luận**:  **Xem, xóa bình luận không phù hợp qua trang "Bình luận".**
- **Lập báo cáo số lượng công thức theo tháng**: Tạo biểu đồ trực quan qua trang "Báo cáo", phân tích xu hướng đăng tải công thức.