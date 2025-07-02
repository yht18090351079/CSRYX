// 方案详情页面逻辑
let currentPlan = null;
let currentTab = 'itinerary';

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPlanDetailPage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('trips');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 加载方案数据
    loadPlanData();
    
    // 渲染页面内容
    renderPlanOverview();
    renderTabContent();
});

// 初始化方案详情页面
function initPlanDetailPage() {
    console.log('初始化方案详情页面');
}

// 加载方案数据
function loadPlanData() {
    // 从localStorage获取选中的方案
    const selectedPlan = Storage.get('selectedPlan');
    const selectedPlanId = Storage.get('selectedPlanId');
    
    if (selectedPlan) {
        currentPlan = selectedPlan;
    } else {
        // 如果没有选中方案，使用默认的文化深度游方案
        currentPlan = MockData.travelPlans.find(p => p.name.includes('文化')) || MockData.travelPlans[0];
    }
    
    // 增强方案数据
    currentPlan = enhancePlanData(currentPlan);
}

// 增强方案数据
function enhancePlanData(plan) {
    return {
        ...plan,
        icon: getIconForPlan(plan),
        detailedItinerary: generateDetailedItinerary(plan),
        attractions: generateAttractionsData(plan),
        budgetBreakdown: generateBudgetBreakdown(plan),
        tips: generateTipsData(plan)
    };
}

// 获取方案图标
function getIconForPlan(plan) {
    const icons = {
        '文化深度游': 'fas fa-landmark',
        '美食文化混搭': 'fas fa-utensils',
        '休闲慢生活': 'fas fa-coffee'
    };
    return icons[plan.name] || 'fas fa-map-marked-alt';
}

// 生成详细行程
function generateDetailedItinerary(plan) {
    const itinerary = [];
    
    if (plan.name.includes('文化')) {
        itinerary.push(
            {
                day: 1,
                date: '第一天',
                activities: [
                    { time: '08:30', location: '宽窄巷子', description: '感受老成都的慢生活，品尝传统早餐', tags: ['历史街区', '早餐'] },
                    { time: '10:30', location: '杜甫草堂', description: '诗圣文化圣地，感受诗词文化的魅力', tags: ['文化遗址', '诗词'] },
                    { time: '14:00', location: '武侯祠', description: '三国文化博物馆，了解蜀汉历史', tags: ['博物馆', '三国文化'] },
                    { time: '16:30', location: '锦里古街', description: '品味传统川味小食，购买特色纪念品', tags: ['古街', '小食'] },
                    { time: '19:00', location: '天府广场', description: '观赏夜景，品尝正宗成都火锅', tags: ['夜景', '火锅'] }
                ]
            },
            {
                day: 2,
                date: '第二天',
                activities: [
                    { time: '09:00', location: '金沙遗址博物馆', description: '古蜀文明探秘，了解成都3000年历史', tags: ['考古', '古蜀文化'] },
                    { time: '11:30', location: '青羊宫', description: '道教文化体验，感受道家清净', tags: ['道教', '文化体验'] },
                    { time: '14:00', location: '四川博物院', description: '巴蜀文化深度游，馆藏文物精品', tags: ['博物馆', '巴蜀文化'] },
                    { time: '16:30', location: '文殊院', description: '禅茶一味体验，品味素斋', tags: ['佛教', '茶文化'] },
                    { time: '18:30', location: '春熙路', description: '感受现代成都活力，购物休闲', tags: ['购物', '现代成都'] }
                ]
            },
            {
                day: 3,
                date: '第三天',
                activities: [
                    { time: '09:30', location: '大熊猫繁育基地', description: '与国宝亲密接触，了解熊猫文化', tags: ['大熊猫', '自然教育'] },
                    { time: '13:00', location: '成都博物馆', description: '成都通史展览，全面了解成都发展', tags: ['历史', '城市文化'] },
                    { time: '15:30', location: '人民公园', description: '体验成都茶馆文化，感受慢生活', tags: ['茶馆', '慢生活'] },
                    { time: '17:30', location: '九眼桥', description: '锦江夜游，观赏成都夜色', tags: ['夜游', '江景'] }
                ]
            }
        );
    } else if (plan.name.includes('美食')) {
        itinerary.push(
            {
                day: 1,
                date: '第一天',
                activities: [
                    { time: '08:30', location: '锦里小吃街', description: '传统川味早餐，钟水饺、龙抄手', tags: ['早餐', '传统小食'] },
                    { time: '10:30', location: '川菜博物馆', description: '了解川菜文化，亲手制作川菜', tags: ['川菜文化', '体验'] },
                    { time: '12:00', location: '老妈蹄花', description: '品尝地道成都火锅，体验火锅文化', tags: ['火锅', '地道美食'] },
                    { time: '15:00', location: '宽窄巷子', description: '茶馆品茶，品尝各种川味小食', tags: ['茶文化', '小食'] },
                    { time: '19:00', location: '九眼桥酒吧街', description: '夜宵与夜生活，烧烤串串', tags: ['夜宵', '夜生活'] }
                ]
            }
        );
    } else {
        itinerary.push(
            {
                day: 1,
                date: '第一天',
                activities: [
                    { time: '09:30', location: '人民公园', description: '体验成都茶馆文化，感受慢节奏生活', tags: ['茶馆', '慢生活'] },
                    { time: '11:30', location: '杜甫草堂', description: '静心赏诗，感受文人雅致', tags: ['诗词', '文化'] },
                    { time: '14:30', location: '浣花溪公园', description: '漫步古韵公园，享受自然时光', tags: ['公园', '自然'] },
                    { time: '16:30', location: '宽窄巷子', description: '悠闲下午茶时光，品味慢生活', tags: ['下午茶', '休闲'] },
                    { time: '19:00', location: '锦江夜游', description: '江边散步，享受夜色', tags: ['夜景', '散步'] }
                ]
            }
        );
    }
    
    return itinerary.slice(0, plan.days);
}

