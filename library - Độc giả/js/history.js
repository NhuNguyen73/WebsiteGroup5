$(document).ready(function () {
    $('.btn-view-details').click(function () {
        var requestId = $(this).data('request-id');

        // Gọi AJAX để lấy chi tiết
        $.ajax({
            url: '/Reader/GetLoanRequestDetails',
            type: 'GET',
            data: { requestId: requestId },
            success: function (response) {
                if (response.success) {
                    // Tạo modal động
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.id = 'loan-request-details-modal';

                    let content = `
                        <div class="modal-content">
                            <span class="close-button" onclick="closeModal('loan-request-details-modal')">×</span>
                    `;

                    if (response.status === 'Choduyet') {
                        content += `
                            <h2>Danh sách yêu cầu mượn</h2>
                            <table class="book-detail-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sách</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${response.books.map(book => `
                                        <tr>
                                            <td>${book.stt}</td>
                                            <td>${book.bookTitle}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div class="modal-actions">
                                <button class="btn btn-cancel-request" data-request-id="${requestId}">Hủy yêu cầu mượn</button>
                            </div>
                        `;
                    } else if (response.status === 'Daduyet') {
                        content += `
                            <h2>Danh sách mượn</h2>
                            <table class="book-detail-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sách</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${response.books.map(book => `
                                        <tr>
                                            <td>${book.stt}</td>
                                            <td>${book.bookTitle}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `;
                        // Sau này sẽ bổ sung Ngày mượn, Ngày trả, Hạn trả từ BorrowingSlip
                    } else {
                        content += `
                            <h2>Danh sách yêu cầu mượn</h2>
                            <table class="book-detail-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sách</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${response.books.map(book => `
                                        <tr>
                                            <td>${book.stt}</td>
                                            <td>${book.bookTitle}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `;
                    }

                    content += `</div>`;
                    modal.innerHTML = content;
                    document.body.appendChild(modal);

                    // Hiển thị modal với animation
                    setTimeout(() => {
                        modal.style.display = 'block';
                        modal.classList.add('show');
                    }, 10);
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Đã xảy ra lỗi khi tải chi tiết.');
            }
        });
    });
});

// Hàm đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.remove();
    }, 300);
}