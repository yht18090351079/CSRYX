// 方案生成页面逻辑
let currentProgress = 0;
let currentStepIndex = 0;
let generationInterval;
let isGenerating = true;

// 生成步骤配置
const generationSteps = [
    {
        step: 1,
        title: '正在分析您的旅行偏好...',
        description: '基于您的问答，分析出您喜欢历史文化、成都美食，偏好适中节奏的旅行方式',
        icon: 'fas fa-search',
        duration: 3000
    },
    {
        step: 2,
        title: '智能匹配最适合的景点...',
        description: '从1000+成都景点中筛选出最符合您需求的热门地点和小众景点',
        icon: 'fas fa-brain',
        duration: 3000
    },
    {
        step: 3,
        title: '正在规划最优路线...',
        description: '考虑交通便利性、时间安排和游玩体验，设计最合理的游览顺序',
        icon: 'fas fa-route',
        duration: 3000
    },
    {
        step: 4,
        title: '优化方案细节...',
        description: '调整时间安排，添加美食推荐，确保每个环节都能给您最佳体验',
        icon: 'fas fa-magic',
        duration: 3000
    },
    {
        step: 5,
        title: '方案生成完成！',
        description: '已为您精心准备3套不同风格的旅行方案，每套都有独特的魅力',
        icon: 'fas fa-check-circle',
        duration: 2000
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // 初始化生成页面
    initGeneratingPage();
    
    // 获取用户答案（从AI聊天页面传递过来的）
    const userAnswers = Navigation.getParams() || Storage.get('userAnswers', {});
    
    // 开始生成流程
    setTimeout(() => {
        startGeneration();
    }, 1000);
});

// 初始化生成页面
function initGeneratingPage() {
    // 重置进度
    currentProgress = 0;
    currentStepIndex = 0;
    isGenerating = true;
    
    // 初始化进度显示
    updateProgress(0);
    updateCurrentStep(0);
}

// 开始生成流程
function startGeneration() {
    if (!isGenerating) return;
    
    // 开始逐步执行生成步骤
    executeStep(0);
}

// 执行单个步骤
function executeStep(stepIndex) {
    if (!isGenerating || stepIndex >= generationSteps.length) {
        if (stepIndex >= generationSteps.length) {
            showGenerationComplete();
        }
        return;
    }
    
    const step = generationSteps[stepIndex];
    currentStepIndex = stepIndex;
    
    // 更新当前步骤状态
    updateCurrentStep(stepIndex);
    
    // 更新详情卡片
    updateDetailCard(step);
    
    // 模拟进度增长
    animateProgressToStep(stepIndex);
    
    // 执行下一步
    setTimeout(() => {
        // 标记当前步骤为完成
        markStepCompleted(stepIndex);
        
        // 继续下一步
        executeStep(stepIndex + 1);
    }, step.duration);
}

// 更新当前活跃步骤
function updateCurrentStep(stepIndex) {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === stepIndex) {
            step.classList.add('active');
        }
    });
}

// 标记步骤为完成
function markStepCompleted(stepIndex) {
    const steps = document.querySelectorAll('.step');
    
    if (steps[stepIndex]) {
        steps[stepIndex].classList.remove('active');
        steps[stepIndex].classList.add('completed');
    }
}

// 更新详情卡片
function updateDetailCard(step) {
    const detailIcon = document.querySelector('.detail-icon i');
    const detailTitle = document.getElementById('detailTitle');
    const detailDescription = document.getElementById('detailDescription');
    
    if (detailIcon) {
        detailIcon.className = step.icon;
    }
    
    if (detailTitle) {
        detailTitle.textContent = step.title;
    }
    
    if (detailDescription) {
        detailDescription.textContent = step.description;
    }
    
    // 添加更新动画
    const detailCard = document.getElementById('detailCard');
    if (detailCard) {
        detailCard.style.animation = 'none';
        setTimeout(() => {
            detailCard.style.animation = 'slideIn 0.5s ease-out';
        }, 10);
    }
}

// 动画化进度到指定步骤
function animateProgressToStep(stepIndex) {
    const targetProgress = ((stepIndex + 1) / generationSteps.length) * 100;
    
    // 更新AI状态文本
    updateAIStatus(stepIndex);
    
    // 平滑进度动画
    const progressInterval = setInterval(() => {
        if (currentProgress < targetProgress) {
            currentProgress += 2;
            updateProgress(Math.min(currentProgress, targetProgress));
        } else {
            clearInterval(progressInterval);
        }
    }, 50);
}

// 更新进度显示
function updateProgress(percentage) {
    const progressPercentage = document.getElementById('progressPercentage');
    const progressCircle = document.getElementById('progressCircle');
    
    if (progressPercentage) {
        progressPercentage.textContent = Math.round(percentage) + '%';
    }
    
    if (progressCircle) {
        // 使用CSS变量更新圆环进度
        const degrees = (percentage / 100) * 360;
        progressCircle.style.setProperty('--progress', degrees + 'deg');
    }
}

// 更新AI状态文本
function updateAIStatus(stepIndex) {
    const aiStatus = document.getElementById('aiStatus');
    const aiSubtitle = document.getElementById('aiSubtitle');
    
    const step = generationSteps[stepIndex];
    
    if (aiStatus) {
        aiStatus.textContent = 'AI正在为您定制专属方案...';
    }
    
    if (aiSubtitle) {
        aiSubtitle.textContent = step.title.replace('正在', '').replace('...', '');
    }
}

// 显示生成完成界面
function showGenerationComplete() {
    isGenerating = false;
    
    const generatingContent = document.querySelector('.generating-content');
    const generationComplete = document.getElementById('generationComplete');
    
    // 淡出生成界面
    if (generatingContent) {
        generatingContent.classList.add('fade-out');
    }
    
    setTimeout(() => {
        if (generatingContent) {
            generatingContent.style.display = 'none';
        }
        
        if (generationComplete) {
            generationComplete.style.display = 'block';
            generationComplete.classList.add('fade-in');
        }
        
        // 保存生成的方案到本地存储
        saveGeneratedPlans();
        
    }, 500);
}

// 保存生成的方案
function saveGeneratedPlans() {
    // 这里可以根据用户的答案生成不同的方案
    const plans = MockData.travelPlans;
    Storage.set('generatedPlans', plans);
    Storage.set('planGeneratedTime', new Date().toISOString());
}

// 查看方案对比
function viewPlans() {
    Navigation.goTo('compare');
}

// 取消生成
function cancelGeneration() {
    if (confirm('确定要取消方案生成吗？您可以重新开始规划流程。')) {
        isGenerating = false;
        
        // 清除定时器
        if (generationInterval) {
            clearInterval(generationInterval);
        }
        
        // 返回聊天页面
        Navigation.goTo('chat');
    }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', function() {
    isGenerating = false;
    if (generationInterval) {
        clearInterval(generationInterval);
    }
});

// 处理页面可见性变化
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画（节省性能）
        isGenerating = false;
    } else {
        // 页面可见时恢复动画（如果还在生成中）
        if (currentStepIndex < generationSteps.length) {
            isGenerating = true;
        }
    }
});

// 添加一些有趣的用户体验细节
function addInteractiveElements() {
    // 让AI头像响应鼠标悬停
    const aiAvatar = document.querySelector('.ai-avatar');
    if (aiAvatar) {
        aiAvatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        aiAvatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // 让进度圆环响应点击
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        progressCircle.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    }
}

// 页面加载完成后添加交互元素
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addInteractiveElements, 1000);
}); 