// 生成景点数据
function generateAttractionsData(plan) {
    const baseAttractions = [
        {
            name: '宽窄巷子',
            description: '成都最具代表性的历史文化街区，保存着清朝古街道格局，体验老成都的慢生活',
            rating: '4.8',
            features: ['历史文化', '传统建筑', '特色小食', '手工艺品'],
            duration: '2-3小时',
            ticket: '免费',
            icon: 'fas fa-home'
        },
        {
            name: '杜甫草堂',
            description: '诗圣杜甫的故居，中国文学史上的重要圣地，感受诗词文化的深厚底蕴',
            rating: '4.7',
            features: ['诗词文化', '园林建筑', '文物展览', '静谧环境'],
            duration: '1.5-2小时',
            ticket: '¥60',
            icon: 'fas fa-feather-alt'
        },
        {
            name: '武侯祠',
            description: '中国唯一的君臣合祀祠庙，三国文化圣地，了解蜀汉历史的最佳去处',
            rating: '4.6',
            features: ['三国文化', '古建筑群', '历史文物', '园林景观'],
            duration: '2小时',
            ticket: '¥60',
            icon: 'fas fa-crown'
        },
        {
            name: '金沙遗址博物馆',
            description: '古蜀文明的重要遗址，展示了3000年前成都平原的繁荣景象',
            rating: '4.8',
            features: ['考古文物', '古蜀文化', '互动体验', '现代展陈'],
            duration: '2-3小时',
            ticket: '¥80',
            icon: 'fas fa-gem'
        }
    ];
    
    if (plan.name.includes('文化')) {
        return baseAttractions;
    } else if (plan.name.includes('美食')) {
        return [
            {
                name: '锦里古街',
                description: '成都著名的美食街区，汇集了各种传统川味小食和特色餐厅',
                rating: '4.5',
                features: ['传统小食', '川菜餐厅', '民俗表演', '手工艺品'],
                duration: '2-3小时',
                ticket: '免费',
                icon: 'fas fa-utensils'
            },
            {
                name: '川菜博物馆',
                description: '世界唯一以菜系文化为主题的博物馆，体验川菜文化的博大精深',
                rating: '4.7',
                features: ['川菜文化', '烹饪体验', '美食品尝', '文化展览'],
                duration: '3-4小时',
                ticket: '¥60',
                icon: 'fas fa-pepper-hot'
            }
        ];
    } else {
        return [
            {
                name: '人民公园',
                description: '成都人休闲生活的缩影，体验地道的茶馆文化和慢节奏生活',
                rating: '4.6',
                features: ['茶馆文化', '园林景观', '休闲娱乐', '民俗活动'],
                duration: '1-2小时',
                ticket: '免费',
                icon: 'fas fa-leaf'
            },
            {
                name: '浣花溪公园',
                description: '成都最大的开放性城市森林公园，享受自然时光的绝佳去处',
                rating: '4.5',
                features: ['自然景观', '休闲步道', '湖光山色', '空气清新'],
                duration: '2-3小时',
                ticket: '免费',
                icon: 'fas fa-tree'
            }
        ];
    }
}

