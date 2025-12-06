// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Data produk untuk setiap game
    const products = {
        ml: [
            { id: 'ml1', name: '5 Diamonds', price: 2000 },
            { id: 'ml2', name: '12 Diamonds', price: 5000 },
            { id: 'ml3', name: '28 Diamonds', price: 10000 },
            { id: 'ml4', name: '56 Diamonds', price: 20000 },
            { id: 'ml5', name: '115 Diamonds', price: 40000 },
            { id: 'ml6', name: '230 Diamonds', price: 80000 },
            { id: 'ml7', name: '345 Diamonds', price: 120000 },
            { id: 'ml8', name: '575 Diamonds', price: 200000 },
            { id: 'ml9', name: '1.200 Diamonds', price: 400000 },
            { id: 'ml10', name: '2.400 Diamonds', price: 800000 }
        ],
        ff: [
            { id: 'ff1', name: '5 Diamonds', price: 1500 },
            { id: 'ff2', name: '12 Diamonds', price: 3500 },
            { id: 'ff3', name: '25 Diamonds', price: 7000 },
            { id: 'ff4', name: '50 Diamonds', price: 14000 },
            { id: 'ff5', name: '100 Diamonds', price: 28000 },
            { id: 'ff6', name: '210 Diamonds', price: 56000 },
            { id: 'ff7', name: '355 Diamonds', price: 100000 },
            { id: 'ff8', name: '720 Diamonds', price: 200000 },
            { id: 'ff9', name: '1.450 Diamonds', price: 400000 },
            { id: 'ff10', name: '2.950 Diamonds', price: 800000 }
        ],
        pubg: [
            { id: 'pubg1', name: '60 UC', price: 10000 },
            { id: 'pubg2', name: '325 UC', price: 50000 },
            { id: 'pubg3', name: '660 UC', price: 100000 },
            { id: 'pubg4', name: '1.800 UC', price: 250000 },
            { id: 'pubg5', name: '3.850 UC', price: 500000 },
            { id: 'pubg6', name: '8.100 UC', price: 1000000 }
        ],
        efootball: [
            { id: 'ef1', name: '100 Coins', price: 15000 },
            { id: 'ef2', name: '330 Coins', price: 50000 },
            { id: 'ef3', name: '680 Coins', price: 100000 },
            { id: 'ef4', name: '1.380 Coins', price: 200000 },
            { id: 'ef5', name: '3.480 Coins', price: 500000 },
            { id: 'ef6', name: '7.200 Coins', price: 1000000 }
        ]
    };

    // Keranjang belanja
    let cart = JSON.parse(localStorage.getItem('topupid_cart')) || [];
    
    // Inisialisasi
    initNavigation();
    loadProducts();
    updateCartCount();
    loadCartItems();
    setupEventListeners();
    
    // Fungsi untuk inisialisasi navigasi
    function initNavigation() {
        // Toggle mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navbar = document.querySelector('.navbar');
        
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
        
        // Navigasi antar section
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Dapatkan target section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                // Sembunyikan semua section
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Tampilkan target section
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // Update link aktif
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Tutup mobile menu jika terbuka
                navbar.classList.remove('active');
                
                // Scroll ke atas section
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Jika menuju keranjang, muat ulang item
                if (targetId === 'cart') {
                    loadCartItems();
                }
                
                // Jika menuju checkout, isi form jika ada item di keranjang
                if (targetId === 'checkout' && cart.length > 0) {
                    populateCheckoutForm();
                }
            });
        });
        
        // Link di footer untuk langsung ke game tertentu
        const gameLinks = document.querySelectorAll('a[data-game]');
        gameLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navigasi ke katalog
                document.querySelector('a[href="#catalog"]').click();
                
                // Highlight game yang dipilih
                const game = this.getAttribute('data-game');
                const gameCard = document.querySelector(`.game-card[data-game="${game}"]`);
                
                if (gameCard) {
                    // Scroll ke game card
                    setTimeout(() => {
                        gameCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Tambahkan efek highlight
                        gameCard.style.boxShadow = '0 0 0 3px var(--accent-color)';
                        setTimeout(() => {
                            gameCard.style.boxShadow = '';
                        }, 2000);
                    }, 500);
                }
            });
        });
    }
    
    // Fungsi untuk memuat produk ke halaman
    function loadProducts() {
        // Muat produk untuk setiap game
        for (const game in products) {
            const productList = document.getElementById(`${game}-products`);
            if (productList) {
                productList.innerHTML = '';
                
                products[game].forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <div class="product-info">
                            <span class="product-name">${product.name}</span>
                            <span class="product-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                        </div>
                        <button class="btn btn-small btn-primary add-to-cart" data-game="${game}" data-id="${product.id}">Tambah</button>
                    `;
                    productList.appendChild(productItem);
                });
            }
        }
        
        // Setup event listener untuk tombol tambah ke keranjang
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const game = this.getAttribute('data-game');
                const productId = this.getAttribute('data-id');
                
                // Temukan produk yang dipilih
                const product = products[game].find(p => p.id === productId);
                if (product) {
                    addToCart(game, product);
                }
            });
        });
    }
    
    // Fungsi untuk menambahkan produk ke keranjang
    function addToCart(game, product) {
        // Cek apakah produk sudah ada di keranjang
        const existingItemIndex = cart.findIndex(item => item.id === product.id && item.game === game);
        
        if (existingItemIndex >= 0) {
            // Jika sudah ada, tambah jumlah
            cart[existingItemIndex].quantity += 1;
        } else {
            // Jika belum ada, tambah item baru
            const gameNames = {
                ml: 'Mobile Legends',
                ff: 'Free Fire',
                pubg: 'PUBG Mobile',
                efootball: 'eFootball'
            };
            
            cart.push({
                id: product.id,
                game: game,
                gameName: gameNames[game],
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        // Simpan ke localStorage
        saveCart();
        
        // Update tampilan keranjang
        updateCartCount();
        
        // Tampilkan notifikasi
        showToast('Produk berhasil ditambahkan ke keranjang!');
    }
    
    // Fungsi untuk memuat item keranjang ke halaman
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        
        if (cart.length === 0) {
            // Tampilkan keranjang kosong
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang belanja Anda kosong</p>
                    <a href="#catalog" class="btn btn-primary">Lihat Katalog</a>
                </div>
            `;
            
            // Setup event listener untuk tombol lihat katalog di empty cart
            const viewCatalogBtn = cartItemsContainer.querySelector('.btn');
            viewCatalogBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('a[href="#catalog"]').click();
            });
        } else {
            // Tampilkan item keranjang
            cartItemsContainer.innerHTML = '';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.gameName} - ${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                        <p>Total: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-qty" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase-qty" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn remove-item" data-index="${index}">Hapus</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Setup event listener untuk tombol kuantitas
            const decreaseButtons = document.querySelectorAll('.decrease-qty');
            const increaseButtons = document.querySelectorAll('.increase-qty');
            const removeButtons = document.querySelectorAll('.remove-item');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    updateQuantity(index, cart[index].quantity - 1);
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    updateQuantity(index, cart[index].quantity + 1);
                });
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }
        
        // Update ringkasan belanja
        updateCartSummary();
    }
    
    // Fungsi untuk memperbarui jumlah item di keranjang
    function updateQuantity(index, newQuantity) {
        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }
        
        cart[index].quantity = newQuantity;
        saveCart();
        loadCartItems();
        updateCartCount();
    }
    
    // Fungsi untuk menghapus item dari keranjang
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        loadCartItems();
        updateCartCount();
        
        // Tampilkan notifikasi
        showToast('Produk dihapus dari keranjang!');
    }
    
    // Fungsi untuk memperbarui ringkasan belanja
    function updateCartSummary() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('total-price').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    }
    
    // Fungsi untuk memperbarui jumlah item di keranjang (di navigasi)
    function updateCartCount() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = cartCount;
    }
    
    // Fungsi untuk mengisi form checkout dengan item pertama di keranjang
    function populateCheckoutForm() {
        if (cart.length > 0) {
            const firstItem = cart[0];
            document.getElementById('checkout-game').value = firstItem.gameName;
            document.getElementById('checkout-product').value = `${firstItem.name} (${firstItem.quantity}x)`;
            
            // Hitung total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('checkout-total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }
    
    // Fungsi untuk menyimpan keranjang ke localStorage
    function saveCart() {
        localStorage.setItem('topupid_cart', JSON.stringify(cart));
    }
    
    // Fungsi untuk menampilkan notifikasi toast
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.style.display = 'block';
        
        // Sembunyikan toast setelah 3 detik
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
    
    // Fungsi untuk setup semua event listener
    function setupEventListeners() {
        // Form login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Login berhasil! (Demo)');
                // Reset form
                this.reset();
            });
        }
        
        // Form register
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Pendaftaran berhasil! (Demo)');
                // Navigasi ke home
                document.querySelector('a[href="#home"]').click();
                // Reset form
                this.reset();
            });
        }
        
        // Tombol lanjut ke checkout
        const proceedCheckoutBtn = document.getElementById('proceed-checkout');
        if (proceedCheckoutBtn) {
            proceedCheckoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (cart.length === 0) {
                    showToast('Keranjang kosong. Tambah produk terlebih dahulu!');
                    return;
                }
                
                // Navigasi ke checkout
                document.querySelector('a[href="#checkout"]').click();
            });
        }
        
        // Form checkout
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Tampilkan konfirmasi
                showToast('Pembelian berhasil! Silakan lakukan pembayaran. (Demo)');
                
                // Kosongkan keranjang
                cart = [];
                saveCart();
                updateCartCount();
                
                // Reset form
                this.reset();
                
                // Navigasi ke home
                setTimeout(() => {
                    document.querySelector('a[href="#home"]').click();
                }, 1500);
            });
        }
        
        // Form kontak
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Pesan terkirim! Admin akan membalas segera. (Demo)');
                // Reset form
                this.reset();
            });
        }
    }
});