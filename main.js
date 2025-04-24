window.onload = function() {
    if (!sessionStorage.getItem('visited')) {
        alert('کاربر عزیز به وبسایت فروشگاهی امیری خوش آمدید');
        sessionStorage.setItem('visited', 'true');
    }
}

  /**
* فایل جاوااسکریپت برای هدر فروشگاه کفش امیری
* این فایل عملکردهای هدر شامل منوی موبایل، اسلایدر و ... را مدیریت می‌کند
*/

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




document.addEventListener('DOMContentLoaded', function() {
// فیلتر کردن نظرات
const filterButtons = document.querySelectorAll('.filter-btn');
const reviewCards = document.querySelectorAll('.review-card');

filterButtons.forEach(button => {
button.addEventListener('click', function() {
// فعال‌سازی دکمه فیلتر
filterButtons.forEach(btn => btn.classList.remove('active'));
this.classList.add('active');

const filter = this.getAttribute('data-filter');

// اعمال فیلتر روی نظرات
reviewCards.forEach(card => {
if (filter === 'all') {
  card.style.display = 'block';
} else if (filter === 'verified') {
  card.style.display = card.getAttribute('data-verified') === 'true' ? 'block' : 'none';
} else if (filter === 'positive') {
  card.style.display = parseInt(card.getAttribute('data-rating')) >= 4 ? 'block' : 'none';
} else if (filter === 'negative') {
  card.style.display = parseInt(card.getAttribute('data-rating')) < 4 ? 'block' : 'none';
} else if (filter === 'with-photo') {
  card.style.display = card.getAttribute('data-has-photo') === 'true' ? 'block' : 'none';
}
});

// نمایش پیام اگر هیچ نظری با فیلتر مطابقت نداشت
const visibleCards = Array.from(reviewCards).filter(card => card.style.display !== 'none');
const noResultsMessage = document.querySelector('.no-results-message') || createNoResultsMessage();

if (visibleCards.length === 0) {
document.querySelector('.reviews-container').appendChild(noResultsMessage);
noResultsMessage.style.display = 'block';
} else {
noResultsMessage.style.display = 'none';
}
});
});

// ایجاد پیام برای زمانی که نظری یافت نشد
function createNoResultsMessage() {
const message = document.createElement('div');
message.className = 'no-results-message';
message.innerHTML = `
<div class="empty-state">
<i class="fas fa-search"></i>
<h3>نظری یافت نشد</h3>
<p>با فیلتر انتخاب شده هیچ نظری مطابقت ندارد.</p>
<button class="reset-filter-btn">نمایش همه نظرات</button>
</div>
`;

message.querySelector('.reset-filter-btn').addEventListener('click', function() {
document.querySelector('.filter-btn[data-filter="all"]').click();
});

return message;
}

// مرتب‌سازی نظرات
const sortSelect = document.getElementById('review-sort');
if (sortSelect) {
sortSelect.addEventListener('change', function() {
const sortValue = this.value;
const reviewsContainer = document.querySelector('.reviews-container');
const reviews = Array.from(reviewCards);

// مرتب‌سازی نظرات
reviews.sort((a, b) => {
if (sortValue === 'newest') {
  // بر اساس تاریخ (فرض می‌کنیم جدیدترین‌ها در بالای لیست فعلی هستند)
  return -1;
} else if (sortValue === 'oldest') {
  // بر اساس تاریخ (فرض می‌کنیم قدیمی‌ترین‌ها در پایین لیست فعلی هستند)
  return 1;
} else if (sortValue === 'highest') {
  // بر اساس امتیاز (نزولی)
  return parseInt(b.getAttribute('data-rating')) - parseInt(a.getAttribute('data-rating'));
} else if (sortValue === 'lowest') {
  // بر اساس امتیاز (صعودی)
  return parseInt(a.getAttribute('data-rating')) - parseInt(b.getAttribute('data-rating'));
} else if (sortValue === 'helpful') {
  // بر اساس تعداد لایک‌ها
  const likesA = parseInt(a.querySelector('.likes-count').textContent);
  const likesB = parseInt(b.querySelector('.likes-count').textContent);
  return likesB - likesA;
}
return 0;
});

// بازسازی لیست نظرات
reviews.forEach(review => {
reviewsContainer.appendChild(review);
});
});
}

// دکمه‌های اکشن (لایک، پاسخ، اشتراک‌گذاری)
const likeButtons = document.querySelectorAll('.like-btn');
likeButtons.forEach(button => {
button.addEventListener('click', function() {
const likesCountElement = this.querySelector('.likes-count');
let likesCount = parseInt(likesCountElement.textContent);

if (this.classList.contains('active')) {
this.classList.remove('active');
likesCount--;
} else {
this.classList.add('active');
likesCount++;
}

likesCountElement.textContent = likesCount;

// در حالت واقعی، اینجا یک درخواست AJAX به سرور ارسال می‌شود
// saveReviewLike(reviewId, isLiked);
});
});

// باز و بسته کردن فرم پاسخ
const replyButtons = document.querySelectorAll('.reply-btn');
replyButtons.forEach(button => {
button.addEventListener('click', function() {
const reviewCard = this.closest('.review-card, .review-reply');
const replyForm = reviewCard.querySelector('.reply-form');

if (!replyForm) {
// ایجاد فرم پاسخ اگر وجود ندارد
const newReplyForm = document.createElement('div');
newReplyForm.className = 'reply-form';
newReplyForm.innerHTML = `
  <textarea placeholder="پاسخ خود را بنویسید..."></textarea>
  <div class="form-actions">
    <button class="cancel-reply">انصراف</button>
    <button class="submit-reply">ارسال پاسخ</button>
  </div>
`;

reviewCard.appendChild(newReplyForm);

// اضافه کردن رویدادها به دکمه‌های جدید
newReplyForm.querySelector('.cancel-reply').addEventListener('click', function() {
  newReplyForm.classList.add('hide');
});

newReplyForm.querySelector('.submit-reply').addEventListener('click', function() {
  const replyText = newReplyForm.querySelector('textarea').value.trim();
  if (replyText) {
    submitReply(reviewCard, replyText);
    newReplyForm.classList.add('hide');
  }
});
} else {
// نمایش/مخفی‌سازی فرم موجود
replyForm.classList.toggle('hide');
}
});
});

// ارسال پاسخ
function submitReply(reviewCard, replyText) {
// ایجاد پاسخ جدید
const newReply = document.createElement('div');
newReply.className = 'review-reply';
newReply.innerHTML = `
<div class="reply-header">
<div class="reply-author">
  <div class="author-avatar">
    <i class="fas fa-user"></i>
  </div>
  <div class="author-info">
    <div class="author-name">شما</div>
    <div class="reply-date">همین الان</div>
  </div>
</div>
</div>
<div class="reply-content">
<p>${replyText}</p>
</div>
<div class="reply-actions">
<button class="like-btn"><i class="far fa-thumbs-up"></i> مفید (<span class="likes-count">0</span>)</button>
<button class="reply-btn"><i class="far fa-comment"></i> پاسخ</button>
</div>
`;

// اضافه کردن به لیست نظرات
reviewCard.after(newReply);

// اضافه کردن رویدادها به دکمه‌های پاسخ جدید
const newLikeBtn = newReply.querySelector('.like-btn');
newLikeBtn.addEventListener('click', function() {
const likesCountElement = this.querySelector('.likes-count');
let likesCount = parseInt(likesCountElement.textContent);

if (this.classList.contains('active')) {
this.classList.remove('active');
likesCount--;
} else {
this.classList.add('active');
likesCount++;
}

likesCountElement.textContent = likesCount;
});

newReply.querySelector('.reply-btn').addEventListener('click', function() {
const replyForm = newReply.querySelector('.reply-form');

if (!replyForm) {
const newReplyForm = document.createElement('div');
newReplyForm.className = 'reply-form';
newReplyForm.innerHTML = `
  <textarea placeholder="پاسخ خود را بنویسید..."></textarea>
  <div class="form-actions">
    <button class="cancel-reply">انصراف</button>
    <button class="submit-reply">ارسال پاسخ</button>
  </div>
`;

newReply.appendChild(newReplyForm);

newReplyForm.querySelector('.cancel-reply').addEventListener('click', function() {
  newReplyForm.classList.add('hide');
});

newReplyForm.querySelector('.submit-reply').addEventListener('click', function() {
  const replyText = newReplyForm.querySelector('textarea').value.trim();
  if (replyText) {
    submitReply(newReply, replyText);
    newReplyForm.classList.add('hide');
  }
});
} else {
replyForm.classList.toggle('hide');
}
});

// در حالت واقعی، اینجا یک درخواست AJAX به سرور ارسال می‌شود
// saveReviewReply(reviewId, replyText);
}

// اشتراک‌گذاری نظر
const shareButtons = document.querySelectorAll('.share-btn');
shareButtons.forEach(button => {
button.addEventListener('click', function() {
const reviewCard = this.closest('.review-card');
const reviewTitle = reviewCard.querySelector('.review-title').textContent;

// در حالت واقعی، مدال اشتراک‌گذاری نمایش داده می‌شود
if (navigator.share) {
navigator.share({
  title: 'نظر کاربر درباره محصول',
  text: reviewTitle,
  url: window.location.href
})
.catch(err => {
  alert('امکان اشتراک‌گذاری وجود ندارد.');
});
} else {
// پیاده‌سازی ساده برای مرورگرهایی که Web Share API را پشتیبانی نمی‌کنند
prompt('لینک نظر را کپی کنید:', window.location.href);
}
});
});

// گزارش نظر
const reportButtons = document.querySelectorAll('.report-btn');
reportButtons.forEach(button => {
button.addEventListener('click', function() {
const reviewCard = this.closest('.review-card');

// نمایش پنجره گزارش
if (confirm('آیا می‌خواهید این نظر را گزارش کنید؟')) {
// در حالت واقعی، یک مدال با گزینه‌های مختلف نمایش داده می‌شود
alert('نظر با موفقیت گزارش شد و توسط تیم پشتیبانی بررسی خواهد شد.');
}
});
});

// امتیازدهی با ایموجی
const emojiOptions = document.querySelectorAll('.emoji-option');
emojiOptions.forEach(option => {
option.addEventListener('click', function() {
// حذف کلاس انتخاب شده از همه گزینه‌ها
emojiOptions.forEach(opt => opt.classList.remove('selected'));

// اضافه کردن کلاس به گزینه انتخاب شده
this.classList.add('selected');

// دریافت امتیاز
const rating = parseInt(this.getAttribute('data-rating'));

// انتخاب خودکار ستاره‌ها در فرم
const attributeRatings = document.querySelectorAll('.star-rating-select');
attributeRatings.forEach(ratingSelect => {
const stars = ratingSelect.querySelectorAll('i');
stars.forEach((star, index) => {
  if (index < rating) {
    star.classList.remove('far');
    star.classList.add('fas');
  } else {
    star.classList.remove('fas');
    star.classList.add('far');
  }
});
});
});
});

// انتخاب ستاره‌ها برای ویژگی‌های محصول
const starRatingSelects = document.querySelectorAll('.star-rating-select');
starRatingSelects.forEach(ratingSelect => {
const stars = ratingSelect.querySelectorAll('i');

stars.forEach((star, index) => {
star.addEventListener('click', function() {
// ریست ستاره‌ها
stars.forEach(s => {
  s.classList.remove('fas');
  s.classList.add('far');
});

// اضافه کردن ستاره‌های پر تا ستاره انتخاب شده
for (let i = 0; i <= index; i++) {
  stars[i].classList.remove('far');
  stars[i].classList.add('fas');
}
});
});
});

// شمارنده کاراکترها
const reviewTextarea = document.getElementById('review-text');
const charCount = document.getElementById('char-count');

if (reviewTextarea && charCount) {
reviewTextarea.addEventListener('input', function() {
const count = this.value.length;
charCount.textContent = count;

// هشدار برای متن طولانی
if (count > 900) {
charCount.style.color = '#ff5b5b';
} else {
charCount.style.color = '#777';
}

// پیشنهاد هوشمند با تحلیل متن
analyzeReviewText(this.value);
});
}

// تحلیل متن نظر و ارائه پیشنهاد هوشمند
function analyzeReviewText(text) {
const aiTip = document.querySelector('.ai-suggestion p:last-child');

if (!aiTip || text.length < 20) return;

// شبیه‌سازی تحلیل هوشمند متن
const hasComfortInfo = /راحت|راحتی|پا|فیت/.test(text);
const hasQualityInfo = /کیفیت|دوام|جنس|ساخت/.test(text);
const hasSizeInfo = /سایز|اندازه|کوچک|بزرگ/.test(text);
const hasPriceInfo = /قیمت|ارزش|گران|ارزان/.test(text);

// پیشنهاد براساس اطلاعاتی که کاربر هنوز ارائه نکرده
if (!hasComfortInfo && !hasQualityInfo) {
aiTip.textContent = 'پیشنهاد می‌شود درباره راحتی کفش و کیفیت ساخت آن بنویسید.';
} else if (!hasSizeInfo) {
aiTip.textContent = 'آیا سایز کفش مناسب بود؟ این اطلاعات به سایر خریداران کمک می‌کند.';
} else if (!hasPriceInfo) {
aiTip.textContent = 'نظر شما درباره ارزش خرید این محصول به دیگران کمک می‌کند.';
} else {
aiTip.textContent = 'نظر جامعی نوشته‌اید! می‌توانید تجربه خود از استفاده روزانه را نیز اضافه کنید.';
}
}

// آپلود تصاویر
const imageInput = document.getElementById('review-images');
const imagePreviewContainer = document.getElementById('image-preview-container');

if (imageInput && imagePreviewContainer) {
imageInput.addEventListener('change', function() {
// پاک کردن پیش‌نمایش‌های قبلی
imagePreviewContainer.innerHTML = '';

const files = this.files;
if (files.length > 5) {
alert('حداکثر ۵ تصویر می‌توانید آپلود کنید.');
this.value = '';
return;
}

for (let i = 0; i < files.length; i++) {
const file = files[i];

// بررسی نوع فایل و اندازه
if (!file.type.startsWith('image/')) {
  alert('لطفاً فقط تصویر آپلود کنید.');
  this.value = '';
  return;
}

if (file.size > 2 * 1024 * 1024) {
  alert('حجم هر تصویر نباید بیشتر از ۲ مگابایت باشد.');
  this.value = '';
  return;
}

// ایجاد پیش‌نمایش
const reader = new FileReader();
reader.onload = function(e) {
  const preview = document.createElement('div');
  preview.className = 'image-preview';
  preview.innerHTML = `
    <img src="${e.target.result}" alt="تصویر آپلود شده">
    <span class="remove-image"><i class="fas fa-times"></i></span>
  `;
  
  // حذف تصویر با کلیک روی دکمه
  preview.querySelector('.remove-image').addEventListener('click', function() {
    preview.remove();
    // به‌روزرسانی فایل‌های انتخاب شده (در حالت واقعی پیچیده‌تر است)
    if (imagePreviewContainer.querySelectorAll('.image-preview').length === 0) {
      imageInput.value = '';
    }
  });
  
  imagePreviewContainer.appendChild(preview);
};

reader.readAsDataURL(file);
}
});
}

// انتخاب و حذف تگ‌ها
const tagChips = document.querySelectorAll('.tag-chip');
const selectedTagsContainer = document.getElementById('selected-tags');

if (tagChips && selectedTagsContainer) {
tagChips.forEach(chip => {
chip.addEventListener('click', function() {
const tagText = this.getAttribute('data-tag');

// بررسی تکراری نبودن تگ
const existingTags = selectedTagsContainer.querySelectorAll('.selected-tag');
for (let i = 0; i < existingTags.length; i++) {
  if (existingTags[i].getAttribute('data-tag') === tagText) {
    return; // تگ تکراری است
  }
}

// ایجاد تگ انتخاب شده
const selectedTag = document.createElement('div');
selectedTag.className = 'selected-tag';
selectedTag.setAttribute('data-tag', tagText);
selectedTag.innerHTML = `
  ${tagText}
  <span class="remove-tag"><i class="fas fa-times"></i></span>
`;

// حذف تگ با کلیک روی دکمه
selectedTag.querySelector('.remove-tag').addEventListener('click', function() {
  selectedTag.remove();
});

selectedTagsContainer.appendChild(selectedTag);
});
});
}

// پیش‌نمایش نظر
const previewButton = document.querySelector('.preview-review-btn');
const previewModal = document.getElementById('preview-modal');
const previewContent = document.querySelector('.preview-review-card');

if (previewButton && previewModal && previewContent) {
previewButton.addEventListener('click', function() {
// دریافت مقادیر فرم
const reviewerName = document.getElementById('reviewer-name').value || 'بدون نام';
const reviewTitle = document.getElementById('review-title').value || 'بدون عنوان';
const reviewText = document.getElementById('review-text').value || 'بدون متن';

// ایجاد پیش‌نمایش
previewContent.innerHTML = `
<div class="review-author">
  <div class="author-avatar">
    <i class="fas fa-user"></i>
  </div>
  <div class="author-info">
    <div class="author-name">${reviewerName}</div>
    <div class="review-date">همین الان</div>
  </div>
  <div class="review-rating">
    <div class="star-rating">
      ${getSelectedRatingStars('quality')}
    </div>
  </div>
</div>

<div class="review-content">
  <h4 class="review-title">${reviewTitle}</h4>
  <div class="review-text">
    <p>${reviewText}</p>
  </div>
  
  <div class="review-attributes">
    ${getReviewAttributesHTML()}
  </div>
  
  <div class="review-photos">
    ${getUploadedImagesHTML()}
  </div>
  
  <div class="selected-tags-preview">
    ${getSelectedTagsHTML()}
  </div>
</div>
`;

// نمایش مدال
previewModal.classList.add('active');
});

// بستن مدال
const closeModalBtn = document.querySelector('.close-modal');
if (closeModalBtn) {
closeModalBtn.addEventListener('click', function() {
previewModal.classList.remove('active');
});
}

// کلیک بیرون از مدال
previewModal.addEventListener('click', function(e) {
if (e.target === previewModal) {
previewModal.classList.remove('active');
}
});

// دکمه ویرایش در مدال
const editButton = document.querySelector('.edit-review-btn');
if (editButton) {
editButton.addEventListener('click', function() {
previewModal.classList.remove('active');
});
}

// دکمه تایید و ارسال
const confirmButton = document.querySelector('.confirm-review-btn');
if (confirmButton) {
confirmButton.addEventListener('click', function() {
// در حالت واقعی، اینجا فرم ارسال می‌شود
document.getElementById('review-form').submit();
});
}
}

// دریافت ستاره‌های انتخاب شده برای یک ویژگی
function getSelectedRatingStars(attribute) {
const ratingSelect = document.querySelector(`.star-rating-select[data-attribute="${attribute}"]`);
if (!ratingSelect) return '';

const selectedStars = ratingSelect.querySelectorAll('.fas').length;
let starsHTML = '';

for (let i = 0; i < 5; i++) {
if (i < selectedStars) {
starsHTML += '<i class="fas fa-star"></i>';
} else {
starsHTML += '<i class="far fa-star"></i>';
}
}

return starsHTML;
}

// دریافت HTML ویژگی‌های امتیازدهی شده
function getReviewAttributesHTML() {
const attributeNames = ['comfort', 'quality', 'value'];
const attributeLabels = {
'comfort': 'راحتی',
'quality': 'کیفیت',
'value': 'ارزش خرید'
};

let attributesHTML = '';

attributeNames.forEach(attr => {
const ratingSelect = document.querySelector(`.star-rating-select[data-attribute="${attr}"]`);
if (!ratingSelect) return;

const selectedStars = ratingSelect.querySelectorAll('.fas').length;
if (selectedStars === 0) return;

let starsHTML = '';
for (let i = 0; i < 5; i++) {
if (i < selectedStars) {
  starsHTML += '<i class="fas fa-circle"></i>';
} else {
  starsHTML += '<i class="far fa-circle"></i>';
}
}

attributesHTML += `
<div class="attribute-item">
  <span class="attribute-name">${attributeLabels[attr]}:</span>
  <div class="attribute-rating">
    ${starsHTML}
  </div>
</div>
`;
});

return attributesHTML;
}

// دریافت HTML تصاویر آپلود شده
function getUploadedImagesHTML() {
const previews = document.querySelectorAll('.image-preview img');
let imagesHTML = '';

previews.forEach(img => {
imagesHTML += `<img src="${img.src}" alt="تصویر نظر کاربر" class="review-photo">`;
});

return imagesHTML;
}

// دریافت HTML تگ‌های انتخاب شده
function getSelectedTagsHTML() {
const selectedTags = document.querySelectorAll('.selected-tag');
let tagsHTML = '';

if (selectedTags.length === 0) return '';

tagsHTML = '<div class="review-tags-list">';
selectedTags.forEach(tag => {
tagsHTML += `<span class="attribute-tag positive">${tag.getAttribute('data-tag')}</span>`;
});
tagsHTML += '</div>';

return tagsHTML;
}

// ارسال فرم نظر
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
reviewForm.addEventListener('submit', function(e) {
e.preventDefault();

// بررسی فیلدهای اجباری
const requiredFields = [
'reviewer-name', 
'reviewer-email',
'review-title',
'review-text'
];

let isValid = true;

requiredFields.forEach(field => {
const input = document.getElementById(field);
if (!input || !input.value.trim()) {
  isValid = false;
  if (input) {
    input.classList.add('invalid');
    setTimeout(() => input.classList.remove('invalid'), 3000);
  }
}
});

// بررسی توافق‌نامه
const agreement = document.getElementById('review-agreement');
if (!agreement || !agreement.checked) {
isValid = false;
alert('لطفاً با قوانین نظردهی موافقت کنید.');
return;
}

if (!isValid) {
alert('لطفاً تمام فیلدهای اجباری را تکمیل کنید.');
return;
}

// ارسال فرم (شبیه‌سازی)
alert('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.');

// در حالت واقعی، اینجا یک درخواست AJAX به سرور ارسال می‌شود
// و پس از موفقیت، فرم ریست می‌شود
this.reset();

// پاک کردن پیش‌نمایش تصاویر
if (imagePreviewContainer) {
imagePreviewContainer.innerHTML = '';
}

// پاک کردن تگ‌های انتخاب شده
if (selectedTagsContainer) {
selectedTagsContainer.innerHTML = '';
}

// ریست کردن ستاره‌ها
starRatingSelects.forEach(ratingSelect => {
const stars = ratingSelect.querySelectorAll('i');
stars.forEach(star => {
  star.classList.remove('fas');
  star.classList.add('far');
});
});

// ریست کردن ایموجی‌ها
emojiOptions.forEach(option => {
option.classList.remove('selected');
});
});
}

// بزرگنمایی تصاویر با کلیک
document.addEventListener('click', function(e) {
if (e.target.classList.contains('review-photo')) {
const imgSrc = e.target.src;

// ایجاد مدال تصویر
const imgModal = document.createElement('div');
imgModal.className = 'image-zoom-modal';
imgModal.innerHTML = `
<div class="zoom-modal-content">
  <button class="close-zoom"><i class="fas fa-times"></i></button>
  <img src="${imgSrc}" alt="تصویر بزرگنمایی شده">
</div>
`;

document.body.appendChild(imgModal);

// نمایش مدال با انیمیشن
setTimeout(() => {
imgModal.classList.add('active');
}, 10);

// بستن مدال با کلیک روی دکمه بستن
imgModal.querySelector('.close-zoom').addEventListener('click', function() {
imgModal.classList.remove('active');
setTimeout(() => {
  imgModal.remove();
}, 300);
});

// بستن مدال با کلیک بیرون از تصویر
imgModal.addEventListener('click', function(e) {
if (e.target === imgModal) {
  imgModal.classList.remove('active');
  setTimeout(() => {
    imgModal.remove();
  }, 300);
}
});
}
});
});





