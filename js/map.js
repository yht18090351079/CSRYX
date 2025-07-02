// 地图导航页面逻辑
let currentMapMode = 'satellite';
let mapZoomLevel = 1;
let isNavigating = false;
let currentDestination = null;
let mapMarkers = [];
let searchTimeout = null;

// 模拟地点数据
const mockPlaces = [
    {
        id: 1,
        name: '杜甫草堂',
        type: 'attraction',
        position: { x: 45, y: 35 },
        address: '青羊区青华路37号',
        phone: '028-87319258',
        hours: '08:00-18:00',
        price: '¥60',
        rating: 4.7,
        reviews: 2300,
        description: '唐代大诗人杜甫流寓成都时的故居，现为中国古典园林和文学遗址。',
        tags: ['历史文化', '园林建筑', '诗词文化'],
        icon: 'fas fa-landmark'
    },
    {
        id: 2,
        name: '宽窄巷子',
        type: 'attraction',
        position: { x: 35, y: 40 },
        address: '青羊区长顺街127号',
        phone: '028-86259233',
        hours: '全天开放',
        price: '免费',
        rating: 4.5,
        reviews: 5600,
        description: '成都最具代表性的历史文化街区，保存着清朝古街道格局。',
        tags: ['历史街区', '传统建筑', '特色小食'],
        icon: 'fas fa-home'
    },
    {
        id: 3,
        name: '锦里古街',
        type: 'attraction',
        position: { x: 55, y: 50 },
        address: '武侯区武侯祠大街231号',
        phone: '028-85538914',
        hours: '全天开放',
        price: '免费',
        rating: 4.4,
        reviews: 4200,
        description: '成都著名的美食街区，汇集了各种传统川味小食。',
        tags: ['传统小食', '川菜餐厅', '民俗表演'],
        icon: 'fas fa-utensils'
    },
    {
        id: 4,
        name: '陈麻婆豆腐(总店)',
        type: 'restaurant',
        position: { x: 40, y: 45 },
        address: '青羊区西玉龙街197号',
        phone: '028-86754512',
        hours: '10:00-21:00',
        price: '¥65/人',
        rating: 4.6,
        reviews: 1800,
        description: '麻婆豆腐发源地，正宗川菜老字号餐厅。',
        tags: ['川菜', '老字号', '麻婆豆腐'],
        icon: 'fas fa-pepper-hot'
    },
    {
        id: 5,
        name: '成都茂业JW万豪酒店',
        type: 'hotel',
        position: { x: 50, y: 30 },
        address: '锦江区东御街18号',
        phone: '028-86799999',
        hours: '24小时',
        price: '¥1,200/晚',
        rating: 4.8,
        reviews: 960,
        description: '豪华五星级酒店，位于市中心商业区。',
        tags: ['五星酒店', '商务酒店', '市中心'],
        icon: 'fas fa-building'
    },
    {
        id: 6,
        name: '春熙路地铁站',
        type: 'transport',
        position: { x: 60, y: 40 },
        address: '锦江区春熙路',
        phone: '028-12345678',
        hours: '06:00-23:00',
        price: '¥2-6',
        rating: 4.2,
        reviews: 1200,
        description: '成都地铁2号线和3号线换乘站。',
        tags: ['地铁站', '换乘站', '交通枢纽'],
        icon: 'fas fa-subway'
    }
];

// 搜索建议数据
const searchSuggestions = [
    { name: '杜甫草堂', address: '青羊区青华路37号', distance: '1.2km', type: 'attraction' },
    { name: '宽窄巷子', address: '青羊区长顺街127号', distance: '800m', type: 'attraction' },
    { name: '锦里古街', address: '武侯区武侯祠大街231号', distance: '2.1km', type: 'attraction' },
    { name: '武侯祠', address: '武侯区武侯祠大街231号', distance: '2.2km', type: 'attraction' },
    { name: '金沙遗址博物馆', address: '青羊区金沙遗址路2号', distance: '3.5km', type: 'attraction' },
    { name: '陈麻婆豆腐', address: '青羊区西玉龙街197号', distance: '900m', type: 'restaurant' },
    { name: '火锅大王', address: '锦江区红星路三段1号', distance: '1.5km', type: 'restaurant' }
];