// 生成费用分解
function generateBudgetBreakdown(plan) {
    const totalBudget = plan.budget;
    let breakdown = [];
    
    if (plan.name.includes('文化')) {
        breakdown = [
            { 
                category: '门票费用', 
                icon: 'fas fa-ticket-alt', 
                amount: Math.round(totalBudget * 0.25), 
                percentage: 25,
                description: '各景点门票费用',
                details: ['杜甫草堂 ¥60', '武侯祠 ¥60', '金沙遗址 ¥80', '其他景点 ¥95']
            },
            { 
                category: '餐饮费用', 
                icon: 'fas fa-utensils', 
                amount: Math.round(totalBudget * 0.35), 
                percentage: 35,
                description: '正餐、小食、饮品费用',
                details: ['正餐 ¥400', '小食 ¥120', '饮品 ¥80', '火锅 ¥150']
            },
            { 
                category: '交通费用', 
                icon: 'fas fa-bus', 
                amount: Math.round(totalBudget * 0.20), 
                percentage: 20,
                description: '市内交通出行费用',
                details: ['地铁/公交 ¥60', '打车费用 ¥200', '其他交通 ¥56']
            },
            { 
                category: '住宿费用', 
                icon: 'fas fa-bed', 
                amount: Math.round(totalBudget * 0.15), 
                percentage: 15,
                description: '酒店住宿费用',
                details: ['经济型酒店', '2晚住宿']
            },
            { 
                category: '购物娱乐', 
                icon: 'fas fa-shopping-bag', 
                amount: Math.round(totalBudget * 0.05), 
                percentage: 5,
                description: '纪念品及娱乐费用',
                details: ['纪念品', '其他消费']
            }
        ];
    } else if (plan.name.includes('美食')) {
        breakdown = [
            { 
                category: '餐饮费用', 
                icon: 'fas fa-utensils', 
                amount: Math.round(totalBudget * 0.50), 
                percentage: 50,
                description: '各类美食体验费用',
                details: ['火锅 ¥200', '川菜 ¥150', '小食 ¥100', '特色餐厅 ¥180']
            },
            { 
                category: '交通费用', 
                icon: 'fas fa-bus', 
                amount: Math.round(totalBudget * 0.20), 
                percentage: 20,
                description: '美食探访交通费',
                details: ['打车 ¥180', '地铁/公交 ¥40']
            },
            { 
                category: '住宿费用', 
                icon: 'fas fa-bed', 
                amount: Math.round(totalBudget * 0.20), 
                percentage: 20,
                description: '酒店住宿费用',
                details: ['精品酒店', '2晚住宿']
            },
            { 
                category: '体验活动', 
                icon: 'fas fa-star', 
                amount: Math.round(totalBudget * 0.08), 
                percentage: 8,
                description: '烹饪体验等活动',
                details: ['川菜制作体验', '茶艺体验']
            },
            { 
                category: '其他费用', 
                icon: 'fas fa-shopping-bag', 
                amount: Math.round(totalBudget * 0.02), 
                percentage: 2,
                description: '杂项费用',
                details: ['小费', '其他']
            }
        ];
    } else {
        breakdown = [
            { 
                category: '住宿费用', 
                icon: 'fas fa-bed', 
                amount: Math.round(totalBudget * 0.30), 
                percentage: 30,
                description: '舒适酒店住宿',
                details: ['度假酒店', '2晚住宿']
            },
            { 
                category: '餐饮费用', 
                icon: 'fas fa-utensils', 
                amount: Math.round(totalBudget * 0.30), 
                percentage: 30,
                description: '休闲餐饮费用',
                details: ['茶馆 ¥80', '轻餐 ¥120', '正餐 ¥150']
            },
            { 
                category: '交通费用', 
                icon: 'fas fa-bus', 
                amount: Math.round(totalBudget * 0.20), 
                percentage: 20,
                description: '舒适出行交通',
                details: ['打车为主', '舒适出行']
            },
            { 
                category: '休闲活动', 
                icon: 'fas fa-leaf', 
                amount: Math.round(totalBudget * 0.15), 
                percentage: 15,
                description: 'SPA、按摩等',
                details: ['SPA ¥100', '按摩 ¥80']
            },
            { 
                category: '其他费用', 
                icon: 'fas fa-shopping-bag', 
                amount: Math.round(totalBudget * 0.05), 
                percentage: 5,
                description: '杂项消费',
                details: ['小费', '其他']
            }
        ];
    }
    
    return breakdown;
}