/**
* مقایسه محصولات - اسکریپت کامل
* 
* این فایل شامل تمام عملکردهای مورد نیاز برای سیستم مقایسه محصولات است
* امکانات: جستجوی محصولات، افزودن به مقایسه، نمایش تفاوت‌ها، چاپ و اشتراک‌گذاری
*/

document.addEventListener('DOMContentLoaded', function() {
// ==================== داده‌های محصول ====================
// در محیط واقعی این داده‌ها از API سرور دریافت می‌شوند
const productsData = {
'nike-air-1': {
    id: 'nike-air-1',
    title: 'نایک ایرفورس 1',
    brand: 'Nike',
    image: 'images/products/نایک1.jpg',
    price: '2,500,000',
    type: 'کفش اسپرت روزمره',
    upperMaterial: 'چرم طبیعی',
    soleMaterial: 'لاستیک فشرده',
    technology: 'Air',
    weight: '330 گرم',
    sizes: '38 تا 45',
    usage: 'استفاده روزمره، استایل خیابانی',
    colors: [
        { name: 'سفید', code: '#FFFFFF' },
        { name: 'مشکی', code: '#000000' },
        { name: 'قرمز', code: '#FF0000' },
        { name: 'آبی', code: '#0000FF' }
    ],
    rating: { score: 4.7, count: 35 },
    warranty: 'گارانتی اصالت و سلامت فیزیکی کالا',
    url: 'product/نایک-ایرفورس-1.html'
},
'adidas-ultra-1': {
    id: 'adidas-ultra-1',
    title: 'آدیداس اولترابوست',
    brand: 'Adidas',
    image: 'images/products/آدیداس1.jpg',
    price: '2,700,000',
    type: 'کفش ورزشی دویدن',
    upperMaterial: 'پارچه فناوری Primeknit',
    soleMaterial: 'زیره Boost',
    technology: 'Boost',
    weight: '320 گرم',
    sizes: '39 تا 45',
    usage: 'دویدن، ورزش روزانه',
    colors: [
        { name: 'خاکستری', code: '#888888' },
        { name: 'مشکی', code: '#000000' },
        { name: 'سفید', code: '#FFFFFF' },
        { name: 'آبی', code: '#0000FF' }
    ],
    rating: { score: 4.8, count: 23 },
    warranty: '7 روز بازگشت',
    url: 'product/آدیداس-اولترابوست.html'
},
'puma-rsx-1': {
    id: 'puma-rsx-1',
    title: 'پوما RS-X',
    brand: 'Puma',
    image: 'images/products/پوما1.jpg',
    price: '2,400,000',
    type: 'کفش اسپرت',
    upperMaterial: 'چرم مصنوعی و مش',
    soleMaterial: 'لاستیک',
    technology: 'Running System (RS)',
    weight: '350 گرم',
    sizes: '40 تا 45',
    usage: 'استفاده روزمره، پیاده‌روی',
    colors: [
        { name: 'سفید', code: '#FFFFFF' },
        { name: 'مشکی', code: '#000000' },
        { name: 'نارنجی', code: '#FFA500' }
    ],
    rating: { score: 4.5, count: 18 },
    warranty: '7 روز بازگشت',
    url: 'product/پوما-rsx.html'
},
'asics-gel-1': {
    id: 'asics-gel-1',
    title: 'اسیکس ژل-کایانو',
    brand: 'Asics',
    image: 'images/products/اسیکس4.jpg',
    price: '2,850,000',
    type: 'کفش دویدن',
    upperMaterial: 'مش مهندسی شده',
    soleMaterial: 'زیره میانی فوم با فناوری ژل',
    technology: 'GEL, FLYTEFOAM',
    weight: '310 گرم',
    sizes: '39 تا 46',
    usage: 'دویدن حرفه‌ای، ماراتن',
    colors: [
        { name: 'آبی', code: '#0000FF' },
        { name: 'خاکستری', code: '#888888' },
        { name: 'مشکی', code: '#000000' }
    ],
    rating: { score: 4.9, count: 27 },
    warranty: 'گارانتی 3 ماهه',
    url: 'product/اسیکس-ژل.html'
},
'brooks-ghost-1': {
    id: 'brooks-ghost-1',
    title: 'بروکس گوست 14',
    brand: 'Brooks',
    image: 'images/products/بروکس5.jpg',
    price: '2,500,000',
    type: 'کفش دویدن',
    upperMaterial: 'مش 3D Fit Print',
    soleMaterial: 'DNA LOFT',
    technology: 'DNA LOFT, BioMoGo',
    weight: '280 گرم',
    sizes: '38 تا 47',
    usage: 'دویدن طولانی‌مدت، مسابقات',
    colors: [
        { name: 'آبی', code: '#0000FF' },
        { name: 'مشکی', code: '#000000' },
        { name: 'قرمز', code: '#FF0000' }
    ],
    rating: { score: 4.8, count: 21 },
    warranty: 'گارانتی اصالت و 10 روز تعویض',
    url: 'product/بروکس-گوست.html'
},
'mizuno-wave-1': {
    id: 'mizuno-wave-1',
    title: 'میزانو ویو',
    brand: 'Mizuno',
    image: 'images/products/میزانو1.jpg',
    price: '2,600,000',
    type: 'کفش دویدن',
    upperMaterial: 'مش و الیاف مصنوعی',
    soleMaterial: 'تکنولوژی Wave Plate',
    technology: 'Wave Plate, U4ic',
    weight: '295 گرم',
    sizes: '40 تا 45',
    usage: 'دویدن، ورزش‌های روزانه',
    colors: [
        { name: 'نقره‌ای', code: '#C0C0C0' },
        { name: 'آبی', code: '#0000FF' },
        { name: 'مشکی', code: '#000000' }
    ],
    rating: { score: 4.6, count: 14 },
    warranty: 'گارانتی اصالت',
    url: 'product/میزانو-ویو.html'
},
'saucony-ride': {
    id: 'saucony-ride',
    title: 'ساکنی راید',
    brand: 'Saucony',
    image: 'images/products/ساکنی3.jpg',
    price: '2,450,000',
    type: 'کفش دویدن',
    upperMaterial: 'مش FORMFIT',
    soleMaterial: 'PWRRUN',
    technology: 'FORMFIT, PWRRUN',
    weight: '290 گرم',
    sizes: '39 تا 46',
    usage: 'دویدن، تمرینات روزانه',
    colors: [
        { name: 'قرمز', code: '#FF0000' },
        { name: 'آبی', code: '#0000FF' },
        { name: 'سفید', code: '#FFFFFF' }
    ],
    rating: { score: 4.7, count: 19 },
    warranty: 'گارانتی اصالت و سلامت',
    url: 'product/ساکنی-راید.html'
},
'nike-pegasus': {
    id: 'nike-pegasus',
    title: 'نایک پگاسوس',
    brand: 'Nike',
    image: 'images/products/نایک-پگاسوس.jpg',
    price: '2,550,000',
    type: 'کفش دویدن',
    upperMaterial: 'مش مهندسی شده',
    soleMaterial: 'React Foam',
    technology: 'Nike React, Air Zoom',
    weight: '275 گرم',
    sizes: '38 تا 47',
    usage: 'دویدن روزانه، تمرینات',
    colors: [
        { name: 'خاکستری', code: '#888888' },
        { name: 'سیاه', code: '#000000' },
        { name: 'آبی', code: '#0000FF' }
    ],
    rating: { score: 4.9, count: 32 },
    warranty: 'گارانتی اصالت کالا',
    url: 'product/نایک-پگاسوس.html'
},
'nike-zoom': {
    id: 'nike-zoom',
    title: 'نایک زوم',
    brand: 'Nike',
    image: 'images/products/نایک-زوم.jpg',
    price: '2,900,000',
    type: 'کفش دویدن مسابقه‌ای',
    upperMaterial: 'AtomKnit',
    soleMaterial: 'ZoomX Foam',
    technology: 'ZoomX, Carbon Plate',
    weight: '230 گرم',
    sizes: '39 تا 46',
    usage: 'مسابقات دو، دویدن سریع',
    colors: [
        { name: 'سفید', code: '#FFFFFF' },
        { name: 'سبز نئون', code: '#AAFF00' }
    ],
    rating: { score: 5.0, count: 15 },
    warranty: 'گارانتی اصالت',
    url: 'product/نایک-زوم.html'
}
};

// ==================== متغیرهای اصلی ====================
const searchInput = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const productColumns = document.getElementById('product-columns');
const compareEmptyState = document.getElementById('compare-empty');
const viewToggleBtns = document.querySelectorAll('.view-btn');
const printBtn = document.querySelector('.print-btn');
const clearBtn = document.querySelector('.clear-btn');
const addToCompareBtns = document.querySelectorAll('.add-to-compare-btn');

// محدود کردن تعداد محصولات مقایسه به 4
const MAX_COMPARE_PRODUCTS = 4;
let compareList = [];

// ==================== توابع اصلی ====================

/**
* جستجوی محصولات
* جستجو در لیست محصولات براساس نام، برند یا نوع
*/
function searchProducts() {
try {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;
    
    // نمایش نشانگر بارگذاری
    searchResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i></div>';
    searchResults.classList.add('active');
    
    // شبیه‌سازی تأخیر درخواست به سرور
    setTimeout(() => {
        // در محیط واقعی اینجا درخواست AJAX به سرور ارسال می‌شود
        const results = Object.values(productsData).filter(product => {
            const searchLower = searchTerm.toLowerCase();
            return product.title.toLowerCase().includes(searchLower) || 
                   product.brand.toLowerCase().includes(searchLower) || 
                   product.type.toLowerCase().includes(searchLower);
        });
        
        renderSearchResults(results);
    }, 300);
} catch (error) {
    console.error('خطا در جستجوی محصولات:', error);
    showNotification('مشکلی در جستجوی محصولات پیش آمد. لطفاً دوباره تلاش کنید.', 'error');
    
    searchResults.innerHTML = '<div class="no-results error"><p>خطا در جستجو. لطفاً دوباره تلاش کنید.</p></div>';
    searchResults.classList.add('active');
}
}

/**
* نمایش نتایج جستجو
* @param {Array} results - آرایه‌ای از محصولات یافت شده
*/
function renderSearchResults(results) {
try {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <p>محصولی با این مشخصات یافت نشد.</p>
            <p class="search-tips">پیشنهادات جستجو:</p>
            <ul>
                <li>املای کلمات را بررسی کنید</li>
                <li>از کلمات کلیدی کوتاه‌تر استفاده کنید</li>
                <li>نام برند را امتحان کنید (مثل Nike، Adidas)</li>
            </ul>
        `;
        searchResults.appendChild(noResults);
        searchResults.classList.add('active');
        return;
    }
    
    // ایجاد هدر برای نتایج
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'results-header';
    resultsHeader.innerHTML = `
        <span>نتایج جستجو (${results.length})</span>
        <button class="close-results"><i class="fas fa-times"></i></button>
    `;
    searchResults.appendChild(resultsHeader);
    
    // اضافه کردن رویداد بستن نتایج
    resultsHeader.querySelector('.close-results').addEventListener('click', () => {
        searchResults.classList.remove('active');
        searchInput.value = '';
    });
    
    // ایجاد لیست نتایج
    const resultsList = document.createElement('div');
    resultsList.className = 'results-list';
    
    results.forEach(product => {
        const isAlreadyInCompare = compareList.some(item => item.id === product.id);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="result-image" loading="lazy">
            <div class="result-info">
                <div class="result-title">${product.title}</div>
                <div class="result-brand">${product.brand}</div>
                <div class="result-details">
                    <span class="result-type">${product.type}</span>
                    <span class="result-size">${product.sizes}</span>
                </div>
            </div>
            <div class="result-price">${product.price} تومان</div>
            <button class="add-to-compare" data-id="${product.id}" ${isAlreadyInCompare ? 'disabled' : ''}>
                <i class="fas ${isAlreadyInCompare ? 'fa-check' : 'fa-plus'}"></i>
                ${isAlreadyInCompare ? 'اضافه شده' : 'مقایسه'}
            </button>
        `;
        
        resultsList.appendChild(resultItem);
        
        // اضافه کردن به مقایسه با کلیک روی دکمه
        const addBtn = resultItem.querySelector('.add-to-compare');
        if (!isAlreadyInCompare) {
            addBtn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addProductToCompare(productsData[productId]);
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i> اضافه شده';
            });
            
            // اضافه کردن به مقایسه با کلیک روی کل آیتم
            resultItem.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-compare') && !e.target.closest('.add-to-compare')) {
                    const productId = this.querySelector('.add-to-compare').getAttribute('data-id');
                    const addBtn = this.querySelector('.add-to-compare');
                    
                    if (!addBtn.disabled) {
                        addProductToCompare(productsData[productId]);
                        addBtn.disabled = true;
                        addBtn.innerHTML = '<i class="fas fa-check"></i> اضافه شده';
                    }
                }
            });
        }
    });
    
    searchResults.appendChild(resultsList);
    searchResults.classList.add('active');
    
    // اضافه کردن کلاس‌های انیمیشنی به نتایج با تأخیر
    setTimeout(() => {
        const items = document.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 50);
        });
    }, 50);
    
} catch (error) {
    console.error('خطا در نمایش نتایج جستجو:', error);
    searchResults.innerHTML = '<div class="no-results error"><p>خطا در نمایش نتایج. لطفاً دوباره تلاش کنید.</p></div>';
    searchResults.classList.add('active');
}
}

