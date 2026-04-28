import { loadingScreen, mealDetails } from './main.js';

const mealIcons = {
    Beef: 'fa-solid fa-drumstick-bite',
    Chicken: 'fa-solid fa-drumstick-bite',
    Dessert: 'fa fa-cake-candles',
    Lamb: 'fa-solid fa-drumstick-bite',
    Miscellaneous: 'fa fa-bowl-rice',
    Pasta: 'fa-solid fa-bowl-food',
    Pork: 'fa-solid fa-bacon',
    Seafood: 'fa-solid fa-fish',
    Side: 'fa fa-plate-wheat',
    Starter: 'fa fa-utensils',
    Vegan: 'fa-solid fa-leaf',
    Vegetarian: 'fa-solid fa-seedling',
    Breakfast: 'fa-solid fa-mug-hot',
    Goat: 'fa-solid fa-drumstick-bite'
};
const gradients = [
    {
        cardBg: "from-violet-900/40 to-fuchsia-900/40",
        iconBg: "from-violet-500 to-fuchsia-500",
        border: "border-violet-500/30",
        borderHover: "hover:border-violet-400"
    },
    {
        cardBg: "from-orange-900/40 to-amber-900/40",
        iconBg: "from-orange-400 to-amber-500",
        border: "border-orange-500/30",
        borderHover: "hover:border-orange-400"
    },
    {
        cardBg: "from-rose-900/40 to-pink-900/40",
        iconBg: "from-rose-400 to-pink-500",
        border: "border-rose-500/30",
        borderHover: "hover:border-rose-400"
    },
    {
        cardBg: "from-teal-900/40 to-cyan-900/40",
        iconBg: "from-sky-400 to-cyan-500",
        border: "border-teal-500/30",
        borderHover: "hover:border-teal-400"
    },
    {
        cardBg: "from-slate-800/40 to-slate-700/40",
        iconBg: "from-slate-400 to-gray-500",
        border: "border-slate-500/30",
        borderHover: "hover:border-slate-400"
    },
    {
        cardBg: "from-lime-900/40 to-green-900/40",
        iconBg: "from-lime-400 to-emerald-500",
        border: "border-lime-500/30",
        borderHover: "hover:border-lime-400"
    }
];

