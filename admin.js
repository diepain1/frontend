const API_URL = 'http://localhost:3000';
let currentImageBase64 = '';  // Lưu ảnh base64 tạm thời

// ------------------- Upload ảnh -------------------
const imageInput = document.getElementById('productImageFile');
const previewImage = document.getElementById('previewImage');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentImageBase64 = e.target.result;
      previewImage.src = currentImageBase64;
      previewImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// ------------------- Quản lý sản phẩm -------------------
const productTableBody = document.getElementById('productTableBody');
const productForm = document.getElementById('productForm');

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  productTableBody.innerHTML = data.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price.toLocaleString()} đ</td>
      <td>${p.category}</td>
      <td class="hot-col">${p.hot ? '✅' : '❌'}</td>
      <td>
        <img src="${p.image}" alt="${p.name}">
      </td>
      <td>
        <button class="action-btn action-edit" onclick="editProduct(${p.id})">Sửa</button>
        <button class="action-btn action-delete" onclick="deleteProduct(${p.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;

  let imageData = currentImageBase64;
  if (!imageData && id) {
    const old = await fetch(`${API_URL}/products/${id}`).then(r => r.json());
    imageData = old.image;
  }

  const newProduct = {
    name: document.getElementById('productName').value.trim(),
    price: Number(document.getElementById('productPrice').value),
    image: imageData,
    category: document.getElementById('productCategory').value.trim(),
    hot: document.getElementById('productHot').checked,
    description: document.getElementById('productDesc').value.trim()
  };

  if (id) {
    await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
  } else {
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
  }

  productForm.reset();
  previewImage.style.display = 'none';
  currentImageBase64 = '';
  document.getElementById('productId').value = '';
  loadProducts();
});

window.editProduct = async (id) => {
  const p = await fetch(`${API_URL}/products/${id}`).then(r => r.json());
  document.getElementById('productId').value = p.id;
  document.getElementById('productName').value = p.name;
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productCategory').value = p.category;
  document.getElementById('productHot').checked = p.hot;
  document.getElementById('productDesc').value = p.description;
  previewImage.src = p.image;
  previewImage.style.display = 'block';
  currentImageBase64 = ''; // Reset để giữ ảnh cũ nếu không upload mới
};

window.deleteProduct = async (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    loadProducts();
  }
};

// ------------------- Quản lý Người dùng -------------------
const userTableBody = document.getElementById('userTableBody');

async function loadUsers() {
  const res = await fetch(`${API_URL}/users`);
  const data = await res.json();
  userTableBody.innerHTML = data.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.role}</td>
      <td>
        <button class="action-btn action-delete" onclick="deleteUser(${u.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

window.deleteUser = async (id) => {
  if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    loadUsers();
  }
};

// ------------------- Tab chuyển đổi -------------------
const tabProducts = document.getElementById('tabProducts');
const tabUsers = document.getElementById('tabUsers');
const productSection = document.getElementById('productSection');
const userSection = document.getElementById('userSection');

tabProducts.addEventListener('click', () => {
  tabProducts.classList.add('active');
  tabUsers.classList.remove('active');
  productSection.style.display = 'block';
  userSection.style.display = 'none';
});

tabUsers.addEventListener('click', () => {
  tabUsers.classList.add('active');
  tabProducts.classList.remove('active');
  userSection.style.display = 'block';
  productSection.style.display = 'none';
});

// ------------------- Khởi động -------------------
loadProducts();
loadUsers();