/**
* افزودن محصول به مقایسه
* @param {Object} product - محصول برای افزودن به مقایسه
*/
function addProductToCompare(product) {
try {
    // بررسی تکراری نبودن محصول
    if (compareList.some(item => item.id === product.id)) {
        showNotification('این محصول قبلاً به لیست مقایسه اضافه شده است.', 'info');
        return;
    }
    
    // بررسی محدودیت تعداد محصولات
    if (compareList.length >= MAX_COMPARE_PRODUCTS) {
        showNotification(`شما حداکثر می‌توانید ${MAX_COMPARE_PRODUCTS} محصول را با هم مقایسه کنید.`, 'warning');
        return;
    }
    
    // نمایش انیمیشن افزودن به مقایسه
    const productImage = document.querySelector(`img[alt="${product.title}"]`);
    if (productImage) {
        animateAddToCompare(productImage);
    }
    
    // افزودن به لیست با تأخیر کوچک (برای نمایش انیمیشن)
    setTimeout(() => {
        // افزودن به لیست
        compareList.push(product);
        
        // به‌روزرسانی URL
        updateUrlWithProducts();
        
        // به‌روزرسانی نمایش
        updateCompareTable();
        
        // به‌روزرسانی شمارنده مقایسه در منو
        updateCompareCounter();
        
        // نمایش پیام موفقیت
        showNotification(`${product.title} به لیست مقایسه اضافه شد.`, 'success');
    }, 400);
    
} catch (error) {
    console.error('خطا در افزودن محصول به مقایسه:', error);
    showNotification('مشکلی در افزودن محصول به مقایسه پیش آمد. لطفاً دوباره تلاش کنید.', 'error');
}
}

