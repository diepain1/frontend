
  //Class sản phẩm 
  class Product {
    constructor(id,name,price,image,category,hot,description){
      this.id=id;
      this.name=name;
      this.price=price;
      this.image=image;
      this.category=category;
      this.hot=hot;
      this.description=description;
    }
    render(){
      return `
      <div class="card">
        <img src="${this.image}" alt="${this.name}">
        <a href="detail.html?id=${this.id}">
        <h3>${this.name}</h3>
        </a>
        <p class="price">${this.price.toLocaleString()}đ</p>
        <div class="actions">
          <button class="btn-like">♡ Thích</button>
          <button class="btn-compare">⇄ So sánh</button>
          
        </div>
      </div>
    `
    }
renderDetail(){
    return `
    <div class="product-detail-container">
      <img src='${this.image}' alt="${this.name}" class="detail-image">
      <div class="detail-info">
        <h2>${this.name}</h2>
        <p class="detail-price">Giá: ${this.price.toLocaleString()}đ</p>
        <span class="detail-description">${this.description}</span>
        <button id="addCartBtn" productId="${this.id}" class="btn-add-to-cart">Thêm vào giỏ hàng</button>
      </div>
    </div>
    `
}
 renderCart(quantity){
        const total = this.price * quantity;
        return `
        <tr>
            <td>
                <img src="${this.image}" alt="${this.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                ${this.name}
            </td>
            <td>
                <button class="cart-action-btn decrease-btn" data-id="${this.id}">-</button>
                <span class="product-quantity">${quantity}</span>
                <button class="cart-action-btn increase-btn" data-id="${this.id}">+</button>
            </td>
            <td>${this.price.toLocaleString()}đ</td>
            <td>${total.toLocaleString()}đ</td>
            <td>
                <button class="btn remove remove-btn" data-id="${this.id}">Xóa</button>
            </td>
        </tr>
        `
    }
}


  //Show Trang Chủ
   //trang chủ
const productHot = document.getElementById('hot');
const productLaptop = document.getElementById('laptop');
const productDienThoai = document.getElementById('phone');

if (productHot) {
    fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const dataHot = data.filter(p => p.hot == true);
        const dataLaptop = data.filter(p => p.category === "laptop");
        const dataPhone = data.filter(p => p.category === "điện thoại");
        //show sản phẩm nổi bật
        renderProduct(dataHot,productHot);
        //show sản phẩm laptop
        renderProduct(dataLaptop,productLaptop);
        //show sản phẩm điện thoại
        renderProduct(dataPhone,productDienThoai);
    });
}
//Show trang sản phẩm
const productAll = document.getElementById('all-product');
const searchInput= document.getElementById("search-input");
let allProductData= [];
const sortPrice=document.getElementById('sort-price');
if (productAll) {
    fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        renderProduct(data,productAll);
        allProductData= data;
    });
      if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredProducts = allProductData.filter(
            p => p.name.toLowerCase().includes(keyword)
        );
        renderProduct(filteredProducts, productAll);
    });
}
 if(sortPrice){
  sortPrice.addEventListener('change',(e)=>{
    alert(e.target.value);
    if(e.target.value==='asc'){
      allProductData.sort((a,b) => a.price-b.price);
    }
     else if(e.target.value==='desc'){
      allProductData.sort((a,b) => b.price-a.price);
    }
    renderProduct(allProductData,productAll);
  })
 }
}
const renderProduct = (array, theDiv) => {
    let html = "";
    array.forEach((item) => {
        const product = new Product(
            item.id,
            item.name,
            item.price,
            item.image,
            item.category,
            item.hot,
            item.description
        );
        html += product.render();
    });
    theDiv.innerHTML = html;
};
  // const slides = document.querySelectorAll(".slide");
  // let index = 0;

  // document.querySelector(".next").addEventListener("click", () => {
  //   slides[index].classList.remove("active");
  //   index = (index + 1) % slides.length;
  //   slides[index].classList.add("active");
  // });

  // document.querySelector(".prev").addEventListener("click", () => {
  //   slides[index].classList.remove("active");
  //   index = (index - 1 + slides.length) % slides.length;
  //   slides[index].classList.add("active");
  // });
  // setInterval(() => {
  //   slides[index].classList.remove("active");
  //   index = (index + 1) % slides.length;
  //   slides[index].classList.add("active");
  // }, 3000);

