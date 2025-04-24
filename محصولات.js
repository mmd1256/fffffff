/**
 * اسلایدر پیشرفته و مدرن با بهینه‌سازی عملکرد
 * نسخه: 2.0.0
 */
class AdvancedSlider {
    constructor(selector = '.modern-slider', options = {}) {
        // تنظیمات پیش‌فرض با قابلیت شخصی‌سازی
        this.config = {
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            transitionSpeed: 800,
            keyboard: true,
            swipe: true,
            indicators: true,
            slideSelector: '.slide',
            prevSelector: '[data-control="prev"]',
            nextSelector: '[data-control="next"]',
            paginationSelector: '.pagination-dot',
            progressSelector: '.progress-indicator',
            pausePlaySelector: '[data-control="pause-play"]',
            currentCounterSelector: '.slide-counter .current',
            totalCounterSelector: '.slide-counter .total',
            ...options
        };
        
        // انتخاب عناصر DOM اصلی
        this.slider = document.querySelector(selector);
        
        // بررسی وجود اسلایدر - خروج در صورت عدم وجود
        if (!this.slider) {
            console.error(`خطا: اسلایدر با سلکتور "${selector}" یافت نشد!`);
            return;
        }
        
        // انتخاب عناصر DOM مورد نیاز
        this.slides = this.slider.querySelectorAll(this.config.slideSelector);
        this.prevButton = this.slider.querySelector(this.config.prevSelector);
        this.nextButton = this.slider.querySelector(this.config.nextSelector);
        this.pagination = this.slider.querySelectorAll(this.config.paginationSelector);
        this.progress = this.slider.querySelector(this.config.progressSelector);
        this.pausePlayButton = this.slider.querySelector(this.config.pausePlaySelector);
        this.currentCounter = this.slider.querySelector(this.config.currentCounterSelector);
        this.totalCounter = this.slider.querySelector(this.config.totalCounterSelector);
        
        // متغیرهای داخلی
        this.totalSlides = this.slides.length;
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.isPlaying = this.config.autoplay;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        // فارسی‌سازی اعداد
        this.persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        
        // کش کردن تابع‌های پر استفاده برای بهبود عملکرد
        this.boundHandleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        // راه‌اندازی اسلایدر
        this.init();
    }
    
    /**
     * راه‌اندازی اسلایدر
     */
    init() {
        if (this.totalSlides === 0) {
            console.warn('هشدار: هیچ اسلایدی یافت نشد!');
            return;
        }
        
        // تنظیم زمان انیمیشن CSS
        this.setCSSTransitionDuration();
        
        // نمایش اسلاید اول
        this.showSlide(0, false);
        
        // به‌روزرسانی شمارنده
        this.updateCounter();
        
        // به‌روزرسانی نوار پیشرفت
        this.updateProgressBar();
        
        // راه‌اندازی رویدادها
        this.setupEventListeners();
        
        // شروع پخش خودکار اگر فعال باشد
        if (this.config.autoplay) {
            this.startAutoplay();
            this.updatePausePlayButton();
        }
        
        // افزودن رویداد برای تغییر وضعیت صفحه (هنگام تغییر تب)
        document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
        
        // آماده‌سازی تکمیل شد
        this.slider.classList.add('slider-initialized');
        
        // گزارش وضعیت
        if (window.console && window.console.info) {
            console.info(`اسلایدر با ${this.totalSlides} اسلاید راه‌اندازی شد.`);
        }
    }
    