/**
* نمایش انیمیشن افزودن به مقایسه
* @param {Element} sourceElement - المنت مبدأ برای انیمیشن
*/
function animateAddToCompare(sourceElement) {
try {
    const rect = sourceElement.getBoundingClientRect();
    const compareHeader = document.querySelector('.compare-header');
    
    if (!compareHeader) return;
    
    const targetRect = compareHeader.getBoundingClientRect();
    
    // ایجاد المنت موقت برای انیمیشن
    const tempElement = document.createElement('div');
    tempElement.className = 'animate-to-compare';
    tempElement.style.backgroundImage = `url(${sourceElement.src})`;
    tempElement.style.top = `${rect.top}px`;
    tempElement.style.left = `${rect.left}px`;
    tempElement.style.width = `${rect.width}px`;
    tempElement.style.height = `${rect.height}px`;
    
    document.body.appendChild(tempElement);
    
    // اجرای انیمیشن
    setTimeout(() => {
        tempElement.style.top = `${targetRect.top + 20}px`;
        tempElement.style.left = `${targetRect.left + targetRect.width/2}px`;
        tempElement.style.width = '50px';
        tempElement.style.height = '50px';
        tempElement.style.opacity = '0.2';
        tempElement.style.transform = 'scale(0.3)';
    }, 10);
    
    // حذف المنت موقت پس از اتمام انیمیشن
    setTimeout(() => {
        tempElement.remove();
    }, 400);
} catch (error) {
    console.error('خطا در انیمیشن افزودن به مقایسه:', error);
}
}

