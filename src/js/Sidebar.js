//Sidebar
export class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');
        this.headerMenuBtn = document.getElementById('header-menu-btn')
        this.sidebarCloseBtn = document.getElementById('sidebar-close-btn');
        // We use arrow functions here instead of anonymous functions 
        // because arrow functions preserve the context of `this`.
        // In a regular function, `this` refers to the element that triggered the event (e.g., the button),
        // but with an arrow function, `this` keeps referring to the class instance,
        // allowing us to access class properties and methods correctly.
        if (this.headerMenuBtn) {
            this.headerMenuBtn.addEventListener('click', () => {
                if (this.sidebar) this.sidebar.classList.add('open');
                if (this.sidebarOverlay) this.sidebarOverlay.classList.add('active');
            });
        }
        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

    }
    closeSidebar() {
        if (this.sidebar) this.sidebar.classList.remove('open');
        if (this.sidebarOverlay) this.sidebarOverlay.classList.remove('active');
    }
}