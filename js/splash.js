// 启动页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 启动页面自动跳转
    setTimeout(() => {
        Navigation.goTo('home');
    }, 3000);
    
    // 点击跳过
    document.addEventListener('click', function() {
        Navigation.goTo('home');
    });
    
    // 键盘ESC跳过
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            Navigation.goTo('home');
        }
    });
}); 