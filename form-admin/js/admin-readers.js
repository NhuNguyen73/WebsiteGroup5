// Danh sách độc giả (dữ liệu giả lập đã được cập nhật)
let readers = [
    {
        id: "DG0000",
        name: "Phạm Thị Minh Sang",
        dob: "20/11/2005",
        gender: "Nữ",
        phone: "0987654321",
        email: "minhsang@gmail.com",
        address: "Thái Bình",
        education: "Trung học"
    },
    {
        id: "DG0001",
        name: "Mai Minh Đức Đức",
        dob: "15/05/2005",
        gender: "Nam",
        phone: "0912345678",
        email: "ducduc@gmail.com",
        address: "Hải Phòng",
        education: "Cao học"
    },
    {
        id: "DG0002",
        name: "Nguyễn Phương Quỳnh",
        dob: "20/11/2005",
        gender: "Nữ",
        phone: "0934567890",
        email: "quynhphuong2000@gmail.com",
        address: "Hải Dương",
        education: "Cao học"
    },
    {
        id: "DG0003",
        name: "Nguyễn Phúc Đức Đức",
        dob: "11/02/2004",
        gender: "Nam",
        phone: "0971234567",
        email: "phucphuc@gmail.com",
        address: "Hưng Yên",
        education: "Trung học"
    }
];

// Sắp xếp mảng ban đầu theo ID giảm dần
readers.sort((a, b) => b.id.localeCompare(a.id));

let currentReaderId = null;

// Đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Hiển thị modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Hiển thị thông báo tùy chỉnh
function showCustomAlert(message) {
    const alertPopup = document.getElementById('custom-alert-popup');
    document.getElementById('custom-alert-message').textContent = message;
    alertPopup.style.display = 'block';
    setTimeout(() => {
        alertPopup.classList.add('show');
    }, 10);
}

// Đóng thông báo tùy chỉnh
function closeCustomAlert() {
    const alertPopup = document.getElementById('custom-alert-popup');
    alertPopup.classList.remove('show');
    setTimeout(() => {
        alertPopup.style.display = 'none';
    }, 300);
}

// Kiểm tra định dạng email
function isValidEmail(email) {
    return email.endsWith('@gmail.com') && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// Kiểm tra số điện thoại
function isValidPhone(phone) {
    return phone.length === 10 && /^[0-9]{10}$/.test(phone);
}

// Kiểm tra ngày sinh hợp lệ
function isValidDate(dob) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dob)) return false;

    const [day, month, year] = dob.split('/').map(Number);
    const yearNum = Number(year);

    // Kiểm tra năm trong khoảng 1945-2015
    if (yearNum < 1945 || yearNum > 2015) {
        return false;
    }

    // Kiểm tra ngày và tháng hợp lệ
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        return false;
    }

    // Kiểm tra số ngày trong tháng
    const daysInMonth = new Date(yearNum, month, 0).getDate();
    return day <= daysInMonth;
}

// Tạo ID độc giả mới
function generateReaderId() {
    if (readers.length === 0) {
        return "DG0000";
    }
    const lastReaderId = readers[0].id; // Lấy ID lớn nhất (ở đầu mảng sau khi sắp xếp)
    const number = parseInt(lastReaderId.replace("DG", "")) + 1;
    return `DG${number.toString().padStart(4, '0')}`;
}

