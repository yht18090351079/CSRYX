// Todo页面逻辑
let tasks = [];
let currentFilter = 'all';
let isEditMode = false;
let currentTrip = null;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化Todo页面
    initTodoPage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('todo');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 加载数据
    loadTripData();
    loadTasks();
    
    // 渲染页面
    renderTripProgress();
    renderTasks();
    updateTaskCounts();
    
    // 初始化默认任务
    initializeDefaultTasks();
});

// 初始化Todo页面
function initTodoPage() {
    console.log('初始化Todo页面');
}

// 加载行程数据
function loadTripData() {
    currentTrip = Storage.get('currentTrip') || Storage.get('selectedPlan');
    
    if (!currentTrip) {
        // 使用默认行程数据
        currentTrip = {
            name: '文化深度游',
            days: 3,
            startDate: '2024-07-15',
            endDate: '2024-07-17'
        };
    }
}

// 加载任务数据
function loadTasks() {
    tasks = Storage.get('todoTasks', []);
}

// 保存任务数据
function saveTasks() {
    Storage.set('todoTasks', tasks);
}

// 初始化默认任务
function initializeDefaultTasks() {
    if (tasks.length === 0) {
        const defaultTasks = generateDefaultTasks();
        tasks = defaultTasks;
        saveTasks();
        renderTasks();
        updateTaskCounts();
    }
}

