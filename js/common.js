// 公共JS文件 - 所有页面共用的功能和数据

// 全局配置
const AppConfig = {
    name: '蓉易行',
    version: '1.0.0',
    baseUrl: window.location.origin,
    pages: {
        splash: 'index.html',
        home: 'home.html',
        chat: 'chat.html',
        generating: 'generating.html',
        compare: 'compare.html',
        planDetail: 'plan-detail.html',
        todo: 'todo.html',
        map: 'map.html',
        trips: 'trips.html',
        discover: 'discover.html',
        profile: 'profile.html'
    }
};

// 页面导航功能
const Navigation = {
    // 跳转到指定页面
    goTo(page, params = {}) {
        const url = AppConfig.pages[page];
        if (!url) {
            console.error('页面不存在:', page);
            return;
        }
        
        // 如果有参数，存储到sessionStorage
        if (Object.keys(params).length > 0) {
            sessionStorage.setItem('pageParams', JSON.stringify(params));
        }
        
        window.location.href = url;
    },
    
    // 返回上一页
    back() {
        window.history.back();
    },
    
    // 获取页面参数
    getParams() {
        const params = sessionStorage.getItem('pageParams');
        sessionStorage.removeItem('pageParams');
        return params ? JSON.parse(params) : {};
    },
    
    // 设置当前活跃的导航项
    setActiveNav(page) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
    }
};

// 本地存储管理
const Storage = {
    // 存储数据
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('存储失败:', e);
            return false;
        }
    },
    
    // 获取数据
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('读取失败:', e);
            return defaultValue;
        }
    },
    
    // 删除数据
    remove(key) {
        localStorage.removeItem(key);
    },
    
    // 清空所有数据
    clear() {
        localStorage.clear();
    }
};