    /**
     * تنظیم زمان انیمیشن CSS
     */
    setCSSTransitionDuration() {
        // تنظیم زمان انیمیشن بر اساس تنظیمات
        const style = document.createElement('style');
        style.textContent = `
            ${this.config.slideSelector} {
                transition-duration: ${this.config.transitionSpeed}ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * تنظیم رویدادهای اسلایدر
     */
    setupEventListeners() {
        // رویداد دکمه‌های قبلی و بعدی
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // رویداد نقاط پیمایش
        this.pagination.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide, 10);
                this.goToSlide(slideIndex);
            });
        });
        
        // رویداد دکمه توقف/پخش
        if (this.pausePlayButton) {
            this.pausePlayButton.addEventListener('click', () => {
                this.toggleAutoplay();
            });
        }
        
        // رویداد پایان انیمیشن
        this.slides.forEach(slide => {
            slide.addEventListener('transitionend', this.boundHandleTransitionEnd);
        });
        
        // پشتیبانی از کلیدهای صفحه کلید
        if (this.config.keyboard) {
            this.setupKeyboardNavigation();
        }
        
        // پشتیبانی از لمس برای موبایل
        if (this.config.swipe) {
            this.setupTouchNavigation();
        }
        
        // توقف اسلاید در هنگام شناور شدن ماوس
        if (this.config.pauseOnHover) {
            this.setupHoverPause();
        }
        
        // رویداد تغییر اندازه صفحه (با بهینه‌سازی)
        window.addEventListener('resize', this.debounce(() => {
            this.updateProgressBar();
        }, 250));
    }
    
    /**
     * تنظیم ناوبری با کیبورد
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // بررسی اینکه فوکوس روی فیلد ورودی نباشد
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.key === 'ArrowLeft') { // RTL
                this.nextSlide();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') { // RTL
                this.prevSlide();
                e.preventDefault();
            }
        });
    }
    
    /**
     * تنظیم ناوبری لمسی
     */
    setupTouchNavigation() {
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    }
    
    /**
     * تنظیم توقف اسلایدر با هاور
     */
    setupHoverPause() {
        this.slider.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.pauseAutoplay();
            }
        });
        
        this.slider.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.startAutoplay();
            }
        });
    }
    
    /**
     * مدیریت رویداد پایان انیمیشن
     */
    handleTransitionEnd(e) {
        if (e.target.classList.contains('active')) {
            this.isTransitioning = false;
            this.dispatchSlideChangeEvent();
        }
    }
    
    /**
     * مدیریت رویداد تغییر وضعیت صفحه
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // صفحه مخفی شده - توقف اسلایدر
            this.pauseAutoplay();
        } else {
            // صفحه مجدداً نمایش داده شده - شروع مجدد اسلایدر
            if (this.isPlaying) {
                this.startAutoplay();
            }
        }
    }
    
    /**
     * مدیریت رویداد سوایپ
     */
    handleSwipe() {
        const swipeThreshold = 75;
        const diffX = this.touchEndX - this.touchStartX;
        const diffY = this.touchEndY - this.touchStartY;
        
        // اطمینان از اینکه سوایپ افقی بوده نه عمودی
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < -swipeThreshold) {
                // سوایپ به چپ - اسلاید بعدی در RTL
                this.nextSlide();
            } else if (diffX > swipeThreshold) {
                // سوایپ به راست - اسلاید قبلی در RTL
                this.prevSlide();
            }
        }
    }
    
    /**
     * نمایش اسلاید با شماره مشخص
     * @param {Number} index شماره اسلاید
     * @param {Boolean} animate فعال‌سازی انیمیشن
     */
    showSlide(index, animate = true) {
        if ((this.isTransitioning && animate) || index === this.currentSlide) return;
        
        // بررسی محدوده شاخص
        if (index < 0 || index >= this.totalSlides) {
            return;
        }
        
        if (animate) {
            this.isTransitioning = true;
        }
        
        // تعیین جهت انیمیشن
        const direction = index > this.currentSlide ? 'next' : 'previous';
        
        // حذف کلاس‌های فعلی
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'previous', 'next');
        });
        
        // اضافه کردن کلاس جهت به اسلاید فعلی
        if (this.currentSlide !== index) {
            this.slides[this.currentSlide].classList.add(direction === 'next' ? 'previous' : 'next');
        }
        
        // فعال کردن اسلاید جدید
        this.slides[index].classList.add('active');
        
        // به‌روزرسانی نقاط پیمایش
        this.updatePagination(index);
        
        // به‌روزرسانی شمارنده
        this.currentSlide = index;
        this.updateCounter();
        
        // به‌روزرسانی نوار پیشرفت
        this.updateProgressBar();
        
        // بدون انیمیشن، اتمام انتقال را اعلام کنید
        if (!animate) {
            this.isTransitioning = false;
            this.dispatchSlideChangeEvent();
        }
    }
    
    /**
     * انتقال به اسلاید قبلی
     */
    prevSlide() {
        const newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(newIndex);
        this.resetAutoplay();
    }
    
    /**
     * انتقال به اسلاید بعدی
     */
    nextSlide() {
        const newIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(newIndex);
        this.resetAutoplay();
    }
    
    /**
     * انتقال به اسلاید مشخص
     * @param {Number} index شماره اسلاید
     */
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoplay();
    }
    
    /**
     * به‌روزرسانی نقاط پیمایش
     * @param {Number} activeIndex شماره اسلاید فعال
     */
    updatePagination(activeIndex) {
        this.pagination.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }
    
    /**
     * به‌روزرسانی شمارنده اسلاید
     */
    updateCounter() {
        if (this.currentCounter && this.totalCounter) {
            // تبدیل اعداد به فارسی
            const currentNumber = this.toPersianNumber(this.currentSlide + 1);
            const totalNumber = this.toPersianNumber(this.totalSlides);
            
            this.currentCounter.textContent = currentNumber;
            this.totalCounter.textContent = totalNumber;
        }
    }
    
    /**
     * به‌روزرسانی نوار پیشرفت
     */
    updateProgressBar() {
        if (this.progress) {
            const width = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progress.style.transform = `translateX(${-(100 - width)}%)`;
        }
    }
    
    /**
     * شروع پخش خودکار اسلایدها
     */
    startAutoplay() {
        this.pauseAutoplay(); // پاکسازی تایمر قبلی
        
        this.isPlaying = true;
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.interval);
        
        this.updatePausePlayButton();
    }
    
    /**
     * توقف پخش خودکار اسلایدها
     */
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    /**
     * تغییر وضعیت پخش خودکار
     */
    toggleAutoplay() {
        if (this.isPlaying) {
            this.pauseAutoplay();
            this.isPlaying = false;
        } else {
            this.startAutoplay();
            this.isPlaying = true;
        }
        
        this.updatePausePlayButton();
    }
    
    /**
     * بازنشانی تایمر پخش خودکار
     */
    resetAutoplay() {
        if (this.isPlaying) {
            this.pauseAutoplay();
            this.startAutoplay();
        }
    }
    
    /**
     * به‌روزرسانی دکمه پخش/توقف
     */
    updatePausePlayButton() {
        if (this.pausePlayButton) {
            const icon = this.pausePlayButton.querySelector('i');
            if (icon) {
                if (this.isPlaying) {
                    icon.className = 'fas fa-pause';
                } else {
                    icon.className = 'fas fa-play';
                }
            }
        }
    }
    
    /**
     * تبدیل اعداد انگلیسی به فارسی
     * @param {Number} num عدد انگلیسی
     * @returns {String} عدد فارسی
     */
    toPersianNumber(num) {
        return num.toString().replace(/\d/g, x => this.persianDigits[x]);
    }
    
    /**
     * ارسال رویداد تغییر اسلاید
     */
    dispatchSlideChangeEvent() {
        const event = new CustomEvent('slide-change', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides
            },
            bubbles: true
        });
        
        this.slider.dispatchEvent(event);
    }
    
    /**
     * تابع debounce برای بهینه‌سازی رویدادها
     * @param {Function} func تابع اصلی
     * @param {Number} wait زمان تاخیر (میلی‌ثانیه)
     * @returns {Function} تابع debounce شده
     */
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    /**
     * نابودسازی اسلایدر و پاکسازی حافظه
     */
    destroy() {
        // توقف پخش خودکار
        this.pauseAutoplay();
        
        // حذف رویدادهای اضافه شده
        document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
        
        // حذف رویدادهای transition
        this.slides.forEach(slide => {
            slide.removeEventListener('transitionend', this.boundHandleTransitionEnd);
        });
        
        // حذف کلاس‌های اضافه شده
        this.slider.classList.remove('slider-initialized');
        
        console.info('اسلایدر با موفقیت نابود شد.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای اسلایدر
    const slides = document.querySelectorAll('.slide');
    const previews = document.querySelectorAll('.preview-item');
    const progressFill = document.querySelector('.progress-fill');
    const currentSlideCounter = document.querySelector('.current-slide');
    const totalSlides = document.querySelector('.total-slides');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // تنظیمات اولیه
    let currentSlide = 0;
    const totalSlideCount = slides.length;
    let autoSlideInterval;
    const autoSlideDelay = 6000; // زمان تغییر خودکار اسلاید (6 ثانیه)
    let isTransitioning = false; // برای جلوگیری از کلیک سریع
    
    // نمایش شماره کل اسلایدها
    totalSlides.textContent = totalSlideCount.toString().padStart(2, '0');
    
    // تابع تغییر اسلاید
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // غیرفعال کردن اسلاید و پیش‌نمایش فعلی
        slides[currentSlide].classList.remove('active');
        previews[currentSlide].classList.remove('active');
        
        // تنظیم اسلاید جدید
        currentSlide = index;
        
        // اگر از محدوده خارج شد، تنظیم مقدار صحیح
        if (currentSlide < 0) currentSlide = totalSlideCount - 1;
        if (currentSlide >= totalSlideCount) currentSlide = 0;
        
        // فعال کردن اسلاید و پیش‌نمایش جدید
        slides[currentSlide].classList.add('active');
        previews[currentSlide].classList.add('active');
        
        // بروزرسانی شمارنده اسلاید
        currentSlideCounter.textContent = (currentSlide + 1).toString().padStart(2, '0');
        
        // بروزرسانی نوار پیشرفت
        const progressWidth = ((currentSlide + 1) / totalSlideCount) * 100;
        progressFill.style.width = `${progressWidth}%`;
        
        // تغییر رنگ پس‌زمینه اسلاید بر اساس رنگ تعریف شده
        const slideColor = slides[currentSlide].getAttribute('data-color');
        if (slideColor) {
            document.documentElement.style.setProperty('--primary-color', slideColor);
        }
        
        // اجازه تغییر اسلاید مجدد بعد از مدت زمان انیمیشن
        setTimeout(() => {
            isTransitioning = false;
        }, 900); // زمان انیمیشن
    }
    
    // تابع رفتن به اسلاید بعدی
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // تابع رفتن به اسلاید قبلی
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // رویدادهای کلیک دکمه‌های قبلی و بعدی
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        nextSlide();
        startAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        prevSlide();
        startAutoSlide();
    });
    
    // رویداد کلیک برای پیش‌نمایش‌ها
    previews.forEach((preview, index) => {
        preview.addEventListener('click', () => {
            if (currentSlide !== index) {
                clearInterval(autoSlideInterval);
                goToSlide(index);
                startAutoSlide();
            }
        });
    });
    
    // ایجاد قابلیت اسلاید با کلیدهای جهت‌دار
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            clearInterval(autoSlideInterval);
            prevSlide(); // جهت راست به چپ (RTL)
            startAutoSlide();
        } else if (e.key === 'ArrowLeft') {
            clearInterval(autoSlideInterval);
            nextSlide(); // جهت چپ به راست (RTL)
            startAutoSlide();
        }
    });
    
    // اضافه کردن قابلیت لمسی برای دستگاه‌های موبایل
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slider = document.querySelector('.premium-slider');
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const SWIPE_THRESHOLD = 75;
        
        // سوایپ به چپ (اسلاید بعدی در RTL)
        if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
            clearInterval(autoSlideInterval);
            nextSlide();
            startAutoSlide();
        }
        
        // سوایپ به راست (اسلاید قبلی در RTL)
        if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
            clearInterval(autoSlideInterval);
            prevSlide();
            startAutoSlide();
        }
    }
    
    // افکت هاور روی تصویر محصول
    slides.forEach(slide => {
        const productImage = slide.querySelector('.slide-image img');
        
        slide.addEventListener('mousemove', (e) => {
            const slideRect = slide.getBoundingClientRect();
            const offsetX = e.clientX - slideRect.left - slideRect.width / 2;
            const offsetY = e.clientY - slideRect.top - slideRect.height / 2;
            
            const rotateY = offsetX * 0.01;
            const rotateX = -offsetY * 0.01;
            
            productImage.style.transform = `rotateY(${5 + rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        slide.addEventListener('mouseleave', () => {
            productImage.style.transform = 'rotateY(10deg) rotateX(5deg)';
        });
    });
    
    // تابع شروع اسلاید خودکار
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }
    
