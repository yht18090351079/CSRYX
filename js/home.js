// 首页逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initHomePage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('home');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
});

// 初始化首页
function initHomePage() {
    // 渲染推荐内容轮播
    renderRecommendationCarousel();
    
    // 渲染热门路线
    renderHotRoutes();
    
    // 启动轮播自动播放
    startCarouselAutoPlay();
}

// 渲染推荐内容轮播
function renderRecommendationCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    if (!carouselTrack || !carouselIndicators) return;
    
    const recommendations = MockData.recommendations;
    
    // 渲染轮播内容
    carouselTrack.innerHTML = recommendations.map(item => `
        <div class="recommendation-item">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="item-rating">
                    <span class="rating-stars">${generateStars(item.rating)}</span>
                    <span class="rating-score">${item.rating.toFixed(1)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 渲染指示器
    carouselIndicators.innerHTML = recommendations.map((_, index) => `
        <div class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
    `).join('');
}

// 渲染热门路线
function renderHotRoutes() {
    const routeList = document.getElementById('routeList');
    if (!routeList) return;
    
    const routes = [
        {
            id: 1,
            title: '文化深度游',
            price: '¥1200',
            description: '武侯祠→锦里→杜甫草堂→宽窄巷子，深度体验成都历史文化',
            tags: ['历史', '文化', '3天'],
            rating: 4.8,
            reviews: 128
        },
        {
            id: 2,
            title: '美食探索之旅',
            price: '¥900',
            description: '火锅→小龙坎→川菜→茶馆，品味正宗成都美食文化',
            tags: ['美食', '川菜', '2天'],
            rating: 4.9,
            reviews: 256
        },
        {
            id: 3,
            title: '熊猫亲子游',
            price: '¥600',
            description: '大熊猫基地→科技馆→儿童乐园，适合亲子家庭出游',
            tags: ['亲子', '熊猫', '1天'],
            rating: 4.7,
            reviews: 89
        }
    ];
    
    routeList.innerHTML = routes.map(route => `
        <div class="route-item" onclick="selectRoute(${route.id})">
            <div class="route-header">
                <span class="route-title">${route.title}</span>
                <span class="route-price">${route.price}</span>
            </div>
            <div class="route-description">${route.description}</div>
            <div class="route-meta">
                <div class="route-tags">
                    ${route.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
                </div>
                <div class="route-rating">
                    <i class="fas fa-star"></i>
                    <span>${route.rating}</span>
                    <span>(${route.reviews})</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
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
}

// 轮播相关功能
let currentSlide = 0;
let carouselInterval;

function goToSlide(index) {
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || !indicators.length) return;
    
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // 更新指示器
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    const totalSlides = MockData.recommendations.length;
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function startCarouselAutoPlay() {
    carouselInterval = setInterval(nextSlide, 3000);
    
    // 鼠标悬停时暂停自动播放
    const carousel = document.querySelector('.recommendation-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 3000);
        });
    }
}

// 选择路线
function selectRoute(routeId) {
    Message.info(`选择了路线 ${routeId}，跳转到详情页面`);
    // 这里可以跳转到路线详情页面
    // Navigation.goTo('planDetail', { routeId });
}

// 页面卸载时清理定时器
window.addEventListener('beforeunload', function() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}); 