/**
* حذف محصول از مقایسه
* @param {string} productId - شناسه محصول برای حذف
*/
function removeProductFromCompare(productId) {
try {
    // پیدا کردن نام محصول قبل از حذف برای نمایش در نوتیفیکیشن
    const productToRemove = compareList.find(product => product.id === productId);
    const productName = productToRemove ? productToRemove.title : 'محصول';
    
    // حذف از لیست
    compareList = compareList.filter(product => product.id !== productId);
    
    // به‌روزرسانی URL
    updateUrlWithProducts();
    
    // به‌روزرسانی نمایش
    updateCompareTable();
    
    // به‌روزرسانی شمارنده مقایسه در منو
    updateCompareCounter();
    
    // به‌روزرسانی وضعیت دکمه‌های مقایسه در صفحه
    updateCompareButtons();
    
    // نمایش پیام موفقیت
    showNotification(`${productName} از لیست مقایسه حذف شد.`, 'success');
} catch (error) {
    console.error('خطا در حذف محصول از مقایسه:', error);
    showNotification('مشکلی در حذف محصول از مقایسه پیش آمد. لطفاً دوباره تلاش کنید.', 'error');
}
}

/**
* به‌روزرسانی جدول مقایسه
*/
function updateCompareTable() {
try {
    // نمایش/مخفی‌سازی حالت خالی
    if (compareList.length === 0) {
        if (compareEmptyState) {
            compareEmptyState.classList.add('active');
        }
        const compareContainer = document.querySelector('.compare-container');
        if (compareContainer) {
            compareContainer.style.display = 'none';
        }
    } else {
        if (compareEmptyState) {
            compareEmptyState.classList.remove('active');
        }
        const compareContainer = document.querySelector('.compare-container');
        if (compareContainer) {
            compareContainer.style.display = 'block';
        }
    }
    
    if (!productColumns) return;
    
    // بازسازی ستون‌های محصول
    const emptyColumns = MAX_COMPARE_PRODUCTS - compareList.length;
    
    let columnsHTML = '';
    
    // ایجاد ستون برای هر محصول
    compareList.forEach(product => {
        columnsHTML += createProductColumn(product);
    });
    
    // اضافه کردن ستون‌های خالی
    for (let i = 0; i < emptyColumns; i++) {
        columnsHTML += `
            <div class="product-column empty-column">
                <div class="product-header sticky-header">
                    <div class="add-product-placeholder">
                        <i class="fas fa-plus-circle"></i>
                        <span>افزودن محصول</span>
                    </div>
                </div>
                <div class="product-data empty-data"></div>
            </div>
        `;
    }
    
    productColumns.innerHTML = columnsHTML;
    
    // اضافه کردن رویدادها به دکمه‌های حذف
    document.querySelectorAll('.remove-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeProductFromCompare(productId);
        });
    });
    
    // اضافه کردن رویداد به ستون‌های خالی
    document.querySelectorAll('.add-product-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // فوکوس روی فیلد جستجو
            if (searchInput) {
                searchInput.focus();
                // باز کردن فیلد جستجو موبایل در صورت نیاز
                const mobileWidth = window.matchMedia('(max-width: 768px)');
                if (mobileWidth.matches) {
                    const searchForm = document.querySelector('.search-product-form');
                    if (searchForm) {
                        searchForm.classList.add('active');
                    }
                }
            }
        });
    });
    
    // برجسته‌سازی تفاوت‌ها
    highlightDifferences();
    
    // افزودن انیمیشن به ستون‌های جدید
    document.querySelectorAll('.product-column:not(.empty-column)').forEach((column, index) => {
        column.classList.add('new-column');
        setTimeout(() => {
            column.classList.remove('new-column');
        }, 500 + index * 100);
    });
} catch (error) {
    console.error('خطا در به‌روزرسانی جدول مقایسه:', error);
    showNotification('مشکلی در به‌روزرسانی جدول مقایسه پیش آمد.', 'error');
}
}