    // توقف اسلاید خودکار هنگام هاور روی اسلایدر
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // انیمیشن متن با اسکرول صفحه
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slider = entry.target;
                slider.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    observer.observe(slider);
    
    // شروع اسلایدر
    goToSlide(0);
    startAutoSlide();
    
    // اضافه کردن افکت‌های تصادفی پارتیکل
    function createParticles() {
        const particleCount = 20;
        const colors = ['#ffffff', '#f3f4f6', '#e5e7eb'];
        const sliderContainer = document.querySelector('.slides-container');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            particle.style.setProperty('--size', `${Math.random() * 5 + 1}px`);
            particle.style.setProperty('--left', `${Math.random() * 100}%`);
            particle.style.setProperty('--top', `${Math.random() * 100}%`);
            particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`);
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--opacity', `${Math.random() * 0.5 + 0.1}`);
            particle.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
            
            sliderContainer.appendChild(particle);
        }
    }
    
    createParticles();
});
document.addEventListener('DOMContentLoaded', function() {
    // ----- منوی موبایل -----
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // ----- منوی کشویی در موبایل -----
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    function setupMobileDropdowns() {
        if (window.innerWidth <= 768) {
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                const dropdownIcon = item.querySelector('.dropdown-icon');
                const submenu = item.querySelector('.dropdown-menu');
                
                // حذف رویدادهای قبلی
                link.removeEventListener('click', handleDropdownClick);
                
                // اضافه کردن رویداد جدید
                link.addEventListener('click', handleDropdownClick);
                
                function handleDropdownClick(e) {
                    e.preventDefault();
                    submenu.classList.toggle('active');
                    dropdownIcon.style.transform = submenu.classList.contains('active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0)';
                }
            });
        } else {
            // حذف رویدادهای کلیک در حالت دسکتاپ
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                link.removeEventListener('click', handleDropdownClick);
                
                function handleDropdownClick(e) {
                    // این تابع در حالت دسکتاپ هیچ کاری انجام نمی‌دهد
                }
            });
        }
    }
    
    // اجرای اولیه و هنگام تغییر سایز صفحه
    setupMobileDropdowns();
    window.addEventListener('resize', setupMobileDropdowns);
    
    // ----- اسلایدر بنر اصلی -----
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.banner-prev');
    const nextBtn = document.querySelector('.banner-next');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        // مخفی کردن همه اسلایدها
        bannerSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // مخفی کردن همه دات‌ها
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // نمایش اسلاید فعلی
        bannerSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % bannerSlides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
        showSlide(currentSlide);
    }
    
    // رویدادهای دکمه‌های اسلایدر
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
        
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
    }
    
    // رویدادهای دات‌های اسلایدر
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
                resetInterval();
            });
        });
    }
    
    // شروع اسلایدر خودکار
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // ریست کردن زمان اسلایدر بعد از کلیک کاربر
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // فقط اگر اسلایدر وجود داشت، شروع به کار کند
    if (bannerSlides.length > 0) {
        startInterval();
    }
    
    // ----- جستجوی محصول -----
    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input').value.trim();
            
            if (searchInput.length > 0) {
                // مسیر صفحه جستجو را تنظیم کنید
                window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
            }
        });
    }
    
    // ----- چسباندن هدر هنگام اسکرول -----
    const mainNav = document.querySelector('.main-nav');
    const headerHeight = mainNav ? mainNav.offsetTop : 0;
    
    function stickyHeader() {
        if (window.pageYOffset > headerHeight) {
            mainNav.classList.add('sticky');
            document.body.style.paddingTop = mainNav.offsetHeight + 'px';
        } else {
            mainNav.classList.remove('sticky');
            document.body.style.paddingTop = 0;
        }
    }
    
    if (mainNav) {
        window.addEventListener('scroll', stickyHeader);
    }
    
    // ----- لودینگ تصاویر با تاخیر (Lazy Loading) -----
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
    
    // ----- انیمیشن نوار اطلاع رسانی -----
    const announceBar = document.querySelector('.announcement-slider');
    
    if (announceBar) {
        // تکرار آیتم‌های اعلان برای ایجاد اسکرول بی‌نهایت
        const items = document.querySelectorAll('.announcement-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            announceBar.appendChild(clone);
        });
    }
    
    // ----- کد انتخاب تصادفی محصولات پیشنهادی -----
    const specialButton = document.querySelector('.special-button');
    
    if (specialButton) {
        specialButton.addEventListener('click', function(e) {
            // نمایش لودینگ کوتاه برای بهبود UX
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>لطفا صبر کنید...</span>';
            
            // شبیه‌سازی تاخیر برای نشان دادن لودینگ
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-bolt"></i><span>پیشنهاد شگفت‌انگیز</span>';
            }, 500);
        });
    }
});

// ----- دکمه بازگشت به بالا -----
window.addEventListener('scroll', function() {
    // اضافه کردن دکمه بازگشت به بالا در صورت اسکرول بیشتر از 300 پیکسل
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        // اگر دکمه موجود نیست، آن را ایجاد کنید
        if (!document.querySelector('.back-to-top')) {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.classList.add('back-to-top');
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(backToTopBtn);
            
            // نمایش با انیمیشن
            setTimeout(() => {
                backToTopBtn.classList.add('show');
            }, 10);
        }
    } else {
        // حذف دکمه در صورت اسکرول به بالا
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.classList.remove('show');
            
            // حذف المان بعد از انیمیشن
            setTimeout(() => {
                if (backToTopBtn.parentNode) {
                    backToTopBtn.parentNode.removeChild(backToTopBtn);
                }
            }, 300);
        }
    }
});