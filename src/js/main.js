/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
import { Sidebar } from './Sidebar.js';
import { SectionsNavigation } from './SectionsNavigation.js';
import { MealSection } from './MealSection.js';
import { MealDetails } from './MealDetails.js';
import { FoodLogSection } from './FoodLogSection.js';
import { ProductsSection } from './ProductsSection.js';

//==========================Variables==========================
//const sections = document.querySelectorAll('section');
export const loadingScreen = document.getElementById('app-loading-overlay');
const headerH1 = document.getElementById('page-title');
const headerP = document.getElementById('page-desc');
//========================== Initialize Classes Object==========================
//Side bar
export const sidebar = new Sidebar();
export const sectionsNavigation = new SectionsNavigation();

export const mealSection = new MealSection();
export const mealDetails = new MealDetails();
const productsSection = new ProductsSection();
export const foodLogSection = new FoodLogSection();

//==========================Functions==========================
//General

export function showCurrentSection(section) {
    if (section === 'home') {
        headerH1.textContent = 'Meals & Recipes';
        headerP.textContent = 'Discover delicious and nutritious recipes tailored for you';
        mealSection.showSection();
        if (mealDetails) {
            mealDetails.hideSection();
        }
        productsSection.hideSection();
        foodLogSection.hideSection();

    }
    else if (section === 'products') {
        headerH1.textContent = 'Product Scanner';
        headerP.textContent = 'Search packaged foods by name or barcode';
        if (mealDetails) {
            mealDetails.hideSection();
        }
        mealSection.hideSection();
        productsSection.showSection();
        foodLogSection.hideSection();
    }
    else if (section === 'foodlog') {
        headerH1.textContent = 'Food Log';
        headerP.textContent = 'Track your daily nutrition and food intake';
        if (mealDetails) {
            mealDetails.hideSection();
        }
        mealSection.hideSection();
        productsSection.hideSection();
        foodLogSection.showSection();
    }
    //mealDetails.hideSection();

}
//==========================Events==========================
//General

window.addEventListener('DOMContentLoaded', () => {
    // Always default to home page on load
    sectionsNavigation.setActiveSection('home');
});