export class MealSection {
    constructor() {


        this.searchFiltersSection = document.getElementById('search-filters-section');
        this.mealCategoriesSection = document.getElementById('meal-categories-section');
        this.allRecipeSection = document.getElementById('all-recipes-section');
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.listViewBtn = document.getElementById('list-view-btn');
        this.searchMealBtn = document.getElementById('search-input');
        this.recipesGrid = document.getElementById('recipes-grid');


        //3lamt el ta7mel el so8yra elly fi mkan all recpies
        this.loadingMeals = document.getElementById('loading-meals');
        this.recipesCards;

        //The way to display meals
        this.listViewBtn.addEventListener('click', () => {
            this.listViewBtn.classList.add('rounded-md', 'bg-slate-900/40', 'backdrop-blur-xl', 'border', 'border-slate-700/50', 'shadow-2xl', 'shadow-sm');
            this.gridViewBtn.classList.remove('rounded-md', 'bg-slate-900/40', 'backdrop-blur-xl', 'border', 'border-slate-700/50', 'shadow-2xl', 'shadow-sm');
            this.listViewBtn.querySelector('i').classList.replace('text-slate-400', 'text-slate-200');
            this.gridViewBtn.querySelector('i').classList.replace('text-slate-200', 'text-slate-400');

            this.recipesGrid.className = `grid grid-cols-2 gap-4`;


            this.recipesCards = document.querySelectorAll('.recipe-card');
            this.recipesCards = document.querySelectorAll('.recipe-card');
            this.recipesCards.forEach(card => {
                const flipContainer = card.querySelector('.flip-container');
                if(flipContainer) {
                    flipContainer.classList.remove('[transform-style:preserve-3d]', 'group-hover:[transform:rotateY(180deg)]', 'group-hover:scale-[1.02]');
                    flipContainer.classList.add('flex', 'flex-row', 'h-full');
                }
                
                const front = card.querySelector('.front-face');
                const back = card.querySelector('.back-face');
                
                card.classList.remove('h-80');
                card.classList.add('h-48'); // slightly taller for list view
                
                if(front) {
                    front.classList.remove('absolute', 'inset-0', 'w-full');
                    front.classList.add('relative', 'w-48', 'h-full', 'flex-shrink-0', 'rounded-r-none', 'border-r-0');
                    front.querySelector('.bottom-4').classList.add('hidden'); // hide badges in list view if needed, or keep them
                }
                
                if(back) {
                    back.classList.remove('absolute', 'inset-0', 'w-full', '[transform:rotateY(180deg)]');
                    back.classList.add('relative', 'flex-1', 'h-full', 'rounded-l-none');
                }
            })

        })

        this.gridViewBtn.addEventListener('click', () => {
            this.listViewBtn.classList.remove('rounded-md', 'bg-slate-900/40', 'backdrop-blur-xl', 'border', 'border-slate-700/50', 'shadow-2xl', 'shadow-sm');
            this.gridViewBtn.classList.add('rounded-md', 'bg-slate-900/40', 'backdrop-blur-xl', 'border', 'border-slate-700/50', 'shadow-2xl', 'shadow-sm');
            this.gridViewBtn.querySelector('i').classList.replace('text-slate-400', 'text-slate-200');
            this.listViewBtn.querySelector('i').classList.replace('text-slate-200', 'text-slate-400');

            this.recipesGrid.className = `grid grid-cols-4 gap-5`;
            this.recipesCards = document.querySelectorAll('.recipe-card');

            this.recipesCards.forEach(card => {
                const flipContainer = card.querySelector('.flip-container');
                if(flipContainer) {
                    flipContainer.classList.add('[transform-style:preserve-3d]', 'group-hover:[transform:rotateY(180deg)]', 'group-hover:scale-[1.02]');
                    flipContainer.classList.remove('flex', 'flex-row', 'h-full');
                }
                
                const front = card.querySelector('.front-face');
                const back = card.querySelector('.back-face');
                
                card.classList.add('h-80');
                card.classList.remove('h-48');
                
                if(front) {
                    front.classList.add('absolute', 'inset-0', 'w-full');
                    front.classList.remove('relative', 'w-48', 'h-full', 'flex-shrink-0', 'rounded-r-none', 'border-r-0');
                    front.querySelector('.bottom-4').classList.remove('hidden');
                }
                
                if(back) {
                    back.classList.add('absolute', 'inset-0', 'w-full', '[transform:rotateY(180deg)]');
                    back.classList.remove('relative', 'flex-1', 'h-full', 'rounded-l-none');
                }
            })
        })
        this.searchMealBtn.addEventListener('input', () => {
            this.searchMeals(this.searchMealBtn.value);
        })

        this.hideSection();
        this.loadMealPage();
    }
    async loadMealPage() {
        loadingScreen.classList.remove('loading');
        await this.getAreas();
        await this.getCatigories();
        await this.filterMeals('', '', 25);
        loadingScreen.classList.add('loading');
    }
    showSection() {
        //show sections
        this.searchFiltersSection.classList.remove('hidden');
        this.mealCategoriesSection.classList.remove('hidden');
        this.allRecipeSection.classList.remove('hidden');

    }
    hideSection() {
        this.searchFiltersSection.classList.add('hidden');
        this.mealCategoriesSection.classList.add('hidden');
        this.allRecipeSection.classList.add('hidden');
    }