// Trang chi tiết
const productDetailDiv= document.getElementById("detail-product");
if(productDetailDiv){
  const urlParam = new URLSearchParams(window.location.search);
  const id = urlParam.get("id");
  
   fetch(`http://localhost:3000/products/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
       const product = new Product(
        data.id,
        data.name,
        data.price,
        data.image,
        data.category,
        data.hot,
        data.description
    );
    productDetailDiv.innerHTML=product.renderDetail();
    });
}

// clas Cart
//Giỏ hàng 
class Cart{
    constructor(){
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    saveCart(){
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(product){
        const existingItem = this.items.find(item => item.id == product.id);
        if(existingItem){
            existingItem.quantity ++;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.saveCart();
    }

    increaseQuantity(productId){
        const item = this.items.find(item => item.id == productId);
        if (item) {
            item.quantity++;
            this.saveCart();
            this.render();
        }
    }

    decreaseQuantity(productId){
        const item = this.items.find(item => item.id == productId);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.render();
            }
        }
    }

    removeItem(productId){
        this.items = this.items.filter(item => item.id != productId);
        this.saveCart();
        this.render();
    }

    render(){
        const cartContentDiv = document.getElementById('cart-content'); 
        const cartCountSpan = document.getElementById('cartCount');

        if (cartCountSpan) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.innerHTML = `Giỏ hàng: ${totalItems}`;
        }

        if (!cartContentDiv) return;

        let tableRowsHTML = "";
        let totalMoney = 0;

        this.items.forEach(item => {
            totalMoney += item.price * item.quantity;
            const product = new Product(
                item.id, item.name, item.price, item.image, item.category, item.hot, item.description
            );
            
            tableRowsHTML += product.renderCart(item.quantity);
        });

        const fullCartHTML = `
        <div class="cart-container">
            <h2>Giỏ hàng của bạn</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHTML}
                </tbody>
            </table>
            <p><strong>Tổng tiền: ${totalMoney.toLocaleString()}đ</strong></p>
            <a class="checkout" href="checkout.html">Thanh toán </a>
        </div>
        `;

        cartContentDiv.innerHTML = this.items.length === 0  
            ? '<div class="cart-container"><h2 style="text-align:center;">Giỏ hàng của bạn đang trống 🛒</h2><a href="product.html">Tiếp tục mua sắm</a></div>' 
            : fullCartHTML;
    }
}
const cart = new Cart();

// 🚀 TỐI ƯU HÓA: Gộp cả hai khối Event Listener thành một
document.addEventListener('click',function(e){
    const target = e.target;
    
    // 1. Xử lý nút Thêm vào giỏ hàng (id="addCartBtn")
    
    if(target && target.id=="addCartBtn"){
        console.log(target);    
        const id = target.getAttribute('productId');
        fetch(`http://localhost:3000/products/${id}`)
        .then(response => response.json())
        .then(data => {
            const product = new Product(
                data.id, data.name, data.price, data.image, data.category, data.hot, data.description
            );
            cart.addItem(product);
            // Cập nhật số lượng trên header
            const cartBadge = document.querySelector(".cart-count-badge");
            if (cartBadge) {
            const totalItems = cart.items.length;
            cartBadge.textContent = totalItems;
}
        });
    }

    // 2. Xử lý Tăng/Giảm/Xóa trên trang Giỏ hàng (#cart-content)
    if (target.closest('#cart-content')) {
        const productId = target.dataset.id;
        
        if (target.classList.contains('increase-btn')) {
            cart.increaseQuantity(productId);
        } else if (target.classList.contains('decrease-btn')) {
            cart.decreaseQuantity(productId);
        } else if (target.classList.contains('remove-btn')) {
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                cart.removeItem(productId);
            }
        }
    }
})

// Hiển thị Giỏ hàng khi tải trang cart.html
const cartPageDiv = document.getElementById('cart-content');
if (cartPageDiv) {
    cart.render();
}


// Tạo header để thêm vào các trang
const header= document.createElement('header');
header.innerHTML=`
 <header class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="img/logo.png">
    </div>

    <!-- Menu -->
    <nav class="menu">
      <a href="index2.html">Trang Chủ</a>
      <a href="product.html">Sản phẩm </a>
      <a href="about.html">Thông Tin </a>
      <a href="discount.html">Khuyến Mãi </a>
        
    </nav>

    <!-- Icons -->
    <div class="icons">
      <i class="fa-regular fa-user"></i>
      <i class="fa-regular fa-id-badge"></i>
     <div class="cart-icon-wrapper">
    <a href='cart.html'><i class="fa-solid fa-cart-shopping"></i></a>
    <span class="cart-count-badge">
        ${cart.items.length}
    </span>
</div>
    </div>
  </header>`
document.body.prepend(header);
// Tạo footer
const footer = document.createElement("footer");
footer.innerHTML=`
<footer class="footer">
  <div class="footer-container">
    <!-- Cột 1 -->
    <div class="footer-col">
      <h3>HỆ THỐNG CỬA HÀNG Hôn nè</h3>
      <p>Hôn nè STUDIO Store 1: 26 LY TU TRONG STREET, DISTRICT 1, HOCHIMINH (THE NEW PLAYGROUND).</p>
      <p>Store 2: 140 NGUYEN HY QUANG, DONG DA DISTRICT, HANOI.</p>
    </div>

    <!-- Cột 2 -->
    <div class="footer-col">
      <h3>CHÍNH SÁCH</h3>
      <ul>
        <li><a href="#">Chính sách sử dụng website</a></li>
        <li><a href="#">Phương thức thanh toán</a></li>
        <li><a href="#">Chính sách đổi trả</a></li>
        <li><a href="#">Chính sách bảo mật</a></li>
      </ul>
    </div>

    <!-- Cột 3 -->
    <div class="footer-col">
      <h3>THÔNG TIN LIÊN HỆ</h3>
      <ul>
        <li>CÔNG TY TNHH Hôn nè</li>
        <li>SỐ CSKH: 02873011021 (10h - 18h)</li>
        <li>Ngày cấp: 20/07/2020</li>
        <li>Tuyển dụng: <a href="mailto:hr@Hôn nè.vn">hr@Hôn nè.vn</a></li>
        <li>Website: <a href="index2.html">Hôn nè.vn</a></li>
        <li>For business: <a href="mailto:contact@Hôn nè.vn">contact@Hôn nè.vn</a></li>
      </ul>
    </div>

    <!-- Cột 4 -->
    <div class="footer-col">
      <h3>FOLLOW US ON SOCIAL MEDIA</h3>
      <div class="socials">
        <a href="#"><img src="img/facebook.png" alt="Facebook"></a>
        <a href="#"><img src="img/instagram.png" alt="Instagram"></a>
      </div>
      
    </div>
  </div>
  
</footer>
`
document.body.appendChild(footer);