document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图页面
    initMapPage();
    
    // 添加底部导航
    const bottomNav = createBottomNavigation('map');
    document.getElementById('bottomNavigation').appendChild(bottomNav);
    
    // 初始化地图
    initializeMap();
    
    // 添加事件监听
    addEventListeners();
    
    // 模拟当前位置
    setCurrentLocation(30, 35);
});

// 初始化地图页面
function initMapPage() {
    console.log('初始化地图导航页面');
}

// 初始化地图
function initializeMap() {
    renderMapMarkers();
    updateMapMode();
    
    // 模拟地图加载
    const mapCanvas = document.getElementById('mapCanvas');
    mapCanvas.innerHTML += '<div class="map-loading"><i class="fas fa-spinner"></i><span>地图加载中...</span></div>';
    
    setTimeout(() => {
        const loading = mapCanvas.querySelector('.map-loading');
        if (loading) loading.remove();
    }, 1500);
}

// 渲染地图标记
function renderMapMarkers() {
    const markersContainer = document.getElementById('mapMarkers');
    markersContainer.innerHTML = '';
    
    mockPlaces.forEach(place => {
        const marker = document.createElement('div');
        marker.className = `map-marker ${place.type}`;
        marker.style.left = `${place.position.x}%`;
        marker.style.top = `${place.position.y}%`;
        marker.dataset.placeId = place.id;
        marker.innerHTML = `<i class="${place.icon}"></i>`;
        marker.onclick = () => showPlaceDetails(place.id);
        
        markersContainer.appendChild(marker);
        mapMarkers.push(marker);
    });
}

// 设置当前位置
function setCurrentLocation(x, y) {
    const currentLocation = document.getElementById('currentLocation');
    currentLocation.style.left = `${x}%`;
    currentLocation.style.top = `${y}%`;
    currentLocation.style.display = 'block';
}

// 添加事件监听
function addEventListeners() {
    // 地图拖拽
    const mapCanvas = document.getElementById('mapCanvas');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    mapCanvas.addEventListener('mousedown', startDrag);
    mapCanvas.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        isDragging = true;
        mapCanvas.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        startX = clientX;
        startY = clientY;
        
        const rect = mapCanvas.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        // 模拟地图拖拽效果
        const background = mapCanvas.querySelector('.map-background');
        if (background) {
            background.style.transform = `translate(${deltaX * 0.1}px, ${deltaY * 0.1}px)`;
        }
    }
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        mapCanvas.classList.remove('dragging');
        
        // 重置背景位置
        setTimeout(() => {
            const background = mapCanvas.querySelector('.map-background');
            if (background) {
                background.style.transform = '';
            }
        }, 300);
    }
}

// 切换地图类型
function toggleMapType() {
    const modes = ['satellite', 'street'];
    const currentIndex = modes.indexOf(currentMapMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    switchMapMode(modes[nextIndex]);
}

// 切换地图模式
function switchMapMode(mode) {
    currentMapMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    updateMapMode();
}

// 更新地图模式
function updateMapMode() {
    const mapCanvas = document.getElementById('mapCanvas');
    
    if (currentMapMode === 'satellite') {
        mapCanvas.style.background = '#e8f5e8';
    } else {
        mapCanvas.style.background = '#f5f5f5';
    }
}

// 地图缩放
function zoomIn() {
    if (mapZoomLevel < 3) {
        mapZoomLevel += 0.2;
        applyZoom();
    }
}

function zoomOut() {
    if (mapZoomLevel > 0.5) {
        mapZoomLevel -= 0.2;
        applyZoom();
    }
}

function applyZoom() {
    const mapCanvas = document.getElementById('mapCanvas');
    mapCanvas.style.transform = `scale(${mapZoomLevel})`;
    
    // 调整标记大小
    mapMarkers.forEach(marker => {
        const scale = Math.max(0.8, 1 / mapZoomLevel);
        marker.style.transform = `rotate(-45deg) scale(${scale})`;
    });
}

// 重置视图
function resetView() {
    mapZoomLevel = 1;
    applyZoom();
    
    // 重置地图位置
    const mapCanvas = document.getElementById('mapCanvas');
    mapCanvas.style.transform = 'scale(1)';
    
    const background = mapCanvas.querySelector('.map-background');
    if (background) {
        background.style.transform = '';
    }
}

// 切换当前位置显示
function toggleCurrentLocation() {
    const currentLocation = document.getElementById('currentLocation');
    const isVisible = currentLocation.style.display !== 'none';
    
    if (isVisible) {
        currentLocation.style.display = 'none';
        showMessage('info', '已隐藏当前位置');
    } else {
        currentLocation.style.display = 'block';
        showMessage('success', '已显示当前位置');
        
        // 动画效果
        currentLocation.style.animation = 'none';
        setTimeout(() => {
            currentLocation.style.animation = '';
        }, 100);
    }
}

// 搜索处理
function handleSearch(event) {
    const query = event.target.value.trim();
    const clearBtn = document.querySelector('.search-clear');
    
    // 显示/隐藏清除按钮
    if (query) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
        hideSearchSuggestions();
        return;
    }
    
    // 防抖搜索
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
}

