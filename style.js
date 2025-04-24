// هدر حرفه‌ای و مدرن (سازگار با سیستم‌های کوچک)
document.addEventListener('DOMContentLoaded', function () {
    // --- منوی موبایل ---
    const menuToggle = document.getElementById('header-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('header-overlay');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const hasSubmenus = document.querySelectorAll('.mobile-nav .has-submenu > a');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeMobileNav) {
        closeMobileNav.addEventListener('click', closeMenu);
    }
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    function closeMenu() {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    // زیرمنوهای موبایل
    hasSubmenus.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });

    // --- جستجوی زنده (نمونه ساده) ---
    const searchInput = document.getElementById('header-search-input');
    const suggestions = document.getElementById('search-suggestions');
    if (searchInput && suggestions) {
        const sampleProducts = [
            'نایک ایرمکس',
            'آدیداس اولترا بوست',
            'اسیکس ژل',
            'پوما رانینگ',
            'بروکس گوست',
            'ساکنی تریومف',
            'میزانو ویو',
            'سالامون اسپیدکراس',
            'جردن 6',
            'نیوبالانس 574'
        ];
        searchInput.addEventListener('input', function () {
            const val = this.value.trim();
            if (val.length > 1) {
                const filtered = sampleProducts.filter(p => p.includes(val));
                if (filtered.length) {
                    suggestions.innerHTML = filtered.map(p => `<li>${p}</li>`).join('');
                    suggestions.classList.add('active');
                } else {
                    suggestions.innerHTML = '<li>نتیجه‌ای یافت نشد</li>';
                    suggestions.classList.add('active');
                }
            } else {
                suggestions.classList.remove('active');
            }
        });
        suggestions.addEventListener('click', function (e) {
            if (e.target.tagName === 'LI') {
                searchInput.value = e.target.textContent;
                suggestions.classList.remove('active');
            }
        });
        document.addEventListener('click', function (e) {
            if (!suggestions.contains(e.target) && e.target !== searchInput) {
                suggestions.classList.remove('active');
            }
        });
    }

    // --- بروزرسانی نشان سبد و علاقه‌مندی (نمونه) ---
    document.getElementById('cart-badge').textContent = localStorage.getItem('cartCount') || '0';
    document.getElementById('fav-badge').textContent = localStorage.getItem('favCount') || '0';

    // --- جستجو با اینتر ---
    const searchForm = document.getElementById('header-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const val = searchInput.value.trim();
            if (val.length > 0) {
                window.location.href = `search.html?query=${encodeURIComponent(val)}`;
            }
        });
    }
}); 