// 聊天页面逻辑
let currentStep = 0;
let userAnswers = {};
let chatHistory = [];

// 问答流程配置
const chatFlow = [
    {
        id: 1,
        question: '您计划在成都停留几天呢？',
        type: 'options',
        options: [
            { id: '1day', icon: 'fas fa-calendar-day', title: '1天', desc: '一日游' },
            { id: '2-3days', icon: 'fas fa-calendar-alt', title: '2-3天', desc: '短期游' },
            { id: '4-5days', icon: 'fas fa-calendar-week', title: '4-5天', desc: '深度游' },
            { id: 'week', icon: 'fas fa-calendar', title: '一周以上', desc: '长期游' }
        ],
        quickReplies: ['2-3天', '4-5天', '一周']
    },
    {
        id: 2,
        question: '您的大概预算是多少呢？（每人）',
        type: 'options',
        options: [
            { id: 'budget1', icon: 'fas fa-coins', title: '500-1000元', desc: '经济实惠' },
            { id: 'budget2', icon: 'fas fa-dollar-sign', title: '1000-2000元', desc: '中等消费' },
            { id: 'budget3', icon: 'fas fa-money-bill', title: '2000-5000元', desc: '高品质游' },
            { id: 'budget4', icon: 'fas fa-gem', title: '5000元以上', desc: '奢华体验' }
        ],
        quickReplies: ['1000-2000元', '2000-5000元', '预算充足']
    },
    {
        id: 3,
        question: '您最感兴趣的是什么呢？（可多选）',
        type: 'multiple',
        options: [
            { id: 'culture', icon: 'fas fa-landmark', text: '历史文化景点' },
            { id: 'food', icon: 'fas fa-utensils', text: '地道成都美食' },
            { id: 'panda', icon: 'fas fa-heart', text: '可爱大熊猫' },
            { id: 'nature', icon: 'fas fa-mountain', text: '自然风光' },
            { id: 'shopping', icon: 'fas fa-shopping-bag', text: '购物娱乐' },
            { id: 'nightlife', icon: 'fas fa-moon', text: '夜生活体验' }
        ],
        quickReplies: ['历史文化', '成都美食', '大熊猫', '都想体验']
    },
    {
        id: 4,
        question: '您希望旅行的节奏是怎样的？',
        type: 'options',
        options: [
            { id: 'relaxed', icon: 'fas fa-coffee', title: '悠闲慢节奏', desc: '深度体验' },
            { id: 'moderate', icon: 'fas fa-walking', title: '适中节奏', desc: '有张有弛' },
            { id: 'intensive', icon: 'fas fa-running', title: '紧凑高效', desc: '多看多玩' },
            { id: 'flexible', icon: 'fas fa-random', title: '随性安排', desc: '看心情决定' }
        ],
        quickReplies: ['悠闲一些', '适中节奏', '紧凑一些']
    },
    {
        id: 5,
        question: '您比较在意哪些方面？（可多选）',
        type: 'multiple',
        options: [
            { id: 'transport', icon: 'fas fa-subway', text: '交通便利' },
            { id: 'photo', icon: 'fas fa-camera', text: '拍照打卡' },
            { id: 'authentic', icon: 'fas fa-star', text: '地道体验' },
            { id: 'comfort', icon: 'fas fa-bed', text: '舒适度' },
            { id: 'popular', icon: 'fas fa-fire', text: '热门景点' },
            { id: 'unique', icon: 'fas fa-magic', text: '独特小众' }
        ],
        quickReplies: ['交通便利', '地道体验', '拍照打卡']
    },
    {
        id: 6,
        question: '最后一个问题，您有什么特殊需求吗？',
        type: 'text',
        placeholder: '例如：亲子出行、无障碍需求、素食偏好等（可选）',
        quickReplies: ['亲子出行', '无特殊需求', '素食偏好', '跳过这题']
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // 初始化聊天页面
    initChatPage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('chat');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 开始第一个问题
    setTimeout(() => {
        askNextQuestion();
    }, 1000);
    
    // 输入框事件监听
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// 初始化聊天页面
function initChatPage() {
    // 清空快捷回复
    updateQuickReplies([]);
}

// 询问下一个问题
function askNextQuestion() {
    if (currentStep >= chatFlow.length) {
        showChatComplete();
        return;
    }
    
    const step = chatFlow[currentStep];
    
    // 显示思考动画
    showThinking();
    
    setTimeout(() => {
        hideThinking();
        
        // 添加AI问题消息
        addAIMessage(step);
        
        // 更新快捷回复
        updateQuickReplies(step.quickReplies || []);
        
        // 如果是选择题，显示选项
        if (step.type === 'options' || step.type === 'multiple') {
            showOptions(step);
        }
        
        // 更新进度
        updateProgress();
        
    }, 1500);
}

// 添加AI消息
function addAIMessage(step) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    messageElement.innerHTML = `
        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="question-card">
                <div class="question-number">问题 ${step.id}/6</div>
                <div class="question-text">${step.question}</div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// 显示选项
function showOptions(step) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const optionsElement = document.createElement('div');
    optionsElement.className = 'message ai-message';
    
    let optionsHTML = '';
    if (step.type === 'options') {
        optionsHTML = `
            <div class="options-grid">
                ${step.options.map(option => `
                    <div class="option-card" onclick="selectOption('${option.id}', '${option.title}', '${step.type}')">
                        <i class="${option.icon}"></i>
                        <div class="option-title">${option.title}</div>
                        <div class="option-desc">${option.desc}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (step.type === 'multiple') {
        optionsHTML = `
            <div class="options-list">
                ${step.options.map(option => `
                    <div class="option-item" onclick="toggleOption('${option.id}', '${option.text}')">
                        <i class="${option.icon}"></i>
                        <div class="option-text">${option.text}</div>
                        <i class="fas fa-check" style="display: none;"></i>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button class="btn btn-primary" onclick="confirmMultipleSelection()">确认选择</button>
            </div>
        `;
    }
    
    optionsElement.innerHTML = `
        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            ${optionsHTML}
        </div>
    `;
    
    messagesContainer.appendChild(optionsElement);
    scrollToBottom();
}

// 选择选项
function selectOption(optionId, optionText, type) {
    if (type === 'options') {
        // 单选，直接确认
        userAnswers[chatFlow[currentStep].id] = optionId;
        addUserMessage(optionText);
        nextStep();
    }
}

// 切换多选选项
function toggleOption(optionId, optionText) {
    const optionElement = event.currentTarget;
    const checkIcon = optionElement.querySelector('.fas.fa-check');
    
    optionElement.classList.toggle('selected');
    
    if (optionElement.classList.contains('selected')) {
        checkIcon.style.display = 'block';
    } else {
        checkIcon.style.display = 'none';
    }
}

// 确认多选
function confirmMultipleSelection() {
    const selectedOptions = document.querySelectorAll('.option-item.selected');
    const selectedIds = Array.from(selectedOptions).map(option => 
        option.getAttribute('onclick').match(/'([^']+)'/)[1]
    );
    const selectedTexts = Array.from(selectedOptions).map(option => 
        option.querySelector('.option-text').textContent
    );
    
    if (selectedIds.length === 0) {
        Message.warning('请至少选择一个选项');
        return;
    }
    
    userAnswers[chatFlow[currentStep].id] = selectedIds;
    addUserMessage(selectedTexts.join('、'));
    nextStep();
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addUserMessage(message);
    
    // 保存答案
    userAnswers[chatFlow[currentStep].id] = message;
    
    // 清空输入框
    input.value = '';
    
    // 进入下一步
    nextStep();
}

// 添加用户消息
function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <p>${text}</p>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// 下一步
function nextStep() {
    currentStep++;
    
    // 清空选项区域
    setTimeout(() => {
        askNextQuestion();
    }, 800);
}

// 显示思考动画
function showThinking() {
    const thinkingElement = document.getElementById('thinkingAnimation');
    thinkingElement.style.display = 'flex';
    scrollToBottom();
}

// 隐藏思考动画
function hideThinking() {
    const thinkingElement = document.getElementById('thinkingAnimation');
    thinkingElement.style.display = 'none';
}

// 更新快捷回复
function updateQuickReplies(replies) {
    const quickRepliesContainer = document.getElementById('quickReplies');
    
    if (!replies.length) {
        quickRepliesContainer.innerHTML = '';
        return;
    }
    
    quickRepliesContainer.innerHTML = replies.map(reply => `
        <button class="quick-reply-btn" onclick="useQuickReply('${reply}')">${reply}</button>
    `).join('');
}

// 使用快捷回复
function useQuickReply(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    sendMessage();
}

// 更新进度
function updateProgress() {
    const progress = (currentStep / chatFlow.length) * 100;
    // 这里可以添加进度条更新逻辑
}

// 滚动到底部
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// 显示完成界面
function showChatComplete() {
    showThinking();
    
    setTimeout(() => {
        hideThinking();
        
        const messagesContainer = document.getElementById('chatMessages');
        const completeElement = document.createElement('div');
        completeElement.className = 'message ai-message';
        completeElement.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="chat-complete">
                    <div class="complete-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="complete-title">信息收集完成！</div>
                    <div class="complete-description">
                        根据您的需求，我正在为您定制专属的成都旅游方案...
                    </div>
                    <button class="btn btn-primary generate-btn" onclick="generatePlans()">
                        <i class="fas fa-magic"></i>
                        开始生成方案
                    </button>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(completeElement);
        scrollToBottom();
        
        // 清空快捷回复和输入区域
        updateQuickReplies([]);
        document.querySelector('.input-container').style.display = 'none';
        
    }, 2000);
}

// 生成方案
function generatePlans() {
    // 保存用户答案到本地存储
    Storage.set('userAnswers', userAnswers);
    
    // 跳转到方案生成页面
    Navigation.goTo('generating');
}

// 重置聊天
function resetChat() {
    if (confirm('确定要重新开始吗？当前进度将会丢失。')) {
        currentStep = 0;
        userAnswers = {};
        chatHistory = [];
        
        // 清空消息区域
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="message ai-message">
                <div class="avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>你好！我是蓉易行AI助手小蓉，很高兴为您规划成都之旅！🎉</p>
                        <p>让我来了解一下您的需求，为您定制最适合的旅游方案。</p>
                    </div>
                </div>
            </div>
        `;
        
        // 显示输入区域
        document.querySelector('.input-container').style.display = 'block';
        
        // 重新开始
        setTimeout(() => {
            askNextQuestion();
        }, 1000);
    }
} 