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
        document.getElementById('library-personal-content').classList.add('active');
        document.querySelector('[data-target="library-personal-content"]').classList.add('active');
    }
});

// Đặt trạng thái ban đầu là chưa đăng ký thẻ
localStorage.removeItem('isCardRegistered');
localStorage.removeItem('registeredCardInfo');


// Logic xử lý trạng thái thẻ thư viện
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng ký thẻ từ localStorage
    const isCardRegistered = localStorage.getItem('isCardRegistered') === 'true';
    const cardRegisteredSection = document.querySelector('.library-card-registered');
    const cardUnregisteredSection = document.querySelector('.library-card-unregistered');

    if (isCardRegistered) {
        cardRegisteredSection.style.display = 'block';
        cardUnregisteredSection.style.display = 'none';

        // Lấy thông tin thẻ vừa đăng ký từ localStorage
        const cardInfo = JSON.parse(localStorage.getItem('registeredCardInfo'));
        if (cardInfo) {
            // Cập nhật thông tin thẻ
            document.querySelector('.library-card-photo').src = cardInfo.cardPhoto;
            document.querySelector('.library-card-details .library-card-row:nth-child(1) .library-info-value').textContent = cardInfo.cardCode;
            const timeOptions = document.getElementById('timeOptions');
            timeOptions.innerHTML = `
                <span class="card-time-option year-${parseInt(cardInfo.expiryYear) - 1}" data-year="${parseInt(cardInfo.expiryYear) - 1}">${parseInt(cardInfo.expiryYear) - 1}</span>
                <span class="card-time-option year-${cardInfo.expiryYear} selected" data-year="${cardInfo.expiryYear}">${cardInfo.expiryYear}</span>
                <span class="card-time-option year-${parseInt(cardInfo.expiryYear) + 1}" data-year="${parseInt(cardInfo.expiryYear) + 1}">${parseInt(cardInfo.expiryYear) + 1}</span>
            `;
        }

        // Logic xử lý nhấp vào box năm
        const statusItem = document.getElementById('cardStatus');
        const statusCircle = statusItem.querySelector('.status-circle');
        const statusText = statusItem.querySelector('.status-text');
        const timeOptions = document.getElementById('timeOptions');
        const currentYear = 2025; // Năm hiện tại

        function updateStatus(selectedYear) {
            console.log('Updating status for year:', selectedYear);
            if (selectedYear === currentYear) {
                statusItem.classList.remove('inactive');
                statusItem.classList.add('active');
                statusCircle.innerHTML = '<i class="fas fa-check"></i>';
                if (statusText) statusText.textContent = 'Đang hoạt động';
            } else {
                statusItem.classList.remove('active');
                statusItem.classList.add('inactive');
                statusCircle.innerHTML = '<i class="fas fa-times"></i>';
                if (statusText) statusText.textContent = 'Không hoạt động';
            }
        }

        if (timeOptions) {
            timeOptions.querySelectorAll('.card-time-option').forEach(option => {
                option.addEventListener('click', () => {
                    const selectedYear = parseInt(option.getAttribute('data-year'));
                    timeOptions.querySelectorAll('.card-time-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    updateStatus(selectedYear);
                });
            });
        }

        const defaultYear = cardInfo ? parseInt(cardInfo.expiryYear) : 2025;
        updateStatus(defaultYear);
    } else {
        cardRegisteredSection.style.display = 'none';
        cardUnregisteredSection.style.display = 'block';
    }
});