// 生成默认任务
function generateDefaultTasks() {
    return [
        {
            id: generateTaskId(),
            title: '检查身份证和相关证件',
            description: '确保身份证在有效期内，准备好学生证等优惠证件',
            category: 'preparation',
            priority: 'high',
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 明天
        },
        {
            id: generateTaskId(),
            title: '预订酒店住宿',
            description: '根据行程安排预订合适的酒店，注意位置和交通便利性',
            category: 'preparation',
            priority: 'high',
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateTaskId(),
            title: '购买旅游保险',
            description: '为旅行安全购买合适的旅游保险',
            category: 'preparation',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTaskId(),
            title: '准备雨具和换洗衣物',
            description: '根据天气预报准备合适的衣物，成都天气多变',
            category: 'preparation',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTaskId(),
            title: '预约杜甫草堂门票',
            description: '提前在官网预约门票，避免现场排队',
            category: 'travel',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTaskId(),
            title: '体验正宗四川火锅',
            description: '寻找当地人推荐的火锅店，体验地道川味',
            category: 'travel',
            priority: 'low',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTaskId(),
            title: '购买特色纪念品',
            description: '在锦里或宽窄巷子购买成都特色纪念品',
            category: 'shopping',
            priority: 'low',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTaskId(),
            title: '关注天气变化',
            description: '每日关注天气预报，及时调整行程安排',
            category: 'reminder',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
}

// 生成任务ID
function generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 渲染行程进度
function renderTripProgress() {
    if (!currentTrip) return;
    
    document.getElementById('tripName').textContent = currentTrip.name;
    
    // 计算日期
    const startDate = new Date(currentTrip.startDate || Date.now());
    const endDate = new Date(currentTrip.endDate || Date.now() + 3 * 24 * 60 * 60 * 1000);
    const today = new Date();
    
    const formatDate = (date) => {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };
    
    document.getElementById('tripDate').textContent = 
        `${formatDate(startDate)} - ${formatDate(endDate)}`;
    
    // 计算剩余天数
    const remainingDays = Math.max(0, Math.ceil((startDate - today) / (24 * 60 * 60 * 1000)));
    document.getElementById('remainingDays').textContent = remainingDays;
    
    // 更新进度统计
    updateProgressStats();
}

// 更新进度统计
function updateProgressStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('progressText').textContent = `${progressPercentage}%`;
    
    // 更新圆形进度条
    updateCircleProgress(progressPercentage);
}

// 更新圆形进度条
function updateCircleProgress(percentage) {
    const circleProgress = document.getElementById('circleProgress');
    const angle = (percentage / 100) * 360;
    
    circleProgress.style.background = `conic-gradient(
        white ${angle}deg,
        rgba(255,255,255,0.3) ${angle}deg
    )`;
}

// 渲染任务列表
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    
    // 筛选任务
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.category === currentFilter);
    }
    
    // 排序任务：未完成的在前，按优先级和创建时间排序
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    if (filteredTasks.length === 0) {
        tasksList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        tasksList.style.display = 'block';
        emptyState.style.display = 'none';
        
        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" 
                 data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                         onclick="toggleTask('${task.id}')">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        <div class="task-meta">
                            <span class="task-category">${getCategoryLabel(task.category)}</span>
                            ${task.dueDate ? `
                                <span class="task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}">
                                    <i class="fas fa-clock"></i>
                                    ${formatDueDate(task.dueDate)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="editTask('${task.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn" onclick="deleteTask('${task.id}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// 获取分类标签
function getCategoryLabel(category) {
    const labels = {
        preparation: '行前准备',
        travel: '旅行中',
        reminder: '提醒',
        shopping: '购物'
    };
    return labels[category] || category;
}

// 检查是否过期
function isOverdue(dueDate) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
}

// 格式化截止日期
function formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (24 * 60 * 60 * 1000));
    
    if (diffDays < 0) {
        return `已过期`;
    } else if (diffDays === 0) {
        return `今天`;
    } else if (diffDays === 1) {
        return `明天`;
    } else if (diffDays <= 7) {
        return `${diffDays}天后`;
    } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
}

// 更新任务计数
function updateTaskCounts() {
    const counts = {
        all: tasks.length,
        preparation: tasks.filter(t => t.category === 'preparation').length,
        travel: tasks.filter(t => t.category === 'travel').length,
        reminder: tasks.filter(t => t.category === 'reminder').length,
        shopping: tasks.filter(t => t.category === 'shopping').length
    };
    
    Object.keys(counts).forEach(category => {
        const element = document.getElementById(`${category}Count`);
        if (element) {
            element.textContent = counts[category];
        }
    });
}

// 切换任务完成状态
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    
    saveTasks();
    renderTasks();
    updateProgressStats();
    updateTaskCounts();
    
    // 显示庆祝动画
    if (task.completed) {
        showCelebrationAnimation();
    }
}

// 显示庆祝动画
function showCelebrationAnimation() {
    const animation = document.getElementById('celebrationAnimation');
    animation.style.display = 'flex';
    
    setTimeout(() => {
        animation.style.display = 'none';
    }, 2000);
}

// 筛选任务
function filterTasks(category) {
    currentFilter = category;
    
    // 更新按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// 显示添加任务弹窗
function showAddTaskModal(category = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // 重置表单
    form.reset();
    modalTitle.textContent = '添加新任务';
    
    // 如果指定了分类，预选择
    if (category) {
        document.getElementById('taskCategory').value = category;
    }
    
    modal.style.display = 'flex';
}

// 隐藏添加任务弹窗
function hideAddTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
}

// 保存任务
function saveTask(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const taskData = {
        id: generateTaskId(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value || null,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(taskData);
    saveTasks();
    
    renderTasks();
    updateProgressStats();
    updateTaskCounts();
    hideAddTaskModal();
    
    showMessage('success', '任务添加成功！');
}

// 编辑任务
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = '编辑任务';
    
    // 填充表单数据
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskPriority').value = task.priority;
    
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        document.getElementById('taskDueDate').value = localDateTime.toISOString().slice(0, 16);
    }
    
    // 修改表单提交处理
    const form = document.getElementById('taskForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        task.title = document.getElementById('taskTitle').value;
        task.description = document.getElementById('taskDescription').value;
        task.category = document.getElementById('taskCategory').value;
        task.priority = document.getElementById('taskPriority').value;
        task.dueDate = document.getElementById('taskDueDate').value || null;
        task.updatedAt = new Date().toISOString();
        
        saveTasks();
        renderTasks();
        updateTaskCounts();
        hideAddTaskModal();
        
        // 恢复原始提交处理
        form.onsubmit = saveTask;
        
        showMessage('success', '任务更新成功！');
    };
    
    modal.style.display = 'flex';
}

// 删除任务
function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) return;
    
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    
    renderTasks();
    updateProgressStats();
    updateTaskCounts();
    
    showMessage('success', '任务删除成功！');
}

// 切换编辑模式
function toggleEditMode() {
    isEditMode = !isEditMode;
    const todoPage = document.querySelector('.todo-page');
    const editIcon = document.getElementById('editIcon');
    
    if (isEditMode) {
        todoPage.classList.add('edit-mode');
        editIcon.className = 'fas fa-check';
    } else {
        todoPage.classList.remove('edit-mode');
        editIcon.className = 'fas fa-edit';
    }
}

// 显示消息提示
function showMessage(type, text) {
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
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 处理键盘事件
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        hideAddTaskModal();
        const celebration = document.getElementById('celebrationAnimation');
        if (celebration.style.display === 'flex') {
            celebration.style.display = 'none';
        }
    }
});

// 点击弹窗外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('taskModal');
    const celebration = document.getElementById('celebrationAnimation');
    
    if (e.target === modal) {
        hideAddTaskModal();
    }
    
    if (e.target === celebration) {
        celebration.style.display = 'none';
    }
});

// 导出数据功能
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `蓉易行任务清单_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// 导入数据功能
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                tasks = importedTasks;
                saveTasks();
                renderTasks();
                updateProgressStats();
                updateTaskCounts();
                showMessage('success', '任务导入成功！');
            } else {
                showMessage('error', '文件格式不正确！');
            }
        } catch (error) {
            showMessage('error', '文件解析失败！');
        }
    };
    reader.readAsText(file);
}

// 任务拖拽排序功能
let draggedTask = null;

function enableTaskDragging() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', function(e) {
            draggedTask = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedTask = null;
            
            // 移除所有拖拽样式
            document.querySelectorAll('.task-item').forEach(item => {
                item.classList.remove('drag-over');
            });
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (this !== draggedTask) {
                this.classList.add('drag-over');
            }
        });
        
        item.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (this !== draggedTask) {
                // 重新排序任务
                const draggedId = draggedTask.dataset.taskId;
                const targetId = this.dataset.taskId;
                
                reorderTasks(draggedId, targetId);
            }
        });
    });
}

// 重新排序任务
function reorderTasks(draggedId, targetId) {
    const draggedIndex = tasks.findIndex(t => t.id === draggedId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
        const draggedTask = tasks.splice(draggedIndex, 1)[0];
        tasks.splice(targetIndex, 0, draggedTask);
        
        saveTasks();
        renderTasks();
        
        // 重新启用拖拽
        setTimeout(enableTaskDragging, 100);
    }
}

// 页面加载完成后启用拖拽
setTimeout(() => {
    enableTaskDragging();
}, 1000); 