// 生成贴心提醒
function generateTipsData(plan) {
    return {
        preparation: {
            title: '出行准备',
            icon: 'fas fa-suitcase',
            tips: [
                '成都天气变化较大，建议携带雨具和薄外套',
                '舒适的步行鞋是必需品，景点需要较多步行',
                '准备好身份证，部分景点需要实名制预约',
                '下载成都地铁APP，方便出行导航'
            ]
        },
        dining: {
            title: '饮食建议',
            icon: 'fas fa-utensils',
            tips: [
                '成都菜品偏辣，不习惯辣味的游客可要求微辣',
                '推荐尝试火锅、担担面、夫妻肺片等特色美食',
                '饮食安全第一，选择卫生条件良好的餐厅',
                '多饮水，川菜较为刺激，注意肠胃健康'
            ]
        },
        transport: {
            title: '交通出行',
            icon: 'fas fa-bus',
            tips: [
                '成都地铁四通八达，推荐使用地铁出行',
                '避开早晚高峰期，合理安排出行时间',
                '打车软件在成都使用便利，备选出行方式',
                '部分景点停车不便，建议公共交通出行'
            ]
        },
        culture: {
            title: '文化礼仪',
            icon: 'fas fa-heart',
            tips: [
                '参观寺庙道观时请保持安静，尊重宗教场所',
                '拍照前询问是否允许，尊重当地文化',
                '体验茶馆文化时，入乡随俗享受慢生活',
                '与当地人交流时保持友善，成都人热情好客'
            ]
        }
    };
}

// 渲染方案概览
function renderPlanOverview() {
    if (!currentPlan) return;
    
    // 更新页面标题
    document.getElementById('planTitle').textContent = currentPlan.name;
    document.getElementById('planName').textContent = currentPlan.name;
    document.getElementById('planSubtitle').textContent = currentPlan.advantages;
    
    // 更新图标
    const iconElement = document.getElementById('planIcon');
    iconElement.className = currentPlan.icon;
    
    // 更新标签
    const tagsContainer = document.getElementById('planTags');
    const tags = generatePlanTags(currentPlan);
    tagsContainer.innerHTML = tags.map(tag => 
        `<span class="tag tag-primary">${tag}</span>`
    ).join('');
    
    // 更新摘要信息
    document.getElementById('planDays').textContent = `${currentPlan.days}天${currentPlan.days - 1}晚`;
    document.getElementById('planBudget').textContent = `¥${currentPlan.budget}`;
    document.getElementById('planSpots').textContent = `${currentPlan.culturalSpots || 6}个景点`;
    document.getElementById('planFood').textContent = `${currentPlan.foodSpots || 5}处美食`;
}

// 生成方案标签
function generatePlanTags(plan) {
    const tags = [];
    
    if (plan.name.includes('文化')) tags.push('历史文化');
    if (plan.name.includes('美食')) tags.push('美食体验');
    if (plan.name.includes('休闲')) tags.push('慢生活');
    
    tags.push(`${plan.intensity}强度`);
    tags.push(`${plan.days}天行程`);
    
    return tags;
}

// 切换标签页
function switchTab(tab) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    currentTab = tab;
    renderTabContent();
}

// 渲染标签页内容
function renderTabContent() {
    const container = document.getElementById('tabContent');
    if (!container || !currentPlan) return;
    
    let content = '';
    
    switch (currentTab) {
        case 'itinerary':
            content = renderItineraryContent();
            break;
        case 'attractions':
            content = renderAttractionsContent();
            break;
        case 'budget':
            content = renderBudgetContent();
            break;
        case 'tips':
            content = renderTipsContent();
            break;
        default:
            content = renderItineraryContent();
    }
    
    container.innerHTML = content;
}