// 消息提示功能
const Message = {
    show(content, type = 'info', duration = 3000) {
        // 创建消息元素
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${this.getIcon(type)}"></i>
                <span>${content}</span>
            </div>
        `;
        
        // 添加样式
        Object.assign(message.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '14px',
            zIndex: '9999',
            animation: 'slideDown 0.3s ease-out',
            backgroundColor: this.getColor(type)
        });
        
        // 添加到页面
        document.body.appendChild(message);
        
        // 自动移除
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 300);
            }
        }, duration);
    },
    
    success(content, duration) {
        this.show(content, 'success', duration);
    },
    
    error(content, duration) {
        this.show(content, 'error', duration);
    },
    
    warning(content, duration) {
        this.show(content, 'warning', duration);
    },
    
    info(content, duration) {
        this.show(content, 'info', duration);
    },
    
    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    getColor(type) {
        const colors = {
            success: '#67c23a',
            error: '#f56c6c',
            warning: '#faad14',
            info: '#667eea'
        };
        return colors[type] || '#667eea';
    }
};

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },
    
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 复制文本到剪贴板
    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }
};

// 模拟数据
const MockData = {
    // 用户信息
    user: {
        id: 1,
        name: '王小明',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        description: '成都旅游爱好者',
        level: 3,
        stats: {
            trips: 3,
            spots: 12,
            distance: 720
        }
    },
    
    // 旅行方案
    travelPlans: [
        {
            id: 1,
            name: '文化深度游',
            budget: 1200,
            intensity: '中等',
            culturalSpots: 5,
            foodSpots: 3,
            advantages: '深度文化体验',
            suitableFor: '文化爱好者',
            days: 3,
            schedule: [
                {
                    date: '7月5日 (周六)',
                    activities: [
                        {
                            id: 1,
                            time: '09:00 - 11:30',
                            name: '武侯祠博物馆',
                            icon: 'fas fa-landmark',
                            description: '中国唯一的君臣合祀祠庙，了解三国文化',
                            cost: '门票60元',
                            duration: '建议游玩2小时',
                            distance: '距离酒店2.3km (12分钟)',
                            rating: 4.6,
                            completed: false
                        },
                        {
                            id: 2,
                            time: '12:00 - 13:30',
                            name: '锦里小吃街',
                            icon: 'fas fa-utensils',
                            description: '品尝地道成都小吃',
                            cost: '人均80元',
                            duration: '1.5小时',
                            distance: '步行5分钟',
                            rating: 4.3,
                            completed: false
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: '美食文化混搭',
            budget: 1000,
            intensity: '较高',
            culturalSpots: 3,
            foodSpots: 5,
            advantages: '美食体验丰富',
            suitableFor: '美食爱好者',
            days: 3,
            schedule: []
        },
        {
            id: 3,
            name: '休闲慢生活',
            budget: 800,
            intensity: '轻松',
            culturalSpots: 2,
            foodSpots: 4,
            advantages: '节奏轻松，体验慢生活',
            suitableFor: '休闲游客',
            days: 3,
            schedule: []
        }
    ],
    
    // 用户行程
    userTrips: [
        {
            id: 1,
            name: '文化深度游',
            date: '7月5日-7日 (3天2晚)',
            description: '第1天: 武侯祠→锦里...',
            status: '进行中',
            statusType: 'success',
            budget: 1200,
            people: 1,
            progress: {
                current: 1,
                total: 4,
                percentage: 25
            }
        },
        {
            id: 2,
            name: '美食文化混搭',
            date: '7月15日-17日 (3天2晚)',
            description: '春熙路→太古里→文殊院',
            status: '计划中',
            statusType: '',
            budget: 1000,
            people: 2
        },
        {
            id: 3,
            name: '熊猫一日游',
            date: '6月28日-28日 (1天)',
            description: '大熊猫繁育研究基地',
            status: '已完成',
            statusType: 'info',
            rating: 4.8,
            photos: 15
        }
    ],
    
    // 推荐景点
    recommendations: [
        {
            id: 1,
            name: '宽窄巷子',
            description: '成都最具代表性的历史文化街区',
            image: 'https://images.unsplash.com/photo-1591204076723-da8b0402ba3e?w=300&h=200&fit=crop',
            rating: 4.6,
            price: '免费'
        },
        {
            id: 2,
            name: '锦里古街',
            description: '西蜀历史上最古老的街道之一',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
            rating: 4.5,
            price: '免费'
        },
        {
            id: 3,
            name: '武侯祠',
            description: '中国唯一君臣合祀祠庙',
            image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=300&h=200&fit=crop',
            rating: 4.7,
            price: '门票60元'
        }
    ],
    
    // 发现页面分类
    categories: [
        { name: '景点', icon: 'fas fa-landmark' },
        { name: '美食', icon: 'fas fa-utensils' },
        { name: '酒店', icon: 'fas fa-hotel' },
        { name: '活动', icon: 'fas fa-calendar-star' },
        { name: '季节', icon: 'fas fa-leaf' },
        { name: '交通', icon: 'fas fa-subway' },
        { name: '茶馆', icon: 'fas fa-coffee' },
        { name: '购物', icon: 'fas fa-shopping-bag' },
        { name: '打卡', icon: 'fas fa-camera' },
        { name: '演出', icon: 'fas fa-theater-masks' }
    ]
};

// 添加消息提示的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);

// 创建底部导航组件
function createBottomNavigation(activePage) {
    const navigation = document.createElement('div');
    navigation.className = 'bottom-navigation';
    navigation.innerHTML = `
        <a href="${AppConfig.pages.home}" class="nav-item ${activePage === 'home' ? 'active' : ''}">
            <i class="fas fa-home"></i>
            <span>首页</span>
        </a>
        <a href="${AppConfig.pages.discover}" class="nav-item ${activePage === 'discover' ? 'active' : ''}">
            <i class="fas fa-compass"></i>
            <span>发现</span>
        </a>
        <a href="${AppConfig.pages.chat}" class="nav-item ${activePage === 'chat' ? 'active' : ''}">
            <i class="fas fa-robot"></i>
            <span>规划</span>
        </a>
        <a href="${AppConfig.pages.trips}" class="nav-item ${activePage === 'trips' ? 'active' : ''}">
            <i class="fas fa-list"></i>
            <span>行程</span>
        </a>
        <a href="${AppConfig.pages.profile}" class="nav-item ${activePage === 'profile' ? 'active' : ''}">
            <i class="fas fa-user"></i>
            <span>我的</span>
        </a>
    `;
    return navigation;
}

// 页面加载完成后的通用初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.classList.add('fade-in');
    
    // 为所有返回按钮添加事件监听
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Navigation.back();
        });
    });
}); 