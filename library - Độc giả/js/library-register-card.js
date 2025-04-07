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

// Lấy ngày hiện tại và hiển thị vào input "Ngày đăng ký" và "Ngày hết hạn"
document.addEventListener('DOMContentLoaded', () => {
    const registerDateInput = document.getElementById('registerDate');
    const expiryDateInput = document.getElementById('expiryDate');

    // Kiểm tra xem các input có tồn tại không
    if (!registerDateInput || !expiryDateInput) {
        console.error('Không tìm thấy input #registerDate hoặc #expiryDate. Kiểm tra lại HTML.');
        return;
    }

    // Lấy ngày hiện tại
    const today = new Date();
    const formattedRegisterDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    registerDateInput.value = formattedRegisterDate;

    // Tính ngày hết hạn (31/12 của năm đăng ký)
    const expiryDate = new Date(today.getFullYear(), 11, 31); // Tháng 11 (0-based) là tháng 12
    const formattedExpiryDate = `${expiryDate.getDate().toString().padStart(2, '0')}/${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear()}`;
    expiryDateInput.value = formattedExpiryDate;
});

// Chuyển hướng đến trang thanh toán
function proceedToPayment() {
    // Lấy thông tin từ form
    const readerCode = document.getElementById('readerCode').value;
    const readerName = document.getElementById('readerName').value;
    const registerDate = document.getElementById('registerDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cardPhotoInput = document.getElementById('cardPhoto');
    const cardPhoto = cardPhotoInput.files[0];

    // Kiểm tra xem đã chọn ảnh thẻ chưa
    if (!cardPhoto) {
        alert('Vui lòng chọn ảnh thẻ 3x4!');
        return;
    }

    // Tạo mã thẻ ngẫu nhiên (LIB + 6 chữ số)
    const cardCode = 'LIB' + Math.floor(100000 + Math.random() * 900000);

    // Lưu thông tin vào localStorage để sử dụng ở trang thanh toán
    const cardInfo = {
        readerCode: readerCode,
        readerName: readerName,
        registerDate: registerDate,
        expiryDate: expiryDate,
        cardCode: cardCode,
        cardPhoto: URL.createObjectURL(cardPhoto)
    };
    localStorage.setItem('cardInfo', JSON.stringify(cardInfo));

    // Chuyển hướng đến trang thanh toán
    window.location.href = 'library-payment.html';
}