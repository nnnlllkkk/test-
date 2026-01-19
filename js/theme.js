// theme.js - управление темами для всего сайта

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('portfolio_theme') || 'light';
        this.init();
    }

    init() {
        // Применяем тему при загрузке
        this.applyTheme();
        
        // Находим кнопку переключения темы
        this.themeToggle = document.getElementById('themeToggle');
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeButton();
        }
        
        console.log('ThemeManager инициализирован. Текущая тема:', this.currentTheme);
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        
        // Сохраняем тему для других страниц
        localStorage.setItem('portfolio_theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateThemeButton();
        
        // Показываем уведомление
        this.showNotification(`Тема изменена на ${this.currentTheme === 'dark' ? 'темную' : 'светлую'}`);
        
        console.log('Тема переключена на:', this.currentTheme);
    }

    updateThemeButton() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i> Светлая';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i> Темная';
        }
    }

    showNotification(message) {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.currentTheme === 'dark' ? '#48BB78' : '#2D3748'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: themeNotificationSlideIn 0.3s ease;
            font-weight: 600;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Добавляем стили для анимации
        if (!document.querySelector('#theme-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-notification-styles';
            style.textContent = `
                @keyframes themeNotificationSlideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes themeNotificationSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'themeNotificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Статические методы для быстрого доступа
    static getCurrentTheme() {
        return localStorage.getItem('portfolio_theme') || 'light';
    }

    static isDarkTheme() {
        return this.getCurrentTheme() === 'dark';
    }

    static applyThemeOnLoad() {
        const theme = localStorage.getItem('portfolio_theme') || 'light';
        document.body.classList.toggle('dark-theme', theme === 'dark');
        return theme;
    }
}

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Применяем сохраненную тему
    ThemeManager.applyThemeOnLoad();
    
    // Создаем экземпляр ThemeManager
    window.themeManager = new ThemeManager();
    
    // Обновляем счетчик корзины на всех страницах
    updateCartCountOnAllPages();
});

// Функция для обновления счетчика корзины
function updateCartCountOnAllPages() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Функция для добавления товара в корзину (для использования из index.html)
function addToCartGlobal(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountOnAllPages();
    
    // Показываем уведомление
    const products = {
        1: 'Веб-сайт "Визитка"',
        2: 'Интернет-магазин',
        3: 'Мобильное приложение',
        4: 'UI/UX Дизайн'
    };
    
    themeManager.showNotification(`Добавлено: ${products[productId] || 'Товар'}`);
    
    return true;
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, addToCartGlobal };
} else {
    window.ThemeManager = ThemeManager;
    window.addToCartGlobal = addToCartGlobal;
}

console.log('ThemeManager загружен. Все функции доступны.');