    async getCatigories() {
        try {
            let response = await fetch('https://nutriplan-api.vercel.app/api/meals/categories');
            let categoriesJson = await response.json();
            let categories = categoriesJson.results;

            let categoriesSection = document.getElementById('categories-grid');
            let boxCategories = ``;

            for (let i = 0; i < categories.length; i++) {
                //  console.log(categories[i].name);
                let randomColor = Math.floor(Math.random() * gradients.length);
                boxCategories += `  <div
            class="category-card bg-gradient-to-br ${gradients[randomColor].cardBg} rounded-xl p-3 border ${gradients[randomColor].border} ${gradients[randomColor].borderHover} hover:shadow-md cursor-pointer transition-all group"
            data-category="${categories[i].name}">
            <div class="flex items-center gap-2.5">
              <div
                class="text-white w-9 h-9 bg-gradient-to-br ${gradients[randomColor].iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <i class="${mealIcons[categories[i].name]}"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">${categories[i].name}</h3>
              </div>
            </div>
          </div>`
                if (i == 11) {
                    break
                }
            }
            categoriesSection.innerHTML = boxCategories;
            const categoryCards = categoriesSection.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                card.addEventListener('click', () => {
                    const categoryName = card.getAttribute('data-category');
                    //OR
                    //const categoryName = card.dataset.category;
                    this.filterMeals(categoryName);
                })
            });

        }
        catch (error) {
            console.log(error);
        }
    }

    async getAreas() {
        try {
            let response = await fetch('https://nutriplan-api.vercel.app/api/meals/areas');
            let areasJson = await response.json();
            let areas = areasJson.results;
            let cuisinesSection = document.getElementById('cuisines-Section');


            // console.log(areas);
            for (var i = 0; i < areas.length; i++) {
                const btn = document.createElement('button');
                btn.className = "area-filter-btn px-4 py-2 bg-slate-800/40 backdrop-blur-md text-slate-200 rounded-full font-medium text-sm whitespace-nowrap hover:bg-slate-700/40 transition-all";
                btn.dataset.area = areas[i].name;
                btn.textContent = `${areas[i].name}`
                cuisinesSection.appendChild(btn)
                if (i == 9) { break; }
            }
            const allButtons = cuisinesSection.querySelectorAll('button');
            allButtons.forEach(button => {
                button.addEventListener('click', () => {
                    allButtons.forEach(inActiveBtn => {
                        inActiveBtn.classList.remove('bg-violet-600', 'text-white', 'hover:bg-violet-700');
                        inActiveBtn.classList.add('bg-slate-800/40', 'backdrop-blur-md', 'text-slate-200', 'hover:bg-slate-700/40');
                    });
                    //setActive button
                    button.classList.add('bg-violet-600', 'text-white', 'hover:bg-violet-700');
                    button.classList.remove('bg-slate-800/40', 'backdrop-blur-md', 'text-slate-200', 'hover:bg-slate-700/40');
                    //console.log(button);
                    const areaName = button.getAttribute('data-area');
                    //OR
                    //const areaName = button.dataset.area;
                    if (areaName) { this.filterMeals('', areaName); }
                    else {
                        this.filterMeals();
                    }


                })
            });

        }
        catch (error) {
            console.log(error);
        }
    }
    async filterMeals(category = '', area = '', limit = 20) {
        let calledWithoutParams;
        if (category === '' && area === '') {
            category = 'Chicken';
            calledWithoutParams = true;
        }
        this.recipesGrid.innerHTML = `    <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>`
        try {
            const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&area=${area}&limit=${limit}`);
            const mealsJson = await response.json();
            const meals = mealsJson.results ?? [];
            const recipesCount = document.getElementById('recipes-count');
            // const recipesGrid = document.getElementById('recipes-grid');
            recipesCount.textContent = `Showing ${meals.length} ${calledWithoutParams ? "" : category || area} recipes`
            this.showMeals(meals)
            //this.loadingMeals.classList.add('loading');
        }
        catch (error) {
            console.log(error);
        }

    }
    async searchMeals(term) {
        term = term.toLowerCase();
        if (term.length <= 0) {
            this.filterMeals('', '', 25);
        }
        let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${term}`);
        let searchResult = await response.json();
        const meals = searchResult.results ?? [];

        const recipesCount = document.getElementById('recipes-count');

        recipesCount.textContent = `Showing ${meals.length} recipes for ${term}`
        this.showMeals(meals)
    }
    showMeals(meals) {
        if (meals.length === 0) {
            this.recipesGrid.innerHTML = `<div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-slate-800/40 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                <i class="fa fa-magnifying-glass text-2xl text-slate-500" > </i>
            </div>
            <p class="text-slate-400 text-lg">No recipes found. Try a different search term.</p>
        </div>`
        }
        else {
            // const recipesGrid = document.getElementById('recipes-grid');
            let box = ``;

            // console.log(recipesCount);

            for (var i = 0; i < meals.length; i++) {
                //    console.log(meals[i]);

                box += `
              <div class="recipe-card group perspective-[1000px] cursor-pointer h-80" data-meal-id="${meals[i].id}">
            <div class="flip-container relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-[1.02]">
              
              <!-- Front Face -->
              <div class="front-face absolute inset-0 w-full h-full [backface-visibility:hidden] bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                <div class="relative flex-1 w-full overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10 pointer-events-none"></div>
                  <img class="w-full h-full object-cover" src="${meals[i].thumbnail}" alt="${meals[i].name}" loading="lazy" />
                  <div class="absolute bottom-4 left-4 right-4 z-20">
                    <h3 class="text-xl font-bold text-white mb-2 line-clamp-1 drop-shadow-md">${meals[i].name}</h3>
                    <div class="flex gap-2">
                       <span class="px-3 py-1 bg-violet-600/90 backdrop-blur-md border border-violet-500/50 text-xs font-bold rounded-xl text-white shadow-lg flex items-center">
                          <i class="fa-solid fa-earth-americas mr-1.5"></i>${meals[i].area}
                       </span>
                       <span class="px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-xs font-bold rounded-xl text-slate-200 shadow-lg flex items-center">
                          <i class="fa-solid fa-utensils text-violet-400 mr-1.5"></i>${meals[i].category}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Back Face -->
              <div class="back-face absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900/95 backdrop-blur-xl border border-violet-500/50 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(139,92,246,0.2)] p-5 flex flex-col">
                <h3 class="text-lg font-bold text-violet-400 mb-3 border-b border-slate-700/50 pb-2 line-clamp-1">${meals[i].name}</h3>
                <p class="text-sm text-slate-300 mb-4 overflow-y-auto custom-scrollbar flex-1 pr-2 leading-relaxed text-left">
                  ${meals[i].instructions[0] || 'No instructions available.'}
                </p>
                <div class="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                  <span class="text-xs font-bold text-slate-300 flex items-center">
                    <i class="fa-regular fa-clock text-fuchsia-400 mr-1.5 text-sm"></i> 25 mins
                  </span>
                  <span class="text-xs font-bold text-slate-300 flex items-center">
                    <i class="fa-solid fa-fire text-orange-400 mr-1.5 text-sm"></i> 320 kcal
                  </span>
                </div>
              </div>
              
            </div>
          </div>
            `;
            }
            this.recipesGrid.innerHTML = box;
            ////////////////////////IMPORTANT//////////////////////////////////
            //3shan myzhrsh 8air lma ykon feh meals n2dr nf7ha

        }
        this.recipeCards = document.querySelectorAll('.recipe-card');
        this.recipeCards.forEach(card => {
            card.addEventListener('click', () => {
                console.log('loggedMeal0', mealDetails.loggedMeal);

                mealDetails.loggedMeal = {
                    id_barcode: '',
                    category: '',
                    loggedAt: '',
                    name: '',
                    type: '',
                    thumbnail: '',
                    servings: '',
                    nutrition: {
                        calories: '',
                        carbs: '',
                        fat: '',
                        protein: ''
                    }
                }
                console.log('loggedMeal1', mealDetails.loggedMeal);
                mealDetails.showSection();
                mealDetails.getMealDetails(card.getAttribute('data-meal-id'));
                console.log('loggedMeal2', mealDetails.loggedMeal);


            })
        });
    }
}