/**
* ایجاد ستون محصول
* @param {Object} product - محصول برای ایجاد ستون
* @returns {string} - HTML ستون محصول
*/
function createProductColumn(product) {
try {
    // ایجاد HTML رنگ‌ها
    let colorsHTML = '';
    if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => {
            colorsHTML += `<div class="color-dot" style="background-color: ${color.code};" title="${color.name}"></div>`;
        });
    }
    
    // ایجاد HTML امتیاز
    const ratingHTML = product.rating ? `
        <div class="user-rating">
            <div class="star-rating" data-rating="${product.rating.score}">
                                    <div class="star-rating" data-rating="${product.rating.score}">
                ${generateStarRating(product.rating.score || 0)}
            </div>
            <div class="rating-count">(${product.rating.count || 0})</div>
        </div>
    ` : '<div class="no-rating">بدون امتیاز</div>';
    
    // قیمت با فرمت بهتر
    const formattedPrice = formatPrice(product.price);
    
    return `
        <div class="product-column" data-id="${product.id}" data-brand="${product.brand}">
            <div class="product-header sticky-header">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                <div class="product-title">${product.title}</div>
                <div class="product-brand">${product.brand}</div>
                <div class="product-actions">
                    <a href="${product.url}" class="view-product" title="مشاهده محصول">
                        <i class="fas fa-external-link-alt"></i>
                        <span>مشاهده محصول</span>
                    </a>
                    <button class="remove-product" data-id="${product.id}" title="حذف از مقایسه">
                        <i class="fas fa-times"></i>
                        <span>حذف</span>
                    </button>
                </div>
            </div>
            <div class="product-data" data-feature="brand">${product.brand || '-'}</div>
            <div class="product-data" data-feature="model">${product.title || '-'}</div>
            <div class="product-data product-price" data-feature="price">
                <span class="price-value">${formattedPrice}</span>
                <span class="currency">تومان</span>
            </div>
            <div class="product-data" data-feature="type">${product.type || '-'}</div>
            <div class="product-data" data-feature="upperMaterial">${product.upperMaterial || '-'}</div>
            <div class="product-data" data-feature="soleMaterial">${product.soleMaterial || '-'}</div>
            <div class="product-data" data-feature="technology">${product.technology || '-'}</div>
            <div class="product-data" data-feature="weight">${product.weight || '-'}</div>
            <div class="product-data" data-feature="sizes">${product.sizes || '-'}</div>
            <div class="product-data" data-feature="usage">${product.usage || '-'}</div>
            <div class="product-data feature-colors" data-feature="colors">${colorsHTML || '-'}</div>
            <div class="product-data" data-feature="rating">${ratingHTML || '-'}</div>
            <div class="product-data" data-feature="warranty">${product.warranty || '-'}</div>
        </div>
    `;
} catch (error) {
    console.error('خطا در ایجاد ستون محصول:', error);
    return `
        <div class="product-column error">
            <div class="product-header sticky-header">
                <div class="error-message">خطا در نمایش محصول</div>
                <button class="remove-product" data-id="${product.id}">حذف</button>
            </div>
            <div class="product-data empty-data"></div>
        </div>
    `;
}
}