// 执行搜索
function performSearch(query) {
    const filteredSuggestions = searchSuggestions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase())
    );
    
    renderSearchSuggestions(filteredSuggestions);
    showSearchSuggestions();
}

// 显示搜索建议
function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    suggestions.style.display = 'block';
    
    // 隐藏快速入口
    const quickAccess = document.getElementById('quickAccess');
    quickAccess.style.display = 'none';
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    suggestions.style.display = 'none';
    
    // 显示快速入口
    const quickAccess = document.getElementById('quickAccess');
    quickAccess.style.display = 'block';
}

// 渲染搜索建议
function renderSearchSuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');
    
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<div class="no-results">未找到相关地点</div>';
        return;
    }
    
    suggestionsList.innerHTML = suggestions.map(item => `
        <div class="suggestion-item" onclick="selectSuggestion('${item.name}')">
            <div class="suggestion-icon">
                <i class="${getTypeIcon(item.type)}"></i>
            </div>
            <div class="suggestion-info">
                <div class="suggestion-name">${item.name}</div>
                <div class="suggestion-address">${item.address}</div>
            </div>
            <div class="suggestion-distance">${item.distance}</div>
        </div>
    `).join('');
}

// 获取类型图标
function getTypeIcon(type) {
    const icons = {
        attraction: 'fas fa-camera',
        restaurant: 'fas fa-utensils',
        hotel: 'fas fa-bed',
        transport: 'fas fa-bus'
    };
    return icons[type] || 'fas fa-map-marker-alt';
}

// 选择搜索建议
function selectSuggestion(placeName) {
    const place = mockPlaces.find(p => p.name === placeName);
    if (place) {
        showPlaceDetails(place.id);
    }
    
    // 清除搜索
    document.getElementById('searchInput').value = placeName;
    hideSearchSuggestions();
}

// 清除搜索
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.querySelector('.search-clear').style.display = 'none';
    hideSearchSuggestions();
}

// 附近搜索
function searchNearby(type) {
    const nearbyPlaces = mockPlaces.filter(place => place.type === type);
    const suggestions = nearbyPlaces.map(place => ({
        name: place.name,
        address: place.address,
        distance: calculateDistance(place.position),
        type: place.type
    }));
    
    renderSearchSuggestions(suggestions);
    showSearchSuggestions();
    
    // 更新搜索框
    const typeNames = {
        restaurant: '附近餐厅',
        attraction: '热门景点',
        hotel: '住宿酒店',
        transport: '公共交通'
    };
    document.getElementById('searchInput').value = typeNames[type] || '';
    document.querySelector('.search-clear').style.display = 'block';
}

