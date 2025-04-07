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

// Chuyển đổi nội dung sidebar
document.querySelectorAll('.library-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetSection = item.getAttribute('data-target');
        document.querySelectorAll('.library-nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.library-content-section').forEach(section => section.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
        window.location.hash = targetSection; // Cập nhật hash
    });
});

// Xử lý hash khi tải trang
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1); // Loại bỏ '#' khỏi hash
    if (hash) {
        document.querySelectorAll('.library-nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.library-content-section').forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            targetSection.classList.add('active');
            document.querySelector(`.library-nav-item[data-target="${hash}"]`).classList.add('active');
        }
    } else {
        // Mặc định hiển thị section "Thông Tin Cá Nhân"
        document.getElementById('library-personal-content')?.classList.add('active');
        document.querySelector('[data-target="library-personal-content"]')?.classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin từ localStorage
    const cardInfo = JSON.parse(localStorage.getItem('cardInfo'));
    if (!cardInfo) {
        alert('Không tìm thấy thông tin đăng ký thẻ!');
        window.location.href = 'library-register-card.html';
        return;
    }

    // Tính số tiền dựa trên số quý còn lại từ ngày đăng ký đến cuối năm
    const registerDateStr = cardInfo.registerDate; // Định dạng: dd/mm/yyyy
    const [day, month, year] = registerDateStr.split('/').map(Number);
    const registerDate = new Date(year, month - 1, day); // Tháng trong JavaScript tính từ 0

    // Tính số quý còn lại trong năm
    const currentMonth = registerDate.getMonth(); // Tháng từ 0-11
    let remainingQuarters = 0;

    if (currentMonth >= 0 && currentMonth <= 2) { // Quý 1 (Tháng 1-3)
        remainingQuarters = 4; // Cả 4 quý (bao gồm quý 1)
    } else if (currentMonth >= 3 && currentMonth <= 5) { // Quý 2 (Tháng 4-6)
        remainingQuarters = 3; // Còn 3 quý (quý 2, 3, 4)
    } else if (currentMonth >= 6 && currentMonth <= 8) { // Quý 3 (Tháng 7-9)
        remainingQuarters = 2; // Còn 2 quý (quý 3, 4)
    } else if (currentMonth >= 9 && currentMonth <= 11) { // Quý 4 (Tháng 10-12)
        remainingQuarters = 1; // Còn 1 quý (quý 4)
    }

    // Tính số tiền: 1 quý = 30k, 2 quý = 60k, 3 quý = 90k, 4 quý = 120k
    const amount = remainingQuarters * 30; // Số tiền tính bằng nghìn đồng (30k/quý)

    // Cập nhật thông báo số tiền
    const paymentNote = document.getElementById('paymentNote');
    if (paymentNote) {
        paymentNote.textContent = `Vui lòng thanh toán ${amount}.000 VNĐ trong vòng 30 phút`;
    }

    // Tạo mã QR tượng trưng
    const qrCodeDiv = document.getElementById('qrcode');
    const qrData = `Thẻ thư viện: ${cardInfo.cardCode}\nHọ tên: ${cardInfo.readerName}\nMã độc giả: ${cardInfo.readerCode}\nNgày đăng ký: ${cardInfo.registerDate}\nHết hạn: ${cardInfo.expiryDate}\nSố tiền: ${amount}.000 VNĐ`;
    QRCode.toCanvas(qrCodeDiv, qrData, { width: 200, height: 200 }, (error) => {
        if (error) console.error(error);
    });

    // Giả lập thanh toán thành công sau 5 giây
    setTimeout(() => {
        // Đánh dấu đã đăng ký thẻ thành công
        localStorage.setItem('isCardRegistered', 'true');
        localStorage.setItem('registeredCardInfo', JSON.stringify(cardInfo));

        // Chuyển hướng về trang thông tin thẻ thư viện
        window.location.href = 'library-reader-info.html#library-card-content';
    }, 5000); // 5 giây
});

// Lưu mã QR vào máy
function saveQRCode() {
    const qrCodeCanvas = document.getElementById('qrcode');
    const link = document.createElement('a');
    link.href = qrCodeCanvas.toDataURL('image/png');
    link.download = 'library-card-qrcode.png';
    link.click();
}