/**
* فرمت‌دهی قیمت با جداکننده هزارگان
* @param {string|number} price - قیمت برای فرمت‌دهی
* @returns {string} - قیمت فرمت‌دهی شده
*/
function formatPrice(price) {
if (!price) return '0';

// حذف کاراکترهای غیر عددی
const numericPrice = String(price).replace(/[^\d]/g, '');

// فرمت‌دهی با جداکننده هزارگان
return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
* تولید ستاره‌های امتیاز
* @param {number} score - امتیاز بین 0 تا 5
* @returns {string} - HTML ستاره‌ها
*/
function generateStarRating(score) {
try {
    let stars = '';
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
} catch (error) {
    console.error('خطا در تولید ستاره‌های امتیاز:', error);
    return '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
}
}

/**
* برجسته‌سازی تفاوت‌ها
*/
function highlightDifferences() {
try {
    // اگر حالت مشاهده فقط تفاوت‌ها فعال است
    const diffBtn = document.querySelector('.view-btn[data-view="differences"]');
    const isShowingOnlyDifferences = diffBtn && diffBtn.classList.contains('active');
    
    // برای هر ویژگی در جدول
    const features = ['brand', 'model', 'price', 'type', 'upperMaterial', 'soleMaterial', 'technology', 'weight', 'sizes', 'usage', 'colors', 'rating', 'warranty'];
    
    features.forEach(feature => {
        // دریافت تمام سلول‌های این ویژگی
        const featureCells = document.querySelectorAll(`.product-data[data-feature="${feature}"]`);
        
        // اگر کمتر از 2 محصول هست، برجسته‌سازی نکن
        if (featureCells.length < 2) return;
        
        // بررسی آیا ویژگی‌ها متفاوت هستند
        let values = [];
        let isAllSame = true;
        
        featureCells.forEach(cell => {
            if (!cell.closest('.empty-column')) {
                // برای امتیازها، ستاره‌ها را نادیده بگیر و فقط مقدار عددی را بررسی کن
                if (feature === 'rating') {
                    const ratingElem = cell.querySelector('.star-rating');
                    if (ratingElem) {
                        const ratingValue = parseFloat(ratingElem.getAttribute('data-rating') || '0');
                        values.push(ratingValue);
                        
                        if (values.length > 1 && values[0] !== values[values.length - 1]) {
                            isAllSame = false;
                        }
                    }
                }
                // برای رنگ‌ها، تعداد رنگ‌ها را مقایسه کن
                else if (feature === 'colors') {
                    const colorCount = cell.querySelectorAll('.color-dot').length;
                    values.push(colorCount);
                    
                    if (values.length > 1 && values[0] !== values[values.length - 1]) {
                        isAllSame = false;
                    }
                }
                // برای قیمت، فقط اعداد را مقایسه کن
                else if (feature === 'price') {
                    const priceElem = cell.querySelector('.price-value');
                    if (priceElem) {
                        const priceText = priceElem.textContent.trim().replace(/[^\d]/g, '');
                        const priceValue = parseInt(priceText) || 0;
                        values.push(priceValue);
                        
                        if (values.length > 1 && values[0] !== values[values.length - 1]) {
                            isAllSame = false;
                        }
                    }
                }
                // برای سایر ویژگی‌ها، متن کامل را مقایسه کن
                else {
                    const cellText = cell.textContent.trim();
                    values.push(cellText);
                    
                    if (values.length > 1 && values[0] !== values[values.length - 1]) {
                        isAllSame = false;
                    }
                }
            }
        });
        
        // برجسته‌سازی تفاوت‌ها
        if (!isAllSame) {
            // ابتدا کلاس هایلایت را از همه حذف می‌کنیم
            featureCells.forEach(cell => {
                if (!cell.closest('.empty-column')) {
                    cell.classList.add('highlight-different');
                    cell.classList.remove('highlight-better');
                }
            });
            
            // سپس مقادیر بهتر را برجسته می‌کنیم
            if (feature === 'rating') {
                const maxRating = Math.max(...values);
                featureCells.forEach(cell => {
                    if (!cell.closest('.empty-column')) {
                        const ratingElem = cell.querySelector('.star-rating');
                        if (ratingElem) {
                            const ratingValue = parseFloat(ratingElem.getAttribute('data-rating') || '0');
                            if (ratingValue === maxRating && maxRating > 0) {
                                cell.classList.add('highlight-better');
                            }
                        }
                    }
                });
            }
            else if (feature === 'price') {
                const minPrice = Math.min(...values.filter(v => v > 0));
                featureCells.forEach(cell => {
                    if (!cell.closest('.empty-column')) {
                        const priceElem = cell.querySelector('.price-value');
                        if (priceElem) {
                            const priceText = priceElem.textContent.trim().replace(/[^\d]/g, '');
                            const priceValue = parseInt(priceText) || 0;
                            if (priceValue === minPrice && priceValue > 0) {
                                cell.classList.add('highlight-better');
                            }
                        }
                    }
                });
            }
            else if (feature === 'weight') {
                // استخراج فقط اعداد از وزن و مقایسه آنها
                const weights = values.map(v => {
                    const match = String(v).match(/\d+/);
                    return match ? parseInt(match[0]) : Infinity;
                });
                
                const minWeight = Math.min(...weights.filter(w => w < Infinity));
                
                featureCells.forEach(cell => {
                    if (!cell.closest('.empty-column')) {
                        const weightText = cell.textContent.trim();
                        const match = weightText.match(/\d+/);
                        if (match) {
                            const weightValue = parseInt(match[0]);
                            if (weightValue === minWeight) {
                                cell.classList.add('highlight-better');
                            }
                        }
                    }
                });
            }
            
            // در حالت نمایش فقط تفاوت‌ها، سایر ویژگی‌ها را نمایش بده
            if (isShowingOnlyDifferences) {
                document.querySelectorAll(`.feature-item:nth-child(${features.indexOf(feature) + 2})`).forEach(item => {
                    item.style.display = 'flex';
                });
                featureCells.forEach(cell => {
                    cell.style.display = 'flex';
                });
            }
        } else if (isShowingOnlyDifferences) {
            // مخفی کردن ویژگی‌های مشابه در حالت نمایش فقط تفاوت‌ها
            document.querySelectorAll(`.feature-item:nth-child(${features.indexOf(feature) + 2})`).forEach(item => {
                item.style.display = 'none';
            });
            featureCells.forEach(cell => {
                cell.style.display = 'none';
            });
        }
    });
} catch (error) {
    console.error('خطا در برجسته‌سازی تفاوت‌ها:', error);
}
}

/**
* نمایش نوتیفیکیشن
* @param {string} message - متن پیام
* @param {string} type - نوع پیام: success, info, warning, error
*/
function showNotification(message, type = 'info') {
try {
    // تعیین آیکون بر اساس نوع
    const iconMap = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-exclamation-circle'
    };
    
    const icon = iconMap[type] || 'fa-info-circle';
    
    // پاک کردن نوتیفیکیشن‌های قبلی
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // نمایش با انیمیشن
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // بستن با کلیک روی دکمه
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // بستن خودکار بعد از 5 ثانیه
    setTimeout(() => {
        if (notification && document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification && document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
} catch (error) {
    console.error('خطا در نمایش نوتیفیکیشن:', error);
}
}

/**
* به‌روزرسانی URL با محصولات فعلی
*/
function updateUrlWithProducts() {
try {
    if (compareList.length === 0) {
        history.pushState({}, '', window.location.pathname);
        return;
    }
    
    const productIds = compareList.map(product => product.id).join(',');
    history.pushState({}, '', `${window.location.pathname}?products=${productIds}`);
} catch (error) {
    console.error('خطا در به‌روزرسانی URL:', error);
}
}

/**
* بارگیری محصولات از URL
*/
function loadProductsFromUrl() {
try {
    const urlParams = new URLSearchParams(window.location.search);
    const productsParam = urlParams.get('products');
    
    if (productsParam) {
        const productIds = productsParam.split(',');
        
        productIds.forEach(id => {
            if (productsData[id]) {
                compareList.push(productsData[id]);
            }
        });
        
        if (compareList.length > 0) {
            updateCompareTable();
            updateCompareCounter();
        }
    }
} catch (error) {
    console.error('خطا در بارگیری محصولات از URL:', error);
}
}

/**
* به‌روزرسانی شمارنده مقایسه در منو
*/
function updateCompareCounter() {
try {
    // یافتن نشانگر تعداد مقایسه در منو
    const compareCount = document.querySelector('.compare-count');
    if (compareCount) {
        if (compareList.length > 0) {
            compareCount.textContent = compareList.length;
            compareCount.style.display = 'inline-block';
        } else {
            compareCount.textContent = '';
            compareCount.style.display = 'none';
        }
    }
} catch (error) {
    console.error('خطا در به‌روزرسانی شمارنده مقایسه:', error);
}
}

/**
* به‌روزرسانی وضعیت دکمه‌های مقایسه
*/
function updateCompareButtons() {
try {
    // به‌روزرسانی دکمه‌های 'افزودن به مقایسه' در صفحه
    document.querySelectorAll('.add-to-compare-btn, .add-to-compare').forEach(button => {
        const productId = button.getAttribute('data-id');
        if (productId) {
            const isInCompare = compareList.some(product => product.id === productId);
            
            if (isInCompare) {
                button.classList.add('added');
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-check"></i> اضافه شده';
            } else {
                button.classList.remove('added');
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-plus"></i> افزودن به مقایسه';
            }
        }
    });
} catch (error) {
    console.error('خطا در به‌روزرسانی دکمه‌های مقایسه:', error);
}
}

/**
* اشتراک‌گذاری مقایسه فعلی
*/
function shareCurrent() {
try {
    if (compareList.length === 0) {
        showNotification('برای اشتراک‌گذاری، ابتدا محصولی به مقایسه اضافه کنید.', 'warning');
        return;
    }
    
    // ساخت URL برای اشتراک‌گذاری
    const currentURL = window.location.href;
    
    // کپی به کلیپ‌بورد
    navigator.clipboard.writeText(currentURL).then(() => {
        showNotification('لینک مقایسه در کلیپ‌بورد کپی شد.', 'success');
    }).catch(() => {
        // اگر API کلیپ‌بورد پشتیبانی نشد، از روش قدیمی استفاده کن
        const textArea = document.createElement('textarea');
        textArea.value = currentURL;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('لینک مقایسه در کلیپ‌بورد کپی شد.', 'success');
        } catch (err) {
            showNotification('کپی لینک با مشکل مواجه شد. لطفاً به صورت دستی کپی کنید.', 'error');
            console.error('خطا در کپی لینک:', err);
        }
        
        document.body.removeChild(textArea);
    });
} catch (error) {
    console.error('خطا در اشتراک‌گذاری مقایسه:', error);
    showNotification('مشکلی در اشتراک‌گذاری پیش آمد.', 'error');
}
}

// ==================== رویدادها ====================

// رویداد جستجوی محصول
if (searchInput && searchBtn) {
// جستجو با کلیک روی دکمه
searchBtn.addEventListener('click', searchProducts);

// جستجو با فشردن Enter
searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
    
    // بستن نتایج جستجو اگر فیلد خالی شد
    if (this.value.trim() === '') {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
    }
});

// بستن نتایج جستجو با کلیک بیرون
document.addEventListener('click', function(e) {
    if (searchResults && !searchResults.contains(e.target) && 
        e.target !== searchInput && e.target !== searchBtn &&
        !e.target.closest('.search-product-form')) {
        searchResults.classList.remove('active');
    }
});
}