// 计算距离（模拟）
function calculateDistance(position) {
    const currentPos = { x: 30, y: 35 }; // 当前位置
    const distance = Math.sqrt(
        Math.pow(position.x - currentPos.x, 2) + 
        Math.pow(position.y - currentPos.y, 2)
    ) * 50; // 转换为米
    
    if (distance < 1000) {
        return `${Math.round(distance)}m`;
    } else {
        return `${(distance / 1000).toFixed(1)}km`;
    }
}

// 显示地点详情
function showPlaceDetails(placeId) {
    const place = mockPlaces.find(p => p.id === placeId);
    if (!place) return;
    
    const modal = document.getElementById('placeModal');
    
    // 填充数据
    document.getElementById('placeName').textContent = place.name;
    document.getElementById('placeRating').textContent = `${place.rating}分`;
    document.getElementById('reviewCount').textContent = `${place.reviews}条评论`;
    document.getElementById('placeAddress').textContent = place.address;
    document.getElementById('placePhone').textContent = place.phone;
    document.getElementById('placeHours').textContent = place.hours;
    document.getElementById('placePrice').textContent = place.price;
    document.getElementById('placeDescription').textContent = place.description;
    
    // 更新图标
    document.getElementById('placeImage').innerHTML = `<i class="${place.icon}"></i>`;
    
    // 更新标签
    const tagsContainer = document.getElementById('placeTags');
    tagsContainer.innerHTML = place.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    // 更新评分星星
    const starsContainer = modal.querySelector('.rating-stars');
    const rating = place.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    starsContainer.innerHTML = starsHTML;
    
    modal.style.display = 'flex';
    
    // 高亮标记
    highlightMarker(placeId);
}

// 高亮标记
function highlightMarker(placeId) {
    // 重置所有标记
    mapMarkers.forEach(marker => {
        marker.classList.remove('current-destination');
    });
    
    // 高亮选中标记
    const targetMarker = mapMarkers.find(marker => 
        marker.dataset.placeId === placeId.toString()
    );
    if (targetMarker) {
        targetMarker.classList.add('current-destination');
    }
}

// 关闭地点详情
function closePlaceModal() {
    const modal = document.getElementById('placeModal');
    modal.style.display = 'none';
    
    // 取消高亮
    mapMarkers.forEach(marker => {
        marker.classList.remove('current-destination');
    });
}

// 添加到收藏
function addToFavorites() {
    showMessage('success', '已添加到收藏夹');
    // 这里可以实现实际的收藏功能
}

// 开始导航
function startNavigation() {
    const placeName = document.getElementById('placeName').textContent;
    currentDestination = placeName;
    isNavigating = true;
    
    closePlaceModal();
    
    // 显示导航卡片
    showNavigationCard();
    
    // 显示导航状态
    showNavigationStatus();
    
    // 绘制路线
    drawRoute();
    
    showMessage('success', `开始导航至${placeName}`);
}

// 显示导航卡片
function showNavigationCard() {
    const card = document.getElementById('navigationCard');
    document.getElementById('navTitle').textContent = `前往${currentDestination}`;
    document.getElementById('navSubtitle').textContent = '距离约1.2公里 · 预计8分钟';
    
    card.classList.add('active');
    
    // 生成导航指令
    generateNavigationInstructions();
}

// 生成导航指令
function generateNavigationInstructions() {
    const instructions = [
        { icon: 'fas fa-arrow-up', distance: '200米后', action: '直行进入青羊大道' },
        { icon: 'fas fa-arrow-right', distance: '500米后', action: '右转进入青华路' },
        { icon: 'fas fa-map-marker-alt', distance: '300米后', action: '到达目的地' }
    ];
    
    const container = document.getElementById('navInstructions');
    container.innerHTML = instructions.map((inst, index) => `
        <div class="instruction-item ${index === 0 ? 'active' : ''}">
            <div class="instruction-icon">
                <i class="${inst.icon}"></i>
            </div>
            <div class="instruction-text">
                <span class="distance">${inst.distance}</span>
                <span class="action">${inst.action}</span>
            </div>
        </div>
    `).join('');
}

// 显示导航状态
function showNavigationStatus() {
    const status = document.getElementById('navigationStatus');
    status.style.display = 'block';
    
    // 调整地图容器位置
    const mapContainer = document.querySelector('.map-container');
    mapContainer.style.top = '100px';
}

