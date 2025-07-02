// 方案对比页面逻辑
let plans = [];
let selectedPlanId = null;
let currentTab = 'overview';

document.addEventListener('DOMContentLoaded', function() {
    // 初始化对比页面
    initComparePage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('chat');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 加载方案数据
    loadPlans();
    
    // 渲染页面内容
    renderPlans();
    renderTabContent();
});

// 初始化对比页面
function initComparePage() {
    selectedPlanId = null;
    updateSelectionState();
}

// 加载方案数据
function loadPlans() {
    plans = Storage.get('generatedPlans', MockData.travelPlans);
    
    plans = plans.map((plan, index) => ({
        ...plan,
        id: plan.id || (index + 1),
        recommended: index === 0,
        icon: getIconForPlan(plan),
        highlights: generateHighlights(plan),
        tags: generateTags(plan)
    }));
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

// 生成方案亮点
function generateHighlights(plan) {
    const baseHighlights = [
        { icon: 'fas fa-clock', text: `${plan.days}天${plan.days - 1}晚` },
        { icon: 'fas fa-dollar-sign', text: `预算¥${plan.budget}` }
    ];
    
    if (plan.name.includes('文化')) {
        baseHighlights.push(
            { icon: 'fas fa-landmark', text: `${plan.culturalSpots}个文化景点` },
            { icon: 'fas fa-history', text: '深度历史体验' }
        );
    } else if (plan.name.includes('美食')) {
        baseHighlights.push(
            { icon: 'fas fa-utensils', text: `${plan.foodSpots}家特色餐厅` },
            { icon: 'fas fa-pepper-hot', text: '地道川菜体验' }
        );
    } else {
        baseHighlights.push(
            { icon: 'fas fa-leaf', text: '悠闲慢节奏' },
            { icon: 'fas fa-coffee', text: '茶馆文化体验' }
        );
    }
    
    return baseHighlights;
}

// 生成方案标签
function generateTags(plan) {
    const allTags = [];
    
    if (plan.intensity === '轻松') allTags.push('轻松');
    else if (plan.intensity === '中等') allTags.push('适中');
    else allTags.push('丰富');
    
    if (plan.name.includes('文化')) allTags.push('历史文化');
    if (plan.name.includes('美食')) allTags.push('美食体验');
    if (plan.name.includes('休闲')) allTags.push('慢生活');
    
    allTags.push(`${plan.days}天行程`);
    
    return allTags;
}

// 生成行程安排
function generateScheduleDays(plan) {
    const days = [];
    
    if (plan.name.includes('文化')) {
        days.push(
            {
                activities: [
                    { time: '08:30', name: '宽窄巷子', description: '感受老成都的慢生活' },
                    { time: '10:30', name: '杜甫草堂', description: '诗圣文化圣地' },
                    { time: '14:00', name: '武侯祠', description: '三国文化博物馆' },
                    { time: '16:30', name: '锦里古街', description: '品味传统川味小食' },
                    { time: '19:00', name: '天府广场', description: '观赏夜景，品尝火锅' }
                ]
            },
            {
                activities: [
                    { time: '09:00', name: '金沙遗址博物馆', description: '古蜀文明探秘' },
                    { time: '11:30', name: '青羊宫', description: '道教文化体验' },
                    { time: '14:00', name: '四川博物院', description: '巴蜀文化深度游' },
                    { time: '16:30', name: '文殊院', description: '禅茶一味体验' },
                    { time: '18:30', name: '春熙路', description: '感受现代成都活力' }
                ]
            }
        );
    } else if (plan.name.includes('美食')) {
        days.push(
            {
                activities: [
                    { time: '08:30', name: '锦里小吃街', description: '传统川味早餐' },
                    { time: '10:30', name: '川菜博物馆', description: '了解川菜文化' },
                    { time: '12:00', name: '正宗火锅体验', description: '地道成都火锅' },
                    { time: '15:00', name: '宽窄巷子', description: '茶馆品茶，小食体验' },
                    { time: '19:00', name: '九眼桥酒吧街', description: '夜宵与夜生活' }
                ]
            },
            {
                activities: [
                    { time: '09:00', name: '彭州蒸蒸糕', description: '特色早点' },
                    { time: '11:00', name: '麻婆豆腐发源地', description: '品尝正宗麻婆豆腐' },
                    { time: '13:30', name: '老码头火锅', description: '江湖火锅体验' },
                    { time: '16:00', name: '夫妻肺片老店', description: '传统凉菜制作' },
                    { time: '18:30', name: '串串香体验', description: '成都人的深夜食堂' }
                ]
            }
        );
    } else {
        days.push(
            {
                activities: [
                    { time: '09:30', name: '人民公园', description: '体验成都茶馆文化' },
                    { time: '11:30', name: '杜甫草堂', description: '静心赏诗' },
                    { time: '14:30', name: '浣花溪公园', description: '漫步古韵公园' },
                    { time: '16:30', name: '宽窄巷子', description: '悠闲下午茶时光' },
                    { time: '19:00', name: '锦江夜游', description: '江边散步，享受夜色' }
                ]
            },
            {
                activities: [
                    { time: '10:00', name: '青城山', description: '道教名山，清新自然' },
                    { time: '12:30', name: '都江堰', description: '古代水利工程奇观' },
                    { time: '15:00', name: '街子古镇', description: '古镇慢生活体验' },
                    { time: '17:30', name: '回到市区', description: '温泉放松' },
                    { time: '19:30', name: '文殊院', description: '素斋与禅茶' }
                ]
            }
        );
    }
    
    return days.slice(0, plan.days);
}

// 生成费用分解
function generateBudgetBreakdown(plan) {
    const totalBudget = plan.budget;
    let breakdown = [];
    
    if (plan.name.includes('文化')) {
        breakdown = [
            { category: '门票费用', icon: 'fas fa-ticket-alt', amount: Math.round(totalBudget * 0.25), percentage: 25 },
            { category: '餐饮费用', icon: 'fas fa-utensils', amount: Math.round(totalBudget * 0.35), percentage: 35 },
            { category: '交通费用', icon: 'fas fa-bus', amount: Math.round(totalBudget * 0.20), percentage: 20 },
            { category: '住宿费用', icon: 'fas fa-bed', amount: Math.round(totalBudget * 0.15), percentage: 15 },
            { category: '其他费用', icon: 'fas fa-shopping-bag', amount: Math.round(totalBudget * 0.05), percentage: 5 }
        ];
    } else if (plan.name.includes('美食')) {
        breakdown = [
            { category: '餐饮费用', icon: 'fas fa-utensils', amount: Math.round(totalBudget * 0.50), percentage: 50 },
            { category: '交通费用', icon: 'fas fa-bus', amount: Math.round(totalBudget * 0.20), percentage: 20 },
            { category: '住宿费用', icon: 'fas fa-bed', amount: Math.round(totalBudget * 0.20), percentage: 20 },
            { category: '体验活动', icon: 'fas fa-star', amount: Math.round(totalBudget * 0.08), percentage: 8 },
            { category: '其他费用', icon: 'fas fa-shopping-bag', amount: Math.round(totalBudget * 0.02), percentage: 2 }
        ];
    } else {
        breakdown = [
            { category: '住宿费用', icon: 'fas fa-bed', amount: Math.round(totalBudget * 0.30), percentage: 30 },
            { category: '餐饮费用', icon: 'fas fa-utensils', amount: Math.round(totalBudget * 0.30), percentage: 30 },
            { category: '交通费用', icon: 'fas fa-bus', amount: Math.round(totalBudget * 0.20), percentage: 20 },
            { category: '休闲活动', icon: 'fas fa-leaf', amount: Math.round(totalBudget * 0.15), percentage: 15 },
            { category: '其他费用', icon: 'fas fa-shopping-bag', amount: Math.round(totalBudget * 0.05), percentage: 5 }
        ];
    }
    
    return breakdown;
}

// 生成方案特色
function generatePlanFeatures(plan) {
    let features = {
        highlights: [],
        experiences: []
    };
    
    if (plan.name.includes('文化')) {
        features.highlights = ['深度文化体验', '历史遗迹探访', '传统工艺学习', '诗词文化感受'];
        features.experiences = [
            { icon: 'fas fa-landmark', title: '古迹探访', description: '走进成都的历史长河，感受千年文化底蕴' },
            { icon: 'fas fa-brush', title: '传统工艺', description: '亲手体验蜀绣、漆器等传统手工艺' },
            { icon: 'fas fa-book', title: '诗词文化', description: '在杜甫草堂感受诗圣的文化气息' },
            { icon: 'fas fa-yin-yang', title: '道教文化', description: '青羊宫、文殊院体验宗教文化' }
        ];
    } else if (plan.name.includes('美食')) {
        features.highlights = ['地道川味', '火锅文化', '小食体验', '夜宵文化'];
        features.experiences = [
            { icon: 'fas fa-pepper-hot', title: '川菜精髓', description: '品尝最正宗的麻婆豆腐、宫保鸡丁' },
            { icon: 'fas fa-fire', title: '火锅文化', description: '体验成都人的火锅社交文化' },
            { icon: 'fas fa-ice-cream', title: '街头小食', description: '钟水饺、龙抄手等传统小食' },
            { icon: 'fas fa-moon', title: '夜宵文化', description: '九眼桥的深夜美食之旅' }
        ];
    } else {
        features.highlights = ['慢节奏生活', '茶馆文化', '自然风光', '禅意体验'];
        features.experiences = [
            { icon: 'fas fa-leaf', title: '慢生活', description: '在人民公园体验成都人的悠闲生活' },
            { icon: 'fas fa-coffee', title: '茶馆文化', description: '品茶聊天，感受成都的慢时光' },
            { icon: 'fas fa-mountain', title: '自然风光', description: '青城山都江堰的自然之美' },
            { icon: 'fas fa-spa', title: '身心放松', description: '温泉、按摩等休闲体验' }
        ];
    }
    
    return features;
}

// 选择方案
function selectPlan(planId) {
    // 移除之前选中的状态
    const previousSelected = document.querySelector('.plan-card.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
        updatePlanButton(previousSelected, false);
    }
    
    // 选择新方案
    const selectedCard = document.querySelector(`[data-plan-id="${planId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        updatePlanButton(selectedCard, true);
    }
    
    selectedPlanId = planId;
    updateSelectionState();
    
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
        console.log(`已选择：${selectedPlan.name}`);
    }
}

// 更新方案按钮状态
function updatePlanButton(cardElement, isSelected) {
    const button = cardElement.querySelector('.plan-select-btn');
    
    if (isSelected) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        button.innerHTML = '<i class="fas fa-check"></i> 已选择';
    } else {
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        button.innerHTML = '<span class="btn-text">选择此方案</span>';
    }
}

// 更新选择状态
function updateSelectionState() {
    const selectionInfo = document.getElementById('selectionInfo');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectBtn = document.getElementById('selectPlanBtn');
    
    if (selectedPlanId) {
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        if (selectedPlan) {
            selectionInfo.style.display = 'block';
            selectedPlanName.textContent = `已选择：${selectedPlan.name}`;
            selectBtn.disabled = false;
        }
    } else {
        selectionInfo.style.display = 'none';
        selectBtn.disabled = true;
    }
}

// 渲染方案卡片
function renderPlans() {
    const container = document.getElementById('plansContainer');
    
    if (!container) return;
    
    container.innerHTML = plans.map(plan => `
        <div class="plan-card ${plan.recommended ? 'recommended' : ''}" 
             data-plan-id="${plan.id}" onclick="selectPlan(${plan.id})">
            ${plan.recommended ? '<div class="plan-recommended">推荐</div>' : ''}
            
            <div class="plan-header">
                <div class="plan-title">
                    <i class="${plan.icon}"></i>
                    ${plan.name}
                </div>
                <div class="plan-subtitle">${plan.advantages}</div>
                <div class="plan-quick-info">
                    <div class="plan-budget">¥${plan.budget}</div>
                    <div class="plan-duration">${plan.days}天${plan.days - 1}晚</div>
                </div>
            </div>
            
            <div class="plan-content">
                <div class="plan-highlights">
                    ${plan.highlights.map(item => `
                        <div class="highlight-item">
                            <i class="${item.icon}"></i>
                            <span>${item.text}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="plan-tags">
                    ${plan.tags.map(tag => `
                        <span class="tag tag-primary">${tag}</span>
                    `).join('')}
                </div>
                
                <div class="plan-advantages">
                    <div class="advantages-title">适合人群</div>
                    <div class="advantages-text">${plan.suitableFor}</div>
                </div>
                
                <button class="btn btn-primary plan-select-btn">
                    <span class="btn-text">选择此方案</span>
                </button>
            </div>
        </div>
    `).join('');
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
    if (!container) return;
    
    let content = '';
    
    switch (currentTab) {
        case 'overview':
            content = renderOverviewComparison();
            break;
        case 'schedule':
            content = renderScheduleComparison();
            break;
        case 'budget':
            content = renderBudgetComparison();
            break;
        case 'features':
            content = renderFeaturesComparison();
            break;
        default:
            content = renderOverviewComparison();
    }
    
    container.innerHTML = content;
}

// 渲染概览对比
function renderOverviewComparison() {
    return `
        <div class="overview-comparison">
            ${plans.map((plan, index) => `
                <div class="overview-item ${plan.recommended ? 'recommended' : ''}">
                    <div class="overview-icon">
                        <i class="${plan.icon}"></i>
                    </div>
                    <div class="overview-title">${plan.name}</div>
                    <div class="overview-value">¥${plan.budget}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染行程对比
function renderScheduleComparison() {
    return `
        <div class="schedule-comparison">
            ${plans.map(plan => `
                <div class="schedule-plan">
                    <div class="schedule-header">
                        <i class="${plan.icon}"></i>
                        <span class="plan-name">${plan.name}</span>
                        <span class="plan-duration">${plan.days}天</span>
                    </div>
                    <div class="schedule-days">
                        ${generateScheduleDays(plan).map((day, index) => `
                            <div class="schedule-day">
                                <div class="day-title">
                                    <i class="fas fa-calendar-day"></i>
                                    第${index + 1}天
                                </div>
                                <div class="day-activities">
                                    ${day.activities.map(activity => `
                                        <div class="activity-item">
                                            <div class="activity-time">${activity.time}</div>
                                            <div class="activity-content">
                                                <div class="activity-name">${activity.name}</div>
                                                <div class="activity-desc">${activity.description}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染费用对比
function renderBudgetComparison() {
    return `
        <div class="budget-comparison">
            ${plans.map(plan => {
                const budgetBreakdown = generateBudgetBreakdown(plan);
                return `
                    <div class="budget-plan">
                        <div class="budget-header">
                            <i class="${plan.icon}"></i>
                            <div class="budget-info">
                                <div class="plan-name">${plan.name}</div>
                                <div class="total-budget">总计：¥${plan.budget}</div>
                            </div>
                        </div>
                        <div class="budget-breakdown">
                            ${budgetBreakdown.map(item => `
                                <div class="budget-item">
                                    <div class="budget-category">
                                        <i class="${item.icon}"></i>
                                        <span>${item.category}</span>
                                    </div>
                                    <div class="budget-amount">¥${item.amount}</div>
                                    <div class="budget-percentage">${item.percentage}%</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="budget-tips">
                            <div class="tips-title">
                                <i class="fas fa-lightbulb"></i>
                                省钱小贴士
                            </div>
                            <div class="tips-content">${plan.budgetTips || '合理规划，享受性价比之旅'}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 渲染特色对比
function renderFeaturesComparison() {
    return `
        <div class="features-comparison">
            ${plans.map(plan => {
                const features = generatePlanFeatures(plan);
                return `
                    <div class="features-plan">
                        <div class="features-header">
                            <i class="${plan.icon}"></i>
                            <div class="plan-info">
                                <div class="plan-name">${plan.name}</div>
                                <div class="plan-theme">${plan.theme || '独特体验'}</div>
                            </div>
                        </div>
                        <div class="features-content">
                            <div class="highlights-section">
                                <div class="section-title">
                                    <i class="fas fa-star"></i>
                                    核心亮点
                                </div>
                                <div class="highlights-list">
                                    ${features.highlights.map(highlight => `
                                        <div class="highlight-tag">${highlight}</div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="experience-section">
                                <div class="section-title">
                                    <i class="fas fa-heart"></i>
                                    体验特色
                                </div>
                                <div class="experience-list">
                                    ${features.experiences.map(exp => `
                                        <div class="experience-item">
                                            <i class="${exp.icon}"></i>
                                            <div class="exp-content">
                                                <div class="exp-title">${exp.title}</div>
                                                <div class="exp-desc">${exp.description}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="suitable-section">
                                <div class="section-title">
                                    <i class="fas fa-users"></i>
                                    适合人群
                                </div>
                                <div class="suitable-text">${plan.suitableFor}</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 显示详细对比弹窗
function showDetailedComparison() {
    const modal = document.getElementById('detailedModal');
    const tableContainer = document.getElementById('comparisonTable');
    
    // 渲染对比表格
    tableContainer.innerHTML = `
        <div class="comparison-row">
            <div class="row-label">方案名称</div>
            <div class="row-values">
                ${plans.map(plan => `
                    <div class="value-item">${plan.name}</div>
                `).join('')}
            </div>
        </div>
        <div class="comparison-row">
            <div class="row-label">总预算</div>
            <div class="row-values">
                ${plans.map((plan, index) => `
                    <div class="value-item ${index === 0 ? 'best' : ''}">¥${plan.budget}</div>
                `).join('')}
            </div>
        </div>
        <div class="comparison-row">
            <div class="row-label">行程天数</div>
            <div class="row-values">
                ${plans.map(plan => `
                    <div class="value-item">${plan.days}天</div>
                `).join('')}
            </div>
        </div>
        <div class="comparison-row">
            <div class="row-label">文化景点</div>
            <div class="row-values">
                ${plans.map((plan, index) => `
                    <div class="value-item ${plan.culturalSpots === Math.max(...plans.map(p => p.culturalSpots)) ? 'best' : ''}">${plan.culturalSpots}个</div>
                `).join('')}
            </div>
        </div>
        <div class="comparison-row">
            <div class="row-label">美食体验</div>
            <div class="row-values">
                ${plans.map((plan, index) => `
                    <div class="value-item ${plan.foodSpots === Math.max(...plans.map(p => p.foodSpots)) ? 'best' : ''}">${plan.foodSpots}处</div>
                `).join('')}
            </div>
        </div>
        <div class="comparison-row">
            <div class="row-label">适合人群</div>
            <div class="row-values">
                ${plans.map(plan => `
                    <div class="value-item">${plan.suitableFor}</div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// 关闭详细对比弹窗
function closeDetailedModal() {
    const modal = document.getElementById('detailedModal');
    modal.style.display = 'none';
}

// 确认选择
function confirmSelection() {
    if (!selectedPlanId) {
        showMessage('error', '请先选择一个方案');
        return;
    }
    
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (!selectedPlan) {
        showMessage('error', '选择的方案不存在');
        return;
    }
    
    Storage.set('selectedPlan', selectedPlan);
    Storage.set('selectedPlanId', selectedPlanId);
    
    showMessage('success', '方案选择成功！正在跳转...');
    
    setTimeout(() => {
        Navigation.goTo('planDetail');
    }, 1000);
}

// 重新生成方案
function regeneratePlans() {
    if (confirm('确定要重新生成方案吗？当前的选择将会丢失。')) {
        Navigation.goTo('chat');
    }
}

// 处理键盘事件
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        closeDetailedModal();
    }
});

// 添加点击卡片外部取消选择的功能
document.addEventListener('click', function(e) {
    // 如果点击的不是方案卡片，则取消选择（可选功能）
    if (!e.target.closest('.plan-card') && !e.target.closest('.selection-actions')) {
        // 可以根据需要启用此功能
        // deselectAll();
    }
});

// 优化消息提示
function showMessage(type, text) {
    // 创建简单的消息提示
    const message = document.createElement('div');
    message.className = `message-toast ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}
 