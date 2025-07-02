// 发现页面JavaScript
class DiscoverPage {
    constructor() {
        this.currentCategory = 'all';
        this.searchHistory = this.getSearchHistory();
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadContent();
        this.initializeSearchSuggestions();
        this.renderSearchHistory();
    }

    bindEvents() {
        // 搜索相关事件
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        const cameraBtn = document.getElementById('cameraBtn');
        const locationBtn = document.getElementById('locationBtn');

        if (searchInput) {
            searchInput.addEventListener('focus', () => this.showSearchSuggestions());
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.performSearch(e.target.value);
            });
        }

        if (voiceBtn) voiceBtn.addEventListener('click', () => this.startVoiceSearch());
        if (cameraBtn) cameraBtn.addEventListener('click', () => this.startCameraSearch());
        if (locationBtn) locationBtn.addEventListener('click', () => this.startLocationSearch());

        // 分类点击事件
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.selectCategory(category);
            });
        });

        // 设置默认选中状态
        this.setDefaultCategory();

        // 搜索建议点击关闭
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (searchSuggestions) {
            searchSuggestions.addEventListener('click', (e) => {
                if (e.target === searchSuggestions) this.hideSearchSuggestions();
            });
        }
    }

    // 搜索功能
    showSearchSuggestions() {
        const query = document.getElementById('searchInput').value;
        const suggestions = this.generateSearchSuggestions(query);
        this.renderSearchSuggestions(suggestions);
        
        const suggestionsModal = document.getElementById('searchSuggestions');
        if (suggestionsModal) suggestionsModal.classList.add('show');
    }

    hideSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) suggestions.classList.remove('show');
    }

    handleSearchInput(value) {
        if (value.trim()) {
            const suggestions = this.generateSearchSuggestions(value);
            this.renderSearchSuggestions(suggestions);
        }
    }

    loadNearbyContent() {
        this.loadNearbyFood();
        Message.show('已更新附近内容', 'success');
    }

    performSearch(query) {
        if (!query.trim()) return;
        this.addToSearchHistory(query);
        this.hideSearchSuggestions();
        Message.show(`正在搜索"${query}"...`, 'info');
        
        setTimeout(() => {
            Message.show(`找到 ${Math.floor(Math.random() * 100) + 20} 个结果`, 'success');
        }, 1000);
    }

    startVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'zh-CN';
            recognition.onstart = () => Message.show('请说话...', 'info');
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchInput').value = transcript;
                this.performSearch(transcript);
            };
            recognition.onerror = () => Message.show('语音识别失败', 'error');
            recognition.start();
        } else {
            Message.show('浏览器不支持语音搜索', 'warning');
        }
    }

    startCameraSearch() {
        Message.show('相机搜索功能开发中', 'warning');
    }

    startLocationSearch() {
        if ('geolocation' in navigator) {
            Message.show('正在获取位置...', 'info');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    Message.show('已获取位置，更新附近内容', 'success');
                    this.loadNearbyContent();
                },
                () => Message.show('无法获取位置', 'error')
            );
        } else {
            Message.show('浏览器不支持位置服务', 'warning');
        }
    }

    // 搜索历史
    getSearchHistory() {
        return JSON.parse(localStorage.getItem('discover_search_history') || '[]');
    }

    addToSearchHistory(query) {
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
        
        localStorage.setItem('discover_search_history', JSON.stringify(this.searchHistory));
        this.renderSearchHistory();
    }

    renderSearchHistory() {
        const historyContainer = document.getElementById('searchHistory');
        if (!historyContainer) return;

        if (this.searchHistory.length === 0) {
            historyContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">暂无搜索历史</p>';
            return;
        }

        historyContainer.innerHTML = this.searchHistory.map(query => `
            <div class="history-item" onclick="discoverPage.performSearch('${query}')">
                <i class="fas fa-history"></i>
                <span>${query}</span>
            </div>
        `).join('');
    }

    // 分类功能
    selectCategory(category) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`[data-category="${category}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        this.currentCategory = category;
        this.loadCategoryContent(category);
    }

    setDefaultCategory() {
        // 默认选中"景点"分类
        const defaultCategory = 'attractions';
        const firstItem = document.querySelector(`[data-category="${defaultCategory}"]`);
        if (firstItem) {
            firstItem.classList.add('active');
            this.currentCategory = defaultCategory;
        }
    }

    loadCategoryContent(category) {
        Message.show(`正在加载${this.getCategoryName(category)}内容...`, 'info');
        
        // 根据分类显示不同的内容模块
        const modules = document.querySelectorAll('.content-module');
        modules.forEach(module => {
            const moduleTitle = module.querySelector('.module-title');
            const titleText = moduleTitle ? moduleTitle.textContent : '';
            
            switch(category) {
                case 'attractions':
                    // 显示景点相关模块
                    if (titleText.includes('热门') || titleText.includes('推荐')) {
                        module.style.display = 'block';
                    } else {
                        module.style.display = 'none';
                    }
                    break;
                case 'food':
                    // 显示美食相关模块
                    if (titleText.includes('美食')) {
                        module.style.display = 'block';
                    } else {
                        module.style.display = 'none';
                    }
                    break;
                case 'hotels':
                    // 酒店模块暂未实现
                    module.style.display = 'none';
                    if (modules[0] === module) { // 只在第一个模块时显示提示
                        Message.show('酒店模块开发中', 'warning');
                    }
                    break;
                case 'activities':
                    // 显示活动相关模块
                    if (titleText.includes('活动')) {
                        module.style.display = 'block';
                    } else {
                        module.style.display = 'none';
                    }
                    break;
                case 'seasonal':
                    Message.show('季节特色内容开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'transport':
                    Message.show('交通信息模块开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'teahouse':
                    Message.show('茶馆推荐模块开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'shopping':
                    Message.show('购物推荐模块开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'photo':
                    Message.show('打卡地点模块开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'shows':
                    Message.show('演出信息模块开发中', 'warning');
                    module.style.display = 'none';
                    break;
                case 'all':
                default:
                    module.style.display = 'block';
                    break;
            }
        });
    }

    getCategoryName(category) {
        const names = {
            'attractions': '景点',
            'food': '美食',
            'hotels': '酒店',
            'activities': '活动',
            'seasonal': '季节',
            'transport': '交通',
            'teahouse': '茶馆',
            'shopping': '购物',
            'photo': '打卡',
            'shows': '演出',
            'all': '全部'
        };
        return names[category] || '全部';
    }

    // 内容加载
    loadContent(category = 'all') {
        this.loadHotList();
        this.loadRecommendations();
        this.loadNearbyFood();
        this.loadWeeklyActivities();
    }

    loadHotList() {
        const hotList = document.getElementById('hotList');
        if (!hotList) return;

        const hotItems = [
            {
                id: 1,
                title: '宽窄巷子',
                image: 'https://images.unsplash.com/photo-1609577830099-7b31a9b19b80?w=200&h=200&fit=crop',
                rating: 4.6,
                price: '免费',
                popularity: '1.2w人关注',
                description: '古韵成都，体验传统文化'
            },
            {
                id: 2,
                title: '锦里古街',
                image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=200&h=200&fit=crop',
                rating: 4.5,
                price: '免费',
                popularity: '9.8k人关注',
                description: '三国文化主题街区'
            },
            {
                id: 3,
                title: '大熊猫繁育基地',
                image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?w=200&h=200&fit=crop',
                rating: 4.8,
                price: '58元',
                popularity: '2.1w人关注',
                description: '与国宝亲密接触'
            },
            {
                id: 4,
                title: '九寨沟',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
                rating: 4.9,
                price: '220元',
                popularity: '3.5w人关注',
                description: '人间仙境，世界自然遗产'
            },
            {
                id: 5,
                title: '峨眉山',
                image: 'https://images.unsplash.com/photo-1571071718031-7a6ce88e8b7d?w=200&h=200&fit=crop',
                rating: 4.7,
                price: '185元',
                popularity: '1.8w人关注',
                description: '佛教名山，金顶日出'
            }
        ];

        hotList.innerHTML = hotItems.map(item => `
            <div class="hot-item" onclick="discoverPage.viewDetail('attraction', ${item.id})">
                <img src="${item.image}" alt="${item.title}" class="hot-image">
                <div class="hot-content">
                    <h3 class="hot-title">📍 ${item.title}</h3>
                    <div class="hot-meta">
                        <span><i class="fas fa-star"></i> ${item.rating}</span>
                        <span><i class="fas fa-ticket-alt"></i> ${item.price}</span>
                    </div>
                    <div class="hot-meta">
                        <span><i class="fas fa-fire"></i> ${item.popularity}</span>
                    </div>
                    <p class="hot-description">💡 ${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    loadRecommendations() {
        const grid = document.getElementById('recommendationGrid');
        if (!grid) return;

        const items = [
            { id: 1, title: '杜甫草堂', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=300&h=200&fit=crop', rating: 4.4, price: '60元' },
            { id: 2, title: '锦里古街', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=300&h=200&fit=crop', rating: 4.5, price: '免费' },
            { id: 3, title: '武侯祠', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', rating: 4.3, price: '50元' },
            { id: 4, title: '春熙路', image: 'https://images.unsplash.com/photo-1555633514-abcee5aa70e8?w=300&h=200&fit=crop', rating: 4.2, price: '免费' },
            { id: 5, title: '青城山', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', rating: 4.6, price: '90元' },
            { id: 6, title: '都江堰', image: 'https://images.unsplash.com/photo-1571032719882-ac4f77b97072?w=300&h=200&fit=crop', rating: 4.7, price: '80元' },
            { id: 7, title: '文殊院', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&h=200&fit=crop', rating: 4.4, price: '免费' },
            { id: 8, title: '太古里', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop', rating: 4.3, price: '免费' }
        ];

        grid.innerHTML = items.map(item => `
            <div class="recommendation-card" onclick="discoverPage.viewDetail('attraction', ${item.id})">
                <img src="${item.image}" alt="${item.title}" class="recommendation-image">
                <div class="recommendation-content">
                    <h4 class="recommendation-title">${item.title}</h4>
                    <div class="recommendation-meta">
                        <span><i class="fas fa-star"></i> ${item.rating}</span>
                        <span>${item.price}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadNearbyFood() {
        const grid = document.getElementById('foodGrid');
        if (!grid) return;

        const foods = [
            { id: 1, title: '小龙坎火锅', image: 'https://images.unsplash.com/photo-1541833281671-02b9b5a0dca8?w=300&h=200&fit=crop', rating: 4.6, distance: '500m' },
            { id: 2, title: '蛋烘糕', image: 'https://images.unsplash.com/photo-1626074353765-518873789290?w=300&h=200&fit=crop', rating: 4.8, distance: '200m' },
            { id: 3, title: '钟水饺', image: 'https://images.unsplash.com/photo-1563379091059-d3eebb7df3a0?w=300&h=200&fit=crop', rating: 4.5, distance: '800m' },
            { id: 4, title: '担担面', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop', rating: 4.7, distance: '300m' },
            { id: 5, title: '麻婆豆腐', image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300&h=200&fit=crop', rating: 4.4, distance: '600m' },
            { id: 6, title: '毛血旺', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop', rating: 4.6, distance: '400m' },
            { id: 7, title: '龙抄手', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=300&h=200&fit=crop', rating: 4.3, distance: '700m' },
            { id: 8, title: '夫妻肺片', image: 'https://images.unsplash.com/photo-1617094215746-1b17e673f5c2?w=300&h=200&fit=crop', rating: 4.5, distance: '350m' }
        ];

        grid.innerHTML = foods.map(item => `
            <div class="food-card" onclick="discoverPage.viewDetail('food', ${item.id})">
                <img src="${item.image}" alt="${item.title}" class="food-image">
                <div class="food-content">
                    <h4 class="food-title">${item.title}</h4>
                    <div class="food-meta">
                        <div class="food-rating"><i class="fas fa-star"></i> ${item.rating}</div>
                        <span>${item.distance}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadWeeklyActivities() {
        const list = document.getElementById('activityList');
        if (!list) return;

        const activities = [
            { id: 1, title: '川剧变脸表演', time: '每晚20:00-21:00', location: '锦里古街戏台', price: '80元', icon: '🎭' },
            { id: 2, title: '熊猫基地夜游', time: '周六日19:30-22:00', location: '成都大熊猫繁育研究基地', price: '120元', icon: '🐼' },
            { id: 3, title: '青城山徒步', time: '周六08:00-18:00', location: '青城山景区', price: '90元', icon: '🏔️' },
            { id: 4, title: '锦里民俗表演', time: '每日10:00-22:00', location: '锦里古街', price: '免费', icon: '🏮' },
            { id: 5, title: '宽窄巷子文化游', time: '每日09:00-21:00', location: '宽窄巷子', price: '免费', icon: '🏛️' },
            { id: 6, title: '都江堰水利之旅', time: '每日08:30-17:30', location: '都江堰风景区', price: '80元', icon: '🌊' },
            { id: 7, title: '成都夜市美食', time: '每晚18:00-24:00', location: '春熙路步行街', price: '自费', icon: '🍜' },
            { id: 8, title: '文殊院禅修体验', time: '周日14:00-17:00', location: '文殊院', price: '免费', icon: '🧘' }
        ];

        list.innerHTML = activities.map(item => `
            <div class="activity-card" onclick="discoverPage.viewDetail('activity', ${item.id})">
                <div class="activity-title">${item.icon} ${item.title}</div>
                <div class="activity-details">
                    <div class="activity-detail"><i class="fas fa-clock"></i> ${item.time}</div>
                    <div class="activity-detail"><i class="fas fa-map-marker-alt"></i> ${item.location}</div>
                    <div class="activity-detail"><i class="fas fa-ticket-alt"></i> 门票${item.price}</div>
                </div>
                <div class="activity-action">
                    <button class="book-btn" onclick="event.stopPropagation(); discoverPage.bookActivity(${item.id})">立即预订</button>
                </div>
            </div>
        `).join('');
    }

    viewDetail(type, id) {
        Message.show(`查看${type}详情`, 'info');
    }

    bookActivity(id) {
        Message.show('预订功能开发中', 'warning');
    }

    initializeSearchSuggestions() {
        document.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.getElementById('searchInput').value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });
    }

    generateSearchSuggestions(query) {
        const suggestions = [
            '大熊猫基地', '九寨沟', '峨眉山', '乐山大佛', '四姑娘山',
            '火锅', '串串香', '担担面', '麻婆豆腐', '夫妻肺片',
            '宽窄巷子', '锦里', '春熙路', '太古里', '文殊院',
            '川剧变脸', '青城山徒步', '都江堰', '杜甫草堂', '武侯祠'
        ];
        
        if (!query) return suggestions.slice(0, 6);
        
        return suggestions.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
    }

    renderSearchSuggestions(suggestions) {
        const container = document.querySelector('.suggestions-content');
        if (!container) return;

        const suggestionsHtml = `
            <h3>搜索建议</h3>
            <div class="suggestion-tags">
                ${suggestions.map(suggestion => `
                    <span class="suggestion-tag" onclick="discoverPage.performSearch('${suggestion}')">${suggestion}</span>
                `).join('')}
            </div>
            
            <h3>热门搜索</h3>
            <div class="hot-searches">
                <div class="hot-search-item" onclick="discoverPage.performSearch('大熊猫基地')">
                    <i class="fas fa-fire"></i>
                    <span>大熊猫基地</span>
                    <span class="search-count">10.2k</span>
                </div>
                <div class="hot-search-item" onclick="discoverPage.performSearch('火锅')">
                    <i class="fas fa-fire"></i>
                    <span>火锅</span>
                    <span class="search-count">8.7k</span>
                </div>
                <div class="hot-search-item" onclick="discoverPage.performSearch('宽窄巷子')">
                    <i class="fas fa-fire"></i>
                    <span>宽窄巷子</span>
                    <span class="search-count">6.3k</span>
                </div>
            </div>
        `;
        
        container.innerHTML = suggestionsHtml;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    window.discoverPage = new DiscoverPage();
});

// 页面滚动优化
let ticking = false;
function updateScrollElements() {
    const scrollTop = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
        if (scrollTop > 100) {
            header.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            header.style.boxShadow = '0 2px 20px rgba(102, 126, 234, 0.2)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            header.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.1)';
        }
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// 返回顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加返回顶部按钮（如果滚动超过500px）
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    let backToTopBtn = document.getElementById('backToTopBtn');
    
    if (scrollTop > 500) {
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'backToTopBtn';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.className = 'back-to-top-btn';
            backToTopBtn.onclick = scrollToTop;
            document.body.appendChild(backToTopBtn);
        }
        backToTopBtn.style.display = 'flex';
    } else if (backToTopBtn) {
        backToTopBtn.style.display = 'none';
    }
});

// 添加返回顶部按钮样式
const discoverPageStyle = document.createElement('style');
discoverPageStyle.textContent = `
    .back-to-top-btn {
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        z-index: 99;
    }
    
    .back-to-top-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }
`;
document.head.appendChild(discoverPageStyle); 