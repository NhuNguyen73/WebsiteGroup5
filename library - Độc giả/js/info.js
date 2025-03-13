// Xử lý nhấp chuột trên các mục dropdown
document.querySelectorAll('.dropdown-menu a[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
        const sectionId = item.getAttribute('data-section');

        // Kiểm tra xem trang hiện tại có phải là library-reader-info.html không
        if (window.location.pathname.endsWith('library-reader-info.html')) {
            // Nếu đã ở đúng trang, chỉ cần chuyển đổi section
            document.querySelectorAll('.library-nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.library-content-section').forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                document.querySelector(`.library-nav-item[data-target="${sectionId}"]`).classList.add('active');
                window.location.hash = sectionId; // Cập nhật hash
            }
        } else {
            // Nếu không ở trang library-reader-info.html, chuyển hướng đến trang với hash
            window.location.href = `library-reader-info.html#${sectionId}`;
        }
    });
});