// تغییر حالت نمایش (همه / فقط تفاوت‌ها)
if (viewToggleBtns) {
viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const viewMode = this.getAttribute('data-view');
        
        if (viewMode === 'all') {
            // نمایش همه ویژگی‌ها
            document.querySelectorAll('.feature-item, .product-data').forEach(item => {
                item.style.display = '';
            });
        } else if (viewMode === 'differences') {
            // فقط نمایش تفاوت‌ها
            highlightDifferences();
        }
    });
});
}

// چاپ مقایسه
if (printBtn) {
printBtn.addEventListener('click', function() {
    if (compareList.length === 0) {
        showNotification('برای چاپ، ابتدا محصولی به مقایسه اضافه کنید.', 'warning');
        return;
    }
    window.print();
});
}

// پاک کردن همه محصولات
if (clearBtn) {
clearBtn.addEventListener('click', function() {
    if (compareList.length === 0) {
        showNotification('لیست مقایسه خالی است.', 'info');
        return;
    }
    
    // تأیید از کاربر
    if (confirm('آیا مطمئن هستید که می‌خواهید همه محصولات را از مقایسه حذف کنید؟')) {
        compareList = [];
        updateUrlWithProducts();
        updateCompareTable();
        showNotification('همه محصولات از لیست مقایسه حذف شدند.', 'success');
        updateCompareCounter();
        updateCompareButtons();
    }
});
}

// افزودن محصول از لیست پیشنهادی
if (addToCompareBtns && addToCompareBtns.length > 0) {
addToCompareBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        if (productsData[productId]) {
            addProductToCompare(productsData[productId]);
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> اضافه شده';
        }
    });
});
}

// اضافه کردن دکمه اشتراک‌گذاری به ابزارهای مقایسه
const compareOptions = document.querySelector('.compare-options');
if (compareOptions) {
const shareBtn = document.createElement('button');
shareBtn.className = 'share-btn';
shareBtn.innerHTML = '<i class="fas fa-share-alt"></i><span>اشتراک‌گذاری</span>';
shareBtn.addEventListener('click', shareCurrent);
compareOptions.appendChild(shareBtn);
}

// ==================== راه‌اندازی اولیه ====================

// بارگیری محصولات از URL
loadProductsFromUrl();

// به‌روزرسانی وضعیت دکمه‌های مقایسه در صفحه
updateCompareButtons();

// رسپانسیو کردن جدول مقایسه - اسکرول افقی با لمس
const compareContainer = document.querySelector('.compare-container');
if (compareContainer) {
let isDown = false;
let startX;
let scrollLeft;

compareContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    compareContainer.classList.add('active');
    startX = e.pageX - compareContainer.offsetLeft;
    scrollLeft = compareContainer.scrollLeft;
});

compareContainer.addEventListener('mouseleave', () => {
    isDown = false;
    compareContainer.classList.remove('active');
});

compareContainer.addEventListener('mouseup', () => {
    isDown = false;
    compareContainer.classList.remove('active');
});

compareContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - compareContainer.offsetLeft;
    const walk = (x - startX) * 2;
    compareContainer.scrollLeft = scrollLeft - walk;
});
}

// پیام برای نمایش راهنمای کاربرد در اولین بازدید
if (!localStorage.getItem('compareVisited')) {
setTimeout(() => {
    showNotification('با جستجو و انتخاب محصولات، آنها را با هم مقایسه کنید.', 'info');
    localStorage.setItem('compareVisited', 'true');
}, 1000);
}
});