// Cập nhật bảng độc giả
function updateReadersTable(filteredReaders = readers) {
    // Sắp xếp danh sách theo ID giảm dần
    const sortedReaders = [...filteredReaders].sort((a, b) => b.id.localeCompare(a.id));
    
    const tbody = document.querySelector('#reader-list tbody');
    tbody.innerHTML = '';
    if (sortedReaders.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="9">Trống</td>`;
        tbody.appendChild(row);
    } else {
        sortedReaders.forEach(reader => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Mã độc giả">${reader.id}</td>
                <td data-label="Họ và tên">${reader.name}</td>
                <td data-label="Ngày sinh">${reader.dob}</td>
                <td data-label="Giới tính">${reader.gender}</td>
                <td data-label="Số điện thoại">${reader.phone}</td>
                <td data-label="Email">${reader.email}</td>
                <td data-label="Địa chỉ">${reader.address}</td>
                <td data-label="Trình độ học vấn">${reader.education}</td>
                <td data-label="Thao tác">
                    <button class="btn btn-edit" onclick="showEditReaderPopup('${reader.id}')">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-delete" onclick="deleteReaderConfirm('${reader.id}')">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Tìm kiếm độc giả
function searchReaders() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();
    const clearButton = document.getElementById('clear-search');

    clearButton.style.display = searchValue ? 'block' : 'none';

    const filteredReaders = readers.filter(reader => 
        reader.id.toLowerCase().includes(searchValue) ||
        reader.name.toLowerCase().includes(searchValue)
    );
    updateReadersTable(filteredReaders);
}

// Xóa từ khóa tìm kiếm
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    document.getElementById('clear-search').style.display = 'none';
    updateReadersTable();
}

// Hiển thị popup thêm độc giả
function showAddReaderPopup() {
    document.getElementById('add-reader-id').value = generateReaderId();
    document.getElementById('add-reader-name').value = '';
    document.getElementById('add-reader-dob').value = '';
    document.getElementById('add-reader-gender').value = '';
    document.getElementById('add-reader-phone').value = '';
    document.getElementById('add-reader-email').value = '';
    document.getElementById('add-reader-address').value = '';
    document.getElementById('add-reader-education').value = '';
    showModal('add-reader-popup');
}

// Thêm độc giả
function addReader() {
    const inputs = document.querySelectorAll('#add-reader-popup input[required], #add-reader-popup select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    const dob = document.getElementById('add-reader-dob').value;
    if (!isValidDate(dob)) {
        showCustomAlert('Ngày sinh không hợp lệ! Định dạng phải là DD/MM/YYYY và năm từ 1945 đến 2015.');
        document.getElementById('add-reader-dob').style.borderColor = 'red';
        return;
    }

    const phone = document.getElementById('add-reader-phone').value;
    if (!isValidPhone(phone)) {
        showCustomAlert('Số điện thoại phải có đúng 10 số!');
        document.getElementById('add-reader-phone').style.borderColor = 'red';
        return;
    }

    const email = document.getElementById('add-reader-email').value;
    if (!isValidEmail(email)) {
        showCustomAlert('Email phải có định dạng @gmail.com!');
        document.getElementById('add-reader-email').style.borderColor = 'red';
        return;
    }

    const newReader = {
        id: document.getElementById('add-reader-id').value,
        name: document.getElementById('add-reader-name').value,
        dob: dob,
        gender: document.getElementById('add-reader-gender').value,
        phone: phone,
        email: email,
        address: document.getElementById('add-reader-address').value,
        education: document.getElementById('add-reader-education').value
    };

    readers.push(newReader); // Thêm vào cuối mảng
    readers.sort((a, b) => b.id.localeCompare(a.id)); // Sắp xếp lại theo ID giảm dần
    updateReadersTable();
    closeModal('add-reader-popup');
    showCustomAlert('Độc giả đã được thêm thành công!');
}

// Hiển thị popup chỉnh sửa độc giả
function showEditReaderPopup(readerId) {
    const reader = readers.find(r => r.id === readerId);
    if (reader) {
        currentReaderId = readerId;
        document.getElementById('edit-reader-id').value = reader.id;
        document.getElementById('edit-reader-name').value = reader.name;
        document.getElementById('edit-reader-dob').value = reader.dob;
        document.getElementById('edit-reader-gender').value = reader.gender;
        document.getElementById('edit-reader-phone').value = reader.phone;
        document.getElementById('edit-reader-email').value = reader.email;
        document.getElementById('edit-reader-address').value = reader.address;
        document.getElementById('edit-reader-education').value = reader.education;
        showModal('edit-reader-popup');
    }
}

// Lưu thông tin đã chỉnh sửa
function saveEditedReader() {
    const inputs = document.querySelectorAll('#edit-reader-popup input[required], #edit-reader-popup select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    const dob = document.getElementById('edit-reader-dob').value;
    if (!isValidDate(dob)) {
        showCustomAlert('Ngày sinh không hợp lệ! Định dạng phải là DD/MM/YYYY và năm từ 1945 đến 2015.');
        document.getElementById('edit-reader-dob').style.borderColor = 'red';
        return;
    }

    const phone = document.getElementById('edit-reader-phone').value;
    if (!isValidPhone(phone)) {
        showCustomAlert('Số điện thoại phải có đúng 10 số!');
        document.getElementById('edit-reader-phone').style.borderColor = 'red';
        return;
    }

    const email = document.getElementById('edit-reader-email').value;
    if (!isValidEmail(email)) {
        showCustomAlert('Email phải có định dạng @gmail.com!');
        document.getElementById('edit-reader-email').style.borderColor = 'red';
        return;
    }

    const readerIndex = readers.findIndex(r => r.id === currentReaderId);
    if (readerIndex !== -1) {
        readers[readerIndex] = {
            id: readers[readerIndex].id,
            name: document.getElementById('edit-reader-name').value,
            dob: dob,
            gender: document.getElementById('edit-reader-gender').value,
            phone: phone,
            email: email,
            address: document.getElementById('edit-reader-address').value,
            education: document.getElementById('edit-reader-education').value
        };
        readers.sort((a, b) => b.id.localeCompare(a.id)); // Sắp xếp lại theo ID giảm dần
        updateReadersTable();
        closeModal('edit-reader-popup');
        showCustomAlert('Thông tin độc giả đã được cập nhật!');
    }
}

// Xác nhận xóa độc giả
function deleteReaderConfirm(readerId) {
    currentReaderId = readerId;
    showModal('delete-reader-popup');
}

// Xóa độc giả
function deleteReader() {
    readers = readers.filter(r => r.id !== currentReaderId);
    readers.sort((a, b) => b.id.localeCompare(a.id)); // Sắp xếp lại sau khi xóa
    updateReadersTable();
    closeModal('delete-reader-popup');
    showCustomAlert('Độc giả đã được xóa!');
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });

    const alertPopup = document.getElementById('custom-alert-popup');
    if (event.target === alertPopup) {
        closeCustomAlert();
    }
};

// Khởi tạo bảng khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateReadersTable();
});