// 绘制路线
function drawRoute() {
    const routePath = document.getElementById('routePath');
    
    // 创建简单的路线（从当前位置到目标）
    const route = document.createElement('div');
    route.className = 'route-line';
    route.style.left = '30%';
    route.style.top = '35%';
    route.style.width = '200px';
    route.style.height = '4px';
    route.style.transform = 'rotate(25deg)';
    
    routePath.appendChild(route);
}

// 关闭导航
function closeNavigation() {
    const card = document.getElementById('navigationCard');
    card.classList.remove('active');
    
    stopNavigation();
}

// 暂停导航
function pauseNavigation() {
    if (isNavigating) {
        showMessage('info', '导航已暂停');
        // 这里可以实现暂停逻辑
    }
}

// 开始语音导航
function startVoiceNavigation() {
    showMessage('success', '语音导航已开启');
    // 这里可以实现语音导航功能
}

// 停止导航
function stopNavigation() {
    isNavigating = false;
    currentDestination = null;
    
    // 隐藏导航状态
    const status = document.getElementById('navigationStatus');
    status.style.display = 'none';
    
    // 恢复地图容器位置
    const mapContainer = document.querySelector('.map-container');
    mapContainer.style.top = '60px';
    
    // 清除路线
    const routePath = document.getElementById('routePath');
    routePath.innerHTML = '';
    
    // 取消标记高亮
    mapMarkers.forEach(marker => {
        marker.classList.remove('current-destination');
    });
    
    showMessage('info', '导航已结束');
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
        background: ${type === 'success' ? '#52c41a' : type === 'info' ? '#1890ff' : '#ff4d4f'};
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
        closePlaceModal();
        hideSearchSuggestions();
    }
    
    // 回车键执行搜索
    if (e.key === 'Enter' && document.activeElement.id === 'searchInput') {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            performSearch(query);
        }
    }
});

// 点击其他区域隐藏搜索建议
document.addEventListener('click', function(e) {
    const searchBar = document.getElementById('searchBar');
    const placeModal = document.getElementById('placeModal');
    
    if (!searchBar.contains(e.target)) {
        hideSearchSuggestions();
    }
    
    if (e.target === placeModal) {
        closePlaceModal();
    }
});

// 模拟GPS定位
function simulateGPSLocation() {
    showMessage('info', '正在获取当前位置...');
    
    setTimeout(() => {
        const randomX = 25 + Math.random() * 10;
        const randomY = 30 + Math.random() * 10;
        setCurrentLocation(randomX, randomY);
        showMessage('success', '位置获取成功');
    }, 2000);
}

// 导出当前路线
function exportRoute() {
    if (!currentDestination) {
        showMessage('error', '请先设置导航目的地');
        return;
    }
    
    const routeData = {
        destination: currentDestination,
        startTime: new Date().toISOString(),
        estimatedDuration: '8分钟',
        distance: '1.2公里'
    };
    
    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `route_${Date.now()}.json`;
    link.click();
    
    showMessage('success', '路线已导出');
}

// 分享位置
function shareLocation() {
    const currentPos = document.getElementById('currentLocation');
    const rect = currentPos.getBoundingClientRect();
    
    const locationData = {
        name: '我的位置',
        coordinates: {
            x: rect.left,
            y: rect.top
        },
        timestamp: new Date().toISOString()
    };
    
    if (navigator.share) {
        navigator.share({
            title: '蓉易行 - 我的位置',
            text: '我在这里！',
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(JSON.stringify(locationData)).then(() => {
            showMessage('success', '位置信息已复制到剪贴板');
        });
    }
}

// 初始化完成后的设置
setTimeout(() => {
    // 模拟网络状态检查
    if (!navigator.onLine) {
        showMessage('error', '网络连接异常，部分功能可能受限');
    }
    
    // 添加快捷键提示
    console.log('地图导航快捷键：');
    console.log('ESC - 关闭弹窗');
    console.log('Enter - 执行搜索');
    console.log('Space - 暂停/继续导航');
}, 1000); 