// 渲染行程内容
function renderItineraryContent() {
    if (!currentPlan.detailedItinerary) return '<div class="loading-content"><i class="fas fa-spinner"></i><p>加载中...</p></div>';
    
    return `
        <div class="itinerary-content">
            ${currentPlan.detailedItinerary.map(day => `
                <div class="day-timeline">
                    <div class="day-header">
                        <div class="day-number">第${day.day}天</div>
                        <div class="day-date">${day.date}</div>
                    </div>
                    ${day.activities.map(activity => `
                        <div class="timeline-item">
                            <div class="timeline-time">${activity.time}</div>
                            <div class="timeline-location">${activity.location}</div>
                            <div class="timeline-description">${activity.description}</div>
                            <div class="timeline-tags">
                                ${activity.tags.map(tag => `<span class="tag tag-secondary">${tag}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染景点内容
function renderAttractionsContent() {
    if (!currentPlan.attractions) return '<div class="loading-content"><i class="fas fa-spinner"></i><p>加载中...</p></div>';
    
    return `
        <div class="attractions-content">
            ${currentPlan.attractions.map(attraction => `
                <div class="attraction-card">
                    <div class="attraction-image">
                        <i class="${attraction.icon}"></i>
                        <div class="attraction-rating">
                            <i class="fas fa-star"></i> ${attraction.rating}
                        </div>
                    </div>
                    <div class="attraction-info">
                        <h3 class="attraction-name">${attraction.name}</h3>
                        <p class="attraction-desc">${attraction.description}</p>
                        <div class="attraction-features">
                            ${attraction.features.map(feature => `<span class="tag tag-accent">${feature}</span>`).join('')}
                        </div>
                        <div class="attraction-meta">
                            <span><i class="fas fa-clock"></i> ${attraction.duration}</span>
                            <span><i class="fas fa-ticket-alt"></i> ${attraction.ticket}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染费用内容
function renderBudgetContent() {
    if (!currentPlan.budgetBreakdown) return '<div class="loading-content"><i class="fas fa-spinner"></i><p>加载中...</p></div>';
    
    return `
        <div class="budget-content">
            <div class="budget-total">
                <div class="total-amount">¥${currentPlan.budget}</div>
                <div class="total-label">总预算</div>
            </div>
            <div class="budget-breakdown">
                ${currentPlan.budgetBreakdown.map(item => `
                    <div class="budget-item">
                        <div class="budget-category">
                            <i class="${item.icon}"></i>
                            <div class="category-info">
                                <div class="category-name">${item.category}</div>
                                <div class="category-desc">${item.description}</div>
                            </div>
                        </div>
                        <div class="budget-amount">
                            <div class="amount-value">¥${item.amount}</div>
                            <div class="amount-percentage">${item.percentage}%</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 渲染贴心提醒内容
function renderTipsContent() {
    if (!currentPlan.tips) return '<div class="loading-content"><i class="fas fa-spinner"></i><p>加载中...</p></div>';
    
    return `
        <div class="tips-content">
            ${Object.values(currentPlan.tips).map(category => `
                <div class="tip-category">
                    <div class="tip-category-header">
                        <i class="${category.icon}"></i>
                        <span>${category.title}</span>
                    </div>
                    <div class="tip-list">
                        ${category.tips.map(tip => `
                            <div class="tip-item">
                                <div class="tip-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="tip-text">${tip}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 分享方案
function sharePlan() {
    if (!currentPlan) {
        showSuccessPopup('错误', '没有可分享的方案');
        return;
    }
    
    // 模拟分享功能
    const shareText = `我在蓉易行发现了一个不错的${currentPlan.name}方案，${currentPlan.days}天只需¥${currentPlan.budget}！`;
    
    if (navigator.share) {
        navigator.share({
            title: `蓉易行 - ${currentPlan.name}`,
            text: shareText,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccessPopup('分享成功', '链接已复制到剪贴板');
        });
    }
}

// 添加到日历
function addToCalendar() {
    if (!currentPlan) return;
    
    // 模拟添加到日历功能
    showSuccessPopup('添加成功', '行程已添加到您的日历');
    
    // 实际实现中可以调用日历API
    console.log('添加到日历:', currentPlan.name);
}

// 开始旅程
function startJourney() {
    if (!currentPlan) return;
    
    // 保存当前方案到我的行程
    Storage.set('currentTrip', currentPlan);
    Storage.set('tripStatus', 'active');
    
    showSuccessPopup('准备就绪', '旅程即将开始！');
    
    setTimeout(() => {
        Navigation.goTo('todo');
    }, 1500);
}

// 显示成功提示
function showSuccessPopup(title, message) {
    const popup = document.getElementById('successPopup');
    const messageElement = document.getElementById('successMessage');
    
    popup.querySelector('h3').textContent = title;
    messageElement.textContent = message;
    
    popup.style.display = 'flex';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

// 处理键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popup = document.getElementById('successPopup');
        if (popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    }
});

// 点击弹窗外部关闭
document.addEventListener('click', function(e) {
    const popup = document.getElementById('successPopup');
    if (e.target === popup) {
        popup.style.display = 'none';
    }
}); 