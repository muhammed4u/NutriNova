//Sections Navigation
import { sidebar } from './main.js';
import { showCurrentSection } from './main.js';
export class SectionsNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastSection = localStorage.getItem('lastSection');
        //bind events
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                //Change URL
                e.preventDefault();
                this.navigate(link.dataset.path);
                this.setActiveSection(link.dataset.path);
                sidebar.closeSidebar();
            });
        });
    }
    navigate(path) {
        window.location.hash = path;
        //history.pushState(null, '', path);    // Use history.pushState if you want a  "URL" without #
    }
    setActiveSection(path) {
        this.navLinks.forEach(nav => {
            const span = nav.querySelector('span');
            if (nav.dataset.path === path) {
                nav.classList.remove('text-slate-300', 'hover:bg-slate-800/50', 'hover:text-white', 'bg-transparent');
                nav.classList.add('text-white', 'bg-violet-600', 'shadow-md', 'shadow-violet-600/20');
                span.classList.replace('font-medium', 'font-semibold');
            }
            else {
                nav.classList.remove('text-white', 'bg-violet-600', 'shadow-md', 'shadow-violet-600/20');
                nav.classList.add('text-slate-300', 'hover:bg-slate-800/50', 'hover:text-white', 'bg-transparent');
                span.classList.replace('font-semibold', 'font-medium');
            }

        });
        localStorage.setItem('lastSection', path)
        showCurrentSection(path);
    }
}