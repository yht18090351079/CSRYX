// 个人中心页面JavaScript
class ProfilePage {
    constructor() {
        this.userData = this.getUserData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserInfo();
        this.loadStatistics();
        this.loadPhotos();
    }

    bindEvents() {
        // 编辑资料按钮
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.showEditProfile());
        }

        // 成就按钮
        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => this.showAchievements());
        }

        // VIP升级按钮
        const upgradeVipBtn = document.getElementById('upgradeVipBtn');
        if (upgradeVipBtn) {
            upgradeVipBtn.addEventListener('click', () => this.upgradeVip());
        }

        // 查看所有照片按钮
        const viewAllPhotosBtn = document.getElementById('viewAllPhotosBtn');
        if (viewAllPhotosBtn) {
            viewAllPhotosBtn.addEventListener('click', () => this.viewAllPhotos());
        }

        // 设置按钮
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // 模态框事件
        this.bindModalEvents();
    }

    bindModalEvents() {
        // 编辑资料模态框
        const editModal = document.getElementById('editProfileModal');
        const closeEditModal = document.getElementById('closeEditModal');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');

        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => this.hideEditProfile());
        }

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.hideEditProfile());
        }

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        if (uploadAvatarBtn) {
            uploadAvatarBtn.addEventListener('click', () => this.uploadAvatar());
        }

        // 点击模态框背景关闭
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.hideEditProfile();
                }
            });
        }
    }

    // 用户数据管理
    getUserData() {
        const defaultData = {
            name: '王小明',
            description: '成都旅游爱好者',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            level: 3,
            tripCount: 3,
            attractionCount: 12,
            totalDistance: 720,
            photoCount: 36,
            isVip: false
        };

        const stored = localStorage.getItem('profile_user_data');
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }

    saveUserData() {
        localStorage.setItem('profile_user_data', JSON.stringify(this.userData));
    }

    // 加载用户信息
    loadUserInfo() {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const tripCount = document.getElementById('tripCount');
        const attractionCount = document.getElementById('attractionCount');

        if (userName) userName.textContent = this.userData.name;
        if (userAvatar) userAvatar.src = this.userData.avatar;
        if (tripCount) tripCount.textContent = this.userData.tripCount;
        if (attractionCount) attractionCount.textContent = this.userData.attractionCount;
    }

    // 加载统计数据
    loadStatistics() {
        const totalTrips = document.getElementById('totalTrips');
        const totalAttractions = document.getElementById('totalAttractions');
        const totalDistance = document.getElementById('totalDistance');
        const photoCount = document.getElementById('photoCount');

        if (totalTrips) totalTrips.textContent = this.userData.tripCount;
        if (totalAttractions) totalAttractions.textContent = this.userData.attractionCount;
        if (totalDistance) totalDistance.textContent = this.userData.totalDistance;
        if (photoCount) photoCount.textContent = this.userData.photoCount;
    }

    // 加载照片网格
    loadPhotos() {
        const photoGrid = document.getElementById('photoGrid');
        if (!photoGrid) return;

        const photos = [
            'https://images.unsplash.com/photo-1609577830099-7b31a9b19b80?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1555633514-abcee5aa70e8?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1541833281671-02b9b5a0dca8?w=200&h=200&fit=crop'
        ];

        photoGrid.innerHTML = photos.map((photo, index) => `
            <div class="photo-item" onclick="profilePage.viewPhoto(${index})">
                <img src="${photo}" alt="旅行照片 ${index + 1}">
            </div>
        `).join('');
    }

    // 编辑资料功能
    showEditProfile() {
        const modal = document.getElementById('editProfileModal');
        const editUserName = document.getElementById('editUserName');
        const editUserDescription = document.getElementById('editUserDescription');
        const avatarPreview = document.getElementById('avatarPreview');

        if (editUserName) editUserName.value = this.userData.name;
        if (editUserDescription) editUserDescription.value = this.userData.description;
        if (avatarPreview) avatarPreview.src = this.userData.avatar;

        if (modal) modal.classList.add('show');
    }

    hideEditProfile() {
        const modal = document.getElementById('editProfileModal');
        if (modal) modal.classList.remove('show');
    }

    saveProfile() {
        const editUserName = document.getElementById('editUserName');
        const editUserDescription = document.getElementById('editUserDescription');
        const avatarPreview = document.getElementById('avatarPreview');

        if (editUserName) this.userData.name = editUserName.value.trim();
        if (editUserDescription) this.userData.description = editUserDescription.value.trim();
        if (avatarPreview) this.userData.avatar = avatarPreview.src;

        if (!this.userData.name) {
            showMessage('请输入昵称', 'error');
            return;
        }

        this.saveUserData();
        this.loadUserInfo();
        this.hideEditProfile();
        showMessage('资料保存成功', 'success');
    }

    uploadAvatar() {
        // 创建文件输入元素
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarPreview = document.getElementById('avatarPreview');
                    if (avatarPreview) {
                        avatarPreview.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    // 成就系统
    showAchievements() {
        const achievements = [
            { name: '初来乍到', description: '完成第一次旅行', unlocked: true, icon: '🎯' },
            { name: '探索达人', description: '访问10个不同景点', unlocked: true, icon: '🗺️' },
            { name: '美食猎人', description: '品尝20种地方美食', unlocked: false, icon: '🍜' },
            { name: '旅行专家', description: '完成10次旅行', unlocked: false, icon: '✈️' },
            { name: '摄影达人', description: '上传100张旅行照片', unlocked: false, icon: '📸' },
            { name: '社交明星', description: '获得100个点赞', unlocked: false, icon: '⭐' }
        ];

        const content = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
                <div class="achievement-status">
                    ${achievement.unlocked ? '✅' : '🔒'}
                </div>
            </div>
        `).join('');

        this.showCustomModal('我的成就', content);
    }

    // VIP功能
    upgradeVip() {
        if (this.userData.isVip) {
            showMessage('您已经是VIP会员', 'info');
            return;
        }

        const confirmUpgrade = confirm('确定要升级VIP会员吗？\n\n特权包括：\n• 无广告体验\n• 专属客服\n• 高级功能解锁\n\n限时优惠价：¥68/年');
        
        if (confirmUpgrade) {
            // 模拟支付流程
            showMessage('正在跳转到支付页面...', 'info');
            
            setTimeout(() => {
                this.userData.isVip = true;
                this.saveUserData();
                showMessage('恭喜您成为VIP会员！', 'success');
                this.updateVipStatus();
            }, 2000);
        }
    }

    updateVipStatus() {
        const vipCard = document.querySelector('.vip-card');
        if (vipCard && this.userData.isVip) {
            vipCard.innerHTML = `
                <div class="vip-header">
                    <h3 class="vip-title">
                        <i class="fas fa-crown"></i>
                        VIP会员
                    </h3>
                    <div class="vip-badge">已激活</div>
                </div>
                <p class="vip-description">
                    <i class="fas fa-check-circle"></i>
                    感谢您的支持
                </p>
                <div class="vip-benefits">
                    <div class="benefit-item">
                        <i class="fas fa-ad"></i>
                        <span>无广告体验</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-headset"></i>
                        <span>专属客服</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-unlock"></i>
                        <span>高级功能已解锁</span>
                    </div>
                </div>
                <button class="vip-upgrade-btn" onclick="profilePage.manageVip()">
                    <i class="fas fa-cog"></i>
                    管理会员
                </button>
            `;
        }
    }

    manageVip() {
        const content = `
            <div class="vip-management">
                <div class="vip-info">
                    <h4>会员信息</h4>
                    <p>类型：年度VIP会员</p>
                    <p>到期时间：2024年12月31日</p>
                    <p>剩余天数：365天</p>
                </div>
                <div class="vip-actions">
                    <button class="btn secondary" onclick="profilePage.renewVip()">续费会员</button>
                    <button class="btn secondary" onclick="profilePage.contactVipService()">联系客服</button>
                </div>
            </div>
        `;
        this.showCustomModal('VIP会员管理', content);
    }

    renewVip() {
        showMessage('续费功能开发中', 'info');
    }

    contactVipService() {
        showMessage('正在为您接入专属客服...', 'info');
    }

    // 照片功能
    viewPhoto(index) {
        showMessage(`查看第${index + 1}张照片`, 'info');
        // 这里可以实现照片预览功能
    }

    viewAllPhotos() {
        showMessage('查看所有旅行照片', 'info');
        // 跳转到照片相册页面
    }

    // 设置功能
    openSettings() {
        const settingsItems = [
            { icon: 'fas fa-bell', title: '消息通知', subtitle: '推送设置' },
            { icon: 'fas fa-shield-alt', title: '隐私设置', subtitle: '信息可见性' },
            { icon: 'fas fa-palette', title: '主题设置', subtitle: '界面个性化' },
            { icon: 'fas fa-language', title: '语言设置', subtitle: '界面语言' },
            { icon: 'fas fa-info-circle', title: '关于我们', subtitle: '版本信息' },
            { icon: 'fas fa-sign-out-alt', title: '退出登录', subtitle: '安全退出' }
        ];

        const content = settingsItems.map(item => `
            <div class="settings-item" onclick="profilePage.handleSetting('${item.title}')">
                <div class="settings-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="settings-content">
                    <h4>${item.title}</h4>
                    <p>${item.subtitle}</p>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `).join('');

        this.showCustomModal('设置', content);
    }

    handleSetting(settingType) {
        switch (settingType) {
            case '消息通知':
                this.showNotificationSettings();
                break;
            case '隐私设置':
                this.showPrivacySettings();
                break;
            case '主题设置':
                this.showThemeSettings();
                break;
            case '语言设置':
                this.showLanguageSettings();
                break;
            case '关于我们':
                this.showAbout();
                break;
            case '退出登录':
                this.logout();
                break;
        }
    }

    showNotificationSettings() {
        showMessage('通知设置功能开发中', 'info');
    }

    showPrivacySettings() {
        showMessage('隐私设置功能开发中', 'info');
    }

    showThemeSettings() {
        showMessage('主题设置功能开发中', 'info');
    }

    showLanguageSettings() {
        showMessage('语言设置功能开发中', 'info');
    }

    showAbout() {
        const content = `
            <div class="about-content">
                <div class="app-info">
                    <h4>蓉易行 AI旅游规划</h4>
                    <p>版本：v1.0.0</p>
                    <p>发布日期：2024年3月</p>
                </div>
                <div class="company-info">
                    <p>© 2024 蓉易行科技有限公司</p>
                    <p>让每一次旅行都精彩</p>
                </div>
            </div>
        `;
        this.showCustomModal('关于我们', content);
    }

    logout() {
        const confirmLogout = confirm('确定要退出登录吗？');
        if (confirmLogout) {
            localStorage.clear();
            showMessage('已退出登录', 'success');
            setTimeout(() => {
                navigateToPage('index.html');
            }, 1000);
        }
    }

    // 通用模态框
    showCustomModal(title, content) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    window.profilePage = new ProfilePage();
    
    // 检查VIP状态
    if (window.profilePage.userData.isVip) {
        window.profilePage.updateVipStatus();
    }
});

// 页面导航功能
function navigateToPage(page) {
    if (typeof navigateToPage !== 'undefined') {
        navigateToPage(page);
    } else {
        window.location.href = page;
    }
}

// 返回功能
function goBack() {
    history.back();
} 