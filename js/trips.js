// 我的行程页面逻辑
let trips = [];
let currentFilter = 'all';
let currentSort = 'date_desc';

document.addEventListener('DOMContentLoaded', function() {
    // 初始化行程页面
    initTripsPage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('trips');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 加载数据
    loadTrips();
    
    // 渲染页面
    renderTrips();
    updateStatistics();
    updateFilterCounts();
    
    // 初始化默认行程
    initializeDefaultTrips();
    
    // 初始化标签选择
    initializeTagSelector();
});

// 初始化行程页面
function initTripsPage() {
    console.log('初始化我的行程页面');
}

// 加载行程数据
function loadTrips() {
    trips = Storage.get('userTrips', []);
}

// 保存行程数据
function saveTrips() {
    Storage.set('userTrips', trips);
}

// 初始化默认行程
function initializeDefaultTrips() {
    if (trips.length === 0) {
        const defaultTrips = generateDefaultTrips();
        trips = defaultTrips;
        saveTrips();
        renderTrips();
        updateStatistics();
        updateFilterCounts();
    }
}

// 生成默认行程
function generateDefaultTrips() {
    const today = new Date();
    const futureDate1 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const pastDate1 = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const pastDate2 = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    return [
        {
            id: generateTripId(),
            name: '成都文化之旅',
            destination: '成都市',
            startDate: today.toISOString().split('T')[0],
            endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 1500,
            description: '探索成都深厚的历史文化底蕴，品味地道川菜，感受慢生活节奏。',
            tags: ['文化', '美食', '历史'],
            status: 'ongoing',
            progress: 60,
            spots: 8,
            tasks: 12,
            photos: 25,
            createdAt: new Date().toISOString()
        },
        {
            id: generateTripId(),
            name: '九寨沟自然之旅',
            destination: '阿坝州',
            startDate: futureDate1.toISOString().split('T')[0],
            endDate: new Date(futureDate1.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 2800,
            description: '欣赏九寨沟的绝美风光，体验藏族文化，享受大自然的馈赠。',
            tags: ['自然', '文化', '摄影'],
            status: 'planning',
            progress: 20,
            spots: 6,
            tasks: 15,
            photos: 0,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateTripId(),
            name: '峨眉山朝圣之旅',
            destination: '乐山市',
            startDate: futureDate2.toISOString().split('T')[0],
            endDate: new Date(futureDate2.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 800,
            description: '登峨眉山，拜普贤菩萨，感受佛教文化的庄严与神圣。',
            tags: ['文化', '历史', '自然'],
            status: 'planning',
            progress: 5,
            spots: 4,
            tasks: 8,
            photos: 0,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateTripId(),
            name: '重庆山城美食行',
            destination: '重庆市',
            startDate: pastDate1.toISOString().split('T')[0],
            endDate: new Date(pastDate1.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 1200,
            description: '品尝重庆火锅，游览洪崖洞，感受山城的独特魅力。',
            tags: ['美食', '文化', '夜景'],
            status: 'completed',
            progress: 100,
            spots: 10,
            tasks: 18,
            photos: 58,
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateTripId(),
            name: '西安古都探秘',
            destination: '西安市',
            startDate: pastDate2.toISOString().split('T')[0],
            endDate: new Date(pastDate2.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 2200,
            description: '参观兵马俑，游览古城墙，品味西安美食，感受千年古都的魅力。',
            tags: ['历史', '文化', '美食'],
            status: 'completed',
            progress: 100,
            spots: 12,
            tasks: 22,
            photos: 45,
            createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// 生成行程ID
function generateTripId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 更新统计数据
function updateStatistics() {
    const stats = calculateStatistics();
    
    document.getElementById('totalTrips').textContent = stats.totalTrips;
    document.getElementById('visitedCities').textContent = stats.visitedCities;
    document.getElementById('totalPhotos').textContent = stats.totalPhotos;
    document.getElementById('totalDays').textContent = stats.totalDays;
}

// 计算统计数据
function calculateStatistics() {
    const totalTrips = trips.length;
    const visitedCities = new Set(trips.map(trip => trip.destination)).size;
    const totalPhotos = trips.reduce((sum, trip) => sum + (trip.photos || 0), 0);
    const totalDays = trips.reduce((sum, trip) => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
    }, 0);
    
    return {
        totalTrips,
        visitedCities,
        totalPhotos,
        totalDays
    };
}

// 更新筛选计数
function updateFilterCounts() {
    const counts = {
        all: trips.length,
        planning: trips.filter(t => t.status === 'planning').length,
        ongoing: trips.filter(t => t.status === 'ongoing').length,
        completed: trips.filter(t => t.status === 'completed').length
    };
    
    Object.keys(counts).forEach(status => {
        const element = document.getElementById(`${status}Count`);
        if (element) {
            element.textContent = counts[status];
        }
    });
}

// 渲染行程列表
function renderTrips() {
    const tripsList = document.getElementById('tripsList');
    const emptyState = document.getElementById('emptyState');
    
    // 筛选行程
    let filteredTrips = trips;
    if (currentFilter !== 'all') {
        filteredTrips = trips.filter(trip => trip.status === currentFilter);
    }
    
    // 排序行程
    filteredTrips = sortTrips(filteredTrips, currentSort);
    
    if (filteredTrips.length === 0) {
        tripsList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        tripsList.style.display = 'block';
        emptyState.style.display = 'none';
        
        tripsList.innerHTML = filteredTrips.map(trip => `
            <div class="trip-card" onclick="showTripDetail('${trip.id}')">
                <div class="trip-card-header">
                    <div class="trip-status-badge ${trip.status}">${getStatusLabel(trip.status)}</div>
                    <div class="trip-destination-icon">
                        <i class="${getDestinationIcon(trip.destination)}"></i>
                    </div>
                </div>
                <div class="trip-card-content">
                    <h3 class="trip-title">${trip.name}</h3>
                    <div class="trip-destination">
                        <i class="fas fa-map-marker-alt"></i>
                        ${trip.destination}
                    </div>
                    <div class="trip-dates">${formatDateRange(trip.startDate, trip.endDate)}</div>
                    <div class="trip-meta">
                        <span class="trip-duration">${calculateDuration(trip.startDate, trip.endDate)}天</span>
                        <span class="trip-budget">¥${trip.budget}</span>
                    </div>
                    <div class="trip-tags">
                        ${trip.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${trip.status !== 'completed' ? `
                        <div class="trip-progress">
                            <div class="trip-progress-label">
                                <span>完成进度</span>
                                <span>${trip.progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${trip.progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                    <div class="trip-actions">
                        <button class="trip-action-btn" onclick="event.stopPropagation(); shareTrip('${trip.id}')">
                            <i class="fas fa-share-alt"></i>
                            分享
                        </button>
                        <button class="trip-action-btn" onclick="event.stopPropagation(); editTrip('${trip.id}')">
                            <i class="fas fa-edit"></i>
                            编辑
                        </button>
                        <button class="trip-action-btn primary" onclick="event.stopPropagation(); viewTripDetails('${trip.id}')">
                            <i class="fas fa-eye"></i>
                            查看
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// 获取状态标签
function getStatusLabel(status) {
    const labels = {
        planning: '计划中',
        ongoing: '进行中',
        completed: '已完成'
    };
    return labels[status] || status;
}

// 获取目的地图标
function getDestinationIcon(destination) {
    const icons = {
        '成都市': 'fas fa-building',
        '阿坝州': 'fas fa-mountain',
        '乐山市': 'fas fa-place-of-worship',
        '重庆市': 'fas fa-city',
        '西安市': 'fas fa-monument'
    };
    return icons[destination] || 'fas fa-map-marker-alt';
}

// 格式化日期范围
function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
}

// 计算行程天数
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

// 排序行程
function sortTrips(trips, sortType) {
    const sortedTrips = [...trips];
    
    switch (sortType) {
        case 'date_desc':
            return sortedTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        case 'date_asc':
            return sortedTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        case 'name_asc':
            return sortedTrips.sort((a, b) => a.name.localeCompare(b.name));
        case 'duration_desc':
            return sortedTrips.sort((a, b) => {
                const durationA = calculateDuration(a.startDate, a.endDate);
                const durationB = calculateDuration(b.startDate, b.endDate);
                return durationB - durationA;
            });
        default:
            return sortedTrips;
    }
}

// 筛选行程
function filterTrips(status) {
    currentFilter = status;
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });
    
    renderTrips();
}

// 处理排序选择
function handleSortChange(value) {
    currentSort = value;
    renderTrips();
}

// 显示创建行程弹窗
function showCreateTripModal() {
    const modal = document.getElementById('tripModal');
    const form = document.getElementById('tripForm');
    
    // 重置表单
    form.reset();
    
    // 设置默认日期
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    document.getElementById('tripStartDate').value = today.toISOString().split('T')[0];
    document.getElementById('tripEndDate').value = tomorrow.toISOString().split('T')[0];
    
    // 重置标签选择
    document.querySelectorAll('.tag-option').forEach(tag => {
        tag.classList.remove('selected');
    });
    document.getElementById('selectedTags').value = '';
    
    modal.style.display = 'flex';
}

// 隐藏创建行程弹窗
function hideCreateTripModal() {
    const modal = document.getElementById('tripModal');
    modal.style.display = 'none';
}

// 初始化标签选择器
function initializeTagSelector() {
    const tagOptions = document.querySelectorAll('.tag-option');
    
    tagOptions.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedTags();
        });
    });
}

// 更新选中的标签
function updateSelectedTags() {
    const selectedTags = Array.from(document.querySelectorAll('.tag-option.selected'))
        .map(tag => tag.dataset.tag);
    document.getElementById('selectedTags').value = selectedTags.join(',');
}

// 创建行程
function createTrip(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const selectedTags = document.getElementById('selectedTags').value;
    
    const newTrip = {
        id: generateTripId(),
        name: document.getElementById('tripName').value,
        destination: document.getElementById('tripDestination').value,
        startDate: document.getElementById('tripStartDate').value,
        endDate: document.getElementById('tripEndDate').value,
        budget: parseInt(document.getElementById('tripBudget').value) || 0,
        description: document.getElementById('tripDescription').value,
        tags: selectedTags ? selectedTags.split(',') : [],
        status: 'planning',
        progress: 0,
        spots: 0,
        tasks: 0,
        photos: 0,
        createdAt: new Date().toISOString()
    };
    
    trips.unshift(newTrip);
    saveTrips();
    
    renderTrips();
    updateStatistics();
    updateFilterCounts();
    hideCreateTripModal();
    
    showSuccessToast('行程创建成功！');
}

// 显示行程详情
function showTripDetail(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const modal = document.getElementById('tripDetailModal');
    
    // 填充数据
    document.getElementById('tripStatusBadge').textContent = getStatusLabel(trip.status);
    document.getElementById('tripStatusBadge').className = `trip-status-badge ${trip.status}`;
    
    document.getElementById('detailTripName').textContent = trip.name;
    document.getElementById('detailTripDestination').textContent = trip.destination;
    document.getElementById('detailTripDates').textContent = formatDateRange(trip.startDate, trip.endDate);
    document.getElementById('detailTripDuration').textContent = `${calculateDuration(trip.startDate, trip.endDate)}天${calculateDuration(trip.startDate, trip.endDate) - 1}晚`;
    
    document.getElementById('detailTripBudget').textContent = trip.budget;
    document.getElementById('detailTripSpots').textContent = trip.spots;
    document.getElementById('detailTripTasks').textContent = trip.tasks;
    
    document.getElementById('detailTripDesc').textContent = trip.description;
    
    // 更新标签
    const tagsContainer = document.getElementById('detailTripTags');
    tagsContainer.innerHTML = trip.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    // 更新进度
    const progressFill = document.getElementById('detailProgressFill');
    const progressText = document.getElementById('detailProgressText');
    const progressDays = document.getElementById('detailProgressDays');
    
    progressFill.style.width = `${trip.progress}%`;
    progressText.textContent = `${trip.progress}% 完成`;
    
    if (trip.status === 'completed') {
        progressDays.textContent = '已完成';
    } else if (trip.status === 'ongoing') {
        const today = new Date();
        const endDate = new Date(trip.endDate);
        const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
        progressDays.textContent = remainingDays > 0 ? `剩余${remainingDays}天` : '即将结束';
    } else {
        const today = new Date();
        const startDate = new Date(trip.startDate);
        const daysToStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
        progressDays.textContent = daysToStart > 0 ? `${daysToStart}天后开始` : '即将开始';
    }
    
    modal.style.display = 'flex';
    
    // 存储当前行程ID
    modal.dataset.tripId = tripId;
}

// 隐藏行程详情弹窗
function hideTripDetailModal() {
    const modal = document.getElementById('tripDetailModal');
    modal.style.display = 'none';
}

// 分享行程
function shareTrip(tripId) {
    const trip = tripId ? trips.find(t => t.id === tripId) : 
                 trips.find(t => t.id === document.getElementById('tripDetailModal').dataset.tripId);
    
    if (!trip) return;
    
    const shareText = `我计划了一次${trip.name}，在${trip.destination}度过${calculateDuration(trip.startDate, trip.endDate)}天美好时光！`;
    
    if (navigator.share) {
        navigator.share({
            title: `蓉易行 - ${trip.name}`,
            text: shareText,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccessToast('行程信息已复制到剪贴板');
        });
    }
}

// 编辑行程
function editTrip(tripId) {
    const trip = tripId ? trips.find(t => t.id === tripId) : 
                 trips.find(t => t.id === document.getElementById('tripDetailModal').dataset.tripId);
    
    if (!trip) return;
    
    // 隐藏详情弹窗
    hideTripDetailModal();
    
    // 显示编辑弹窗
    const modal = document.getElementById('tripModal');
    const form = document.getElementById('tripForm');
    
    // 填充表单数据
    document.getElementById('tripName').value = trip.name;
    document.getElementById('tripDestination').value = trip.destination;
    document.getElementById('tripStartDate').value = trip.startDate;
    document.getElementById('tripEndDate').value = trip.endDate;
    document.getElementById('tripBudget').value = trip.budget;
    document.getElementById('tripDescription').value = trip.description;
    
    // 设置标签选择
    document.querySelectorAll('.tag-option').forEach(tag => {
        tag.classList.remove('selected');
        if (trip.tags.includes(tag.dataset.tag)) {
            tag.classList.add('selected');
        }
    });
    updateSelectedTags();
    
    // 修改表单提交处理
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const selectedTags = document.getElementById('selectedTags').value;
        
        trip.name = document.getElementById('tripName').value;
        trip.destination = document.getElementById('tripDestination').value;
        trip.startDate = document.getElementById('tripStartDate').value;
        trip.endDate = document.getElementById('tripEndDate').value;
        trip.budget = parseInt(document.getElementById('tripBudget').value) || 0;
        trip.description = document.getElementById('tripDescription').value;
        trip.tags = selectedTags ? selectedTags.split(',') : [];
        trip.updatedAt = new Date().toISOString();
        
        saveTrips();
        renderTrips();
        updateStatistics();
        hideCreateTripModal();
        
        // 恢复原始提交处理
        form.onsubmit = createTrip;
        
        showSuccessToast('行程更新成功！');
    };
    
    modal.style.display = 'flex';
}

// 查看行程详情
function viewTripDetails(tripId) {
    const trip = tripId ? trips.find(t => t.id === tripId) : 
                 trips.find(t => t.id === document.getElementById('tripDetailModal').dataset.tripId);
    
    if (!trip) return;
    
    // 保存选中的行程到本地存储
    Storage.set('selectedPlan', trip);
    Storage.set('selectedPlanId', trip.id);
    
    // 跳转到方案详情页面
    Navigation.goTo('planDetail');
}

// 删除行程
function deleteTrip(tripId) {
    if (!confirm('确定要删除这个行程吗？此操作不可恢复。')) return;
    
    trips = trips.filter(t => t.id !== tripId);
    saveTrips();
    
    renderTrips();
    updateStatistics();
    updateFilterCounts();
    hideTripDetailModal();
    
    showSuccessToast('行程删除成功！');
}

// 显示成功提示
function showSuccessToast(message) {
    const toast = document.getElementById('successToast');
    const messageElement = document.getElementById('toastMessage');
    
    messageElement.textContent = message;
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// 导出行程数据
function exportTrips() {
    const dataStr = JSON.stringify(trips, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `蓉易行行程数据_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSuccessToast('行程数据已导出');
}

// 导入行程数据
function importTrips(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTrips = JSON.parse(e.target.result);
            if (Array.isArray(importedTrips)) {
                trips = importedTrips;
                saveTrips();
                renderTrips();
                updateStatistics();
                updateFilterCounts();
                showSuccessToast('行程数据导入成功！');
            } else {
                showSuccessToast('文件格式不正确！');
            }
        } catch (error) {
            showSuccessToast('文件解析失败！');
        }
    };
    reader.readAsText(file);
}

// 处理键盘事件
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        hideCreateTripModal();
        hideTripDetailModal();
    }
});

// 点击弹窗外部关闭
document.addEventListener('click', function(e) {
    const tripModal = document.getElementById('tripModal');
    const detailModal = document.getElementById('tripDetailModal');
    
    if (e.target === tripModal) {
        hideCreateTripModal();
    }
    
    if (e.target === detailModal) {
        hideTripDetailModal();
    }
});

// 搜索行程功能
function searchTrips(query) {
    const filteredTrips = trips.filter(trip =>
        trip.name.toLowerCase().includes(query.toLowerCase()) ||
        trip.destination.toLowerCase().includes(query.toLowerCase()) ||
        trip.description.toLowerCase().includes(query.toLowerCase()) ||
        trip.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderFilteredTrips(filteredTrips);
}

// 渲染筛选后的行程
function renderFilteredTrips(filteredTrips) {
    const tripsList = document.getElementById('tripsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredTrips.length === 0) {
        tripsList.style.display = 'none';
        emptyState.style.display = 'flex';
        emptyState.querySelector('h3').textContent = '没有找到匹配的行程';
        emptyState.querySelector('p').textContent = '试试其他关键词或创建新的行程';
    } else {
        tripsList.style.display = 'block';
        emptyState.style.display = 'none';
        
        // 使用相同的渲染逻辑，但传入筛选后的数据
        const originalTrips = trips;
        trips = filteredTrips;
        renderTrips();
        trips = originalTrips;
    }
}

// 批量操作功能
let selectedTrips = new Set();

function toggleTripSelection(tripId) {
    if (selectedTrips.has(tripId)) {
        selectedTrips.delete(tripId);
    } else {
        selectedTrips.add(tripId);
    }
    
    updateSelectionUI();
}

function updateSelectionUI() {
    const selectedCount = selectedTrips.size;
    const batchActions = document.getElementById('batchActions');
    
    if (selectedCount > 0) {
        if (!batchActions) {
            createBatchActionsBar();
        }
        document.getElementById('selectedCount').textContent = selectedCount;
    } else {
        if (batchActions) {
            batchActions.remove();
        }
    }
}

function createBatchActionsBar() {
    const batchActionsHTML = `
        <div id="batchActions" class="batch-actions">
            <div class="batch-info">
                已选择 <span id="selectedCount">0</span> 个行程
            </div>
            <div class="batch-buttons">
                <button onclick="batchDelete()" class="btn btn-danger">删除</button>
                <button onclick="batchExport()" class="btn btn-secondary">导出</button>
                <button onclick="clearSelection()" class="btn btn-outline">取消</button>
            </div>
        </div>
    `;
    
    document.querySelector('.trips-page').insertAdjacentHTML('beforeend', batchActionsHTML);
}

function batchDelete() {
    if (!confirm(`确定要删除选中的 ${selectedTrips.size} 个行程吗？`)) return;
    
    trips = trips.filter(trip => !selectedTrips.has(trip.id));
    saveTrips();
    
    clearSelection();
    renderTrips();
    updateStatistics();
    updateFilterCounts();
    
    showSuccessToast('批量删除成功！');
}

function batchExport() {
    const selectedTripsData = trips.filter(trip => selectedTrips.has(trip.id));
    const dataStr = JSON.stringify(selectedTripsData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `选中行程_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    clearSelection();
    showSuccessToast('选中行程已导出');
}

function clearSelection() {
    selectedTrips.clear();
    updateSelectionUI();
    
    // 更新UI中的选择状态
    document.querySelectorAll('.trip-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// 快速操作功能
function quickCreateTrip(template) {
    const templates = {
        weekend: {
            name: '周末短途游',
            destination: '成都周边',
            duration: 2,
            budget: 500,
            tags: ['休闲', '自然']
        },
        cultural: {
            name: '文化探索之旅',
            destination: '成都市',
            duration: 3,
            budget: 1000,
            tags: ['文化', '历史']
        },
        foodie: {
            name: '美食发现之旅',
            destination: '成都市',
            duration: 2,
            budget: 800,
            tags: ['美食', '文化']
        }
    };
    
    const template_data = templates[template];
    if (!template_data) return;
    
    const today = new Date();
    const endDate = new Date(today.getTime() + (template_data.duration - 1) * 24 * 60 * 60 * 1000);
    
    const newTrip = {
        id: generateTripId(),
        name: template_data.name,
        destination: template_data.destination,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        budget: template_data.budget,
        description: `基于${template_data.name}模板创建的行程`,
        tags: template_data.tags,
        status: 'planning',
        progress: 0,
        spots: 0,
        tasks: 0,
        photos: 0,
        createdAt: new Date().toISOString()
    };
    
    trips.unshift(newTrip);
    saveTrips();
    
    renderTrips();
    updateStatistics();
    updateFilterCounts();
    
    showSuccessToast(`${template_data.name}创建成功！`);
} 