import { sectionsNavigation ,showCurrentSection } from './main.js';
export class FoodLogSection {
    constructor() {
        this.foodlogSection = document.getElementById('foodlog-section');
        this.foodlogTodayDate = document.getElementById('foodlog-date');
        this.emptyLogSection = document.getElementById('no-log-meals');
        this.loggedItemsList = document.getElementById('logged-items-list');
        this.loggedMealCount = document.getElementById('logged-meal-count'); //  Logged Items (0)
        this.clearFoodlogBtn = document.getElementById('clear-foodlog');// clear all
        this.logProgressBars = document.getElementById('log-progress-bars');

        //reassign again after displaying all meals
        this.removeIfoodlogItems = document.querySelectorAll('.remove-foodlog-item');

        this.todaysDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        this.foodlogTodayDate.textContent = this.todaysDate;
        this.loggedMeals = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: []
        }

        //bind Clear ALL button
        this.clearFoodlogBtn.addEventListener('click', () => {
            Swal.fire({
                title: "Clear Today's Log?",
                text: "This will remove all logged food items for today.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, clear it!",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#dc2626", // red
                cancelButtonColor: "#9ca3af"   // optional: gray
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        // Clear loggedMeals
                        this.loggedMeals = {
                            totalCalories: 0,
                            totalProtein: 0,
                            totalCarbs: 0,
                            totalFat: 0,
                            meals: []
                        };
                        const today = this.getTodayKey();
                        const dailyLog = this.getDailyLog();

                        delete dailyLog[today];
                        localStorage.setItem('nutriplan_daily_log', JSON.stringify(dailyLog));

                        this.showLoggedMeals();
                        Swal.fire("Cleared!", "Food log has been cleared.", "success");
                    }
                    catch (error) {
                        console.error("Failed to clear food log:", error);
                        Swal.fire({
                            title: "Failed!",
                            text: "Could not clear today's food log. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#dc2626"
                        });
                    }
                }
            });
        });


        this.showLoggedMeals();
        this.hideSection();
    }
    showSection() {
        //show sections
        this.foodlogSection.classList.remove('hidden');
        //update Date
        this.todaysDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        this.foodlogTodayDate.textContent = this.todaysDate;
        this.showLoggedMeals();
    }
    hideSection() {
        this.foodlogSection.classList.add('hidden');
    }


    logMeal(meal) {
        // Load previous meals from localStorage if any

        const today = this.getTodayKey();
        const dailyLog = this.getDailyLog();
        if (!dailyLog[today]) {
            dailyLog[today] = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                meals: []
            }
        }
        // Add the new meal
        dailyLog[today].meals.push(meal);
        // Update localStorage
        this.saveDailyLog(dailyLog);
        this.showLoggedMeals();
    }

    showLoggedMeals() {
        this.loggedMeals = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: []
        }
        const today = this.getTodayKey();
        const dailyLog = this.getDailyLog();

        if (!dailyLog[today] || dailyLog[today].meals.length === 0) {
            // empty state
            this.loggedItemsList.innerHTML = `
             <div id="no-log-meals" class="text-center py-8 text-slate-400">
                <div class="w-20 h-20 bg-slate-800/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="text-3xl text-gray-300 fa fa-utensils">
                  </i>
                </div>
                <p class="text-slate-400 font-medium mb-2">No food logged today</p>
                <p class="text-slate-500 text-sm mb-4">Start tracking your nutrition by logging meals or scanning
                  products</p>
                <div class="flex justify-center gap-3">
                  <button id="browse-recipes-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                    <i class="fa fa-plus"></i>
                    Browse Recipes
                  </button>
                  <button id="scan-product-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                    <i class="fa fa-barcode"> </i>
                    Scan Product
                  </button>
                </div>
              </div>
            `;
            document.getElementById('browse-recipes-btn').addEventListener('click', () => {
                sectionsNavigation.setActiveSection('home');
                showCurrentSection('home');
            });

            document.getElementById('scan-product-btn').addEventListener('click', () => {
                sectionsNavigation.setActiveSection('products');
                showCurrentSection('products');
            });
            this.clearFoodlogBtn.classList.add('hidden');
            this.showWeeklyProgress();
            this.loggedMealCount.innerHTML = `Logged Items (0)`
            this.logProgressBars.innerHTML = `     <!-- Calories Progress -->
            <div class="bg-violet-900/20 backdrop-blur-md border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-violet-300">Calories</span>
                <span class="text-sm text-slate-400">0 / 2000 kcal</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="bg-violet-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style="width: 0%"></div>
              </div>
            </div>
            <!-- Protein Progress -->
            <div class="bg-blue-900/20 backdrop-blur-md border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-blue-300">Protein</span>
                <span class="text-sm text-slate-400">0 / 50 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="bg-blue-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style="width: 0%"></div>
              </div>
            </div>
            <!-- Carbs Progress -->
            <div class="bg-amber-900/20 backdrop-blur-md border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-amber-300">Carbs</span>
                <span class="text-sm text-slate-400">0 / 250 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="bg-amber-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style="width: 0%"></div>
              </div>
            </div>
            <!-- Fat Progress -->
            <div class="bg-purple-900/20 backdrop-blur-md border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-purple-300">Fat</span>
                <span class="text-sm text-slate-400">0 / 65 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="bg-purple-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style="width: 0%"></div>
              </div>
            </div>`;
            return;
        }

        this.loggedMeals.meals = dailyLog[today].meals;
        this.emptyLogSection.classList.add('hidden');
        this.clearFoodlogBtn.classList.remove('hidden');
        this.loggedMealCount.innerHTML = `Logged Items (${this.loggedMeals.meals.length})`

        let box = ``;
        for (let i = 0; i < this.loggedMeals.meals.length; i++) {
            this.loggedMeals.totalCalories += Number(this.loggedMeals.meals[i].nutrition.calories) * Number(this.loggedMeals.meals[i].servings);
            this.loggedMeals.totalProtein += Number(this.loggedMeals.meals[i].nutrition.protein) * Number(this.loggedMeals.meals[i].servings);
            this.loggedMeals.totalFat += Number(this.loggedMeals.meals[i].nutrition.fat) * Number(this.loggedMeals.meals[i].servings);
            this.loggedMeals.totalCarbs += Number(this.loggedMeals.meals[i].nutrition.carbs) * Number(this.loggedMeals.meals[i].servings);
            box += `
                <div class="flex items-center justify-between bg-transparent rounded-xl p-4 hover:bg-slate-800/40 backdrop-blur-md transition-all">
                        <div class="flex items-center gap-4">
                            <img src="${this.loggedMeals.meals[i].thumbnail}" alt="${this.loggedMeals.meals[i].name}" class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-white">${this.loggedMeals.meals[i].name}</p>
                                <p class="text-sm text-slate-400">
                                    ${this.loggedMeals.meals[i].servings} serving
                                    <span class="mx-1">•</span>
                                    <span class="text-violet-400">${this.loggedMeals.meals[i].type}</span>
                                </p>
                                <p class="text-xs text-slate-500 mt-1">${this.loggedMeals.meals[i].loggedAt}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-violet-400">${Number(this.loggedMeals.meals[i].nutrition.calories) * Number(this.loggedMeals.meals[i].servings)}</p>
                                <p class="text-xs text-slate-400">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-slate-400">
                                <span class="px-2 py-1 bg-blue-50 rounded">${Number(this.loggedMeals.meals[i].nutrition.protein) * Number(this.loggedMeals.meals[i].servings)}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${Number(this.loggedMeals.meals[i].nutrition.carbs) * Number(this.loggedMeals.meals[i].servings)}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${Number(this.loggedMeals.meals[i].nutrition.fat) * Number(this.loggedMeals.meals[i].servings)}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-slate-500 hover:text-red-500 transition-all p-2" data-index="${i}")">
                                <i class="fa fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
        }
        console.log(this.loggedMeals);
        this.loggedItemsList.innerHTML = box;

        this.removeIfoodlogItems = document.querySelectorAll('.remove-foodlog-item');
        this.removeIfoodlogItems.forEach(btn => {
            btn.addEventListener('click', () => {

                this.deleteItem(Number(btn.getAttribute('data-index')))
            })
        })

        //Update Progress bars 
        this.logProgressBars.innerHTML = `

            <!-- Calories Progress -->
            <div class="${((Number(this.loggedMeals.totalCalories) / 2000) * 100) > 100 ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-violet-900/20 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]'} backdrop-blur-md border rounded-xl p-4 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold ${((Number(this.loggedMeals.totalCalories) / 2000) * 100) > 100 ? 'text-red-400' : 'text-violet-300'}">Calories</span>
                <span class="text-sm text-slate-400">${this.loggedMeals.totalCalories} / 2000 kcal</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="${((Number(this.loggedMeals.totalCalories) / 2000) * 100) > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'} h-2.5 rounded-full transition-all" style="width: ${Math.min(Math.round((Number(this.loggedMeals.totalCalories) / 2000) * 100), 100)}%"></div>
              </div>
            </div>
            <!-- Protein Progress -->
            <div class="${((Number(this.loggedMeals.totalProtein) / 50) * 100) > 100 ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-blue-900/20 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'} backdrop-blur-md border rounded-xl p-4 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold ${((Number(this.loggedMeals.totalProtein) / 50) * 100) > 100 ? 'text-red-400' : 'text-blue-300'}">Protein</span>
                <span class="text-sm text-slate-400">${this.loggedMeals.totalProtein} / 50 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="${((Number(this.loggedMeals.totalProtein) / 50) * 100) > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'} h-2.5 rounded-full transition-all" style="width: ${Math.min(Math.round((Number(this.loggedMeals.totalProtein) / 50) * 100), 100)}%"></div>
              </div>
            </div>
            <!-- Carbs Progress -->
            <div class="${((Number(this.loggedMeals.totalCarbs) / 250) * 100) > 100 ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-amber-900/20 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'} backdrop-blur-md border rounded-xl p-4 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold ${((Number(this.loggedMeals.totalCarbs) / 250) * 100) > 100 ? 'text-red-400' : 'text-amber-300'}">Carbs</span>
                <span class="text-sm text-slate-400"> ${this.loggedMeals.totalCarbs}/ 250 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="${((Number(this.loggedMeals.totalCarbs) / 250) * 100) > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} h-2.5 rounded-full transition-all" style="width: ${Math.min(Math.round((Number(this.loggedMeals.totalCarbs) / 250) * 100), 100)}%"></div>
              </div>
            </div>
            <!-- Fat Progress -->
            <div class="${((Number(this.loggedMeals.totalFat) / 65) * 100) > 100 ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-purple-900/20 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'} backdrop-blur-md border rounded-xl p-4 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold ${((Number(this.loggedMeals.totalFat) / 65) * 100) > 100 ? 'text-red-400' : 'text-purple-300'}">Fat</span>
                <span class="text-sm text-slate-400">${this.loggedMeals.totalFat} / 65 g</span>
              </div>
              <div class="w-full bg-slate-800/60 rounded-full h-2.5">
                <div class="${((Number(this.loggedMeals.totalFat) / 65) * 100) > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'} h-2.5 rounded-full transition-all" style="width: ${Math.min(Math.round((Number(this.loggedMeals.totalFat) / 65) * 100), 100)}%"></div>
              </div>
            </div>
            `;

        this.showWeeklyProgress();
        // if (this.loggedMeals.meals.length <= 0) {
        //     this.loggedItemsList.innerHTML = `
        //      <div id="no-log-meals" class="text-center py-8 text-slate-400">
        //         <div class="w-20 h-20 bg-slate-800/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
        //           <i class="text-3xl text-gray-300 fa fa-utensils">
        //           </i>
        //         </div>
        //         <p class="text-slate-400 font-medium mb-2">No food logged today</p>
        //         <p class="text-slate-500 text-sm mb-4">Start tracking your nutrition by logging meals or scanning
        //           products</p>
        //         <div class="flex justify-center gap-3">
        //           <button id="browse-recipes-btn"
        //             class="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
        //             <i class="fa fa-plus"></i>
        //             Browse Recipes
        //           </button>
        //           <button id="scan-product-btn"
        //             class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
        //             <i class="fa fa-barcode"> </i>
        //             Scan Product
        //           </button>
        //         </div>
        //       </div>
        //     `;
        //     document.getElementById('browse-recipes-btn').addEventListener('click', () => {
        //         sectionsNavigation.setActiveSection('home');
        //         showCurrentSection('home');
        //     });

        //     document.getElementById('scan-product-btn').addEventListener('click', () => {
        //         sectionsNavigation.setActiveSection('products');
        //         showCurrentSection('products');
        //     });
        //     this.clearFoodlogBtn.classList.add('hidden');
        // }
    }

    deleteItem(indexToRemove) {
        const notyf = new Notyf({
            position: {
                x: 'right',
                y: 'bottom',
            },
            types: [
                {
                    type: 'success',
                    background: '#2563eb',
                    icon: false
                },
                {
                    type: 'error',
                    background: '#dc2626',
                    icon: false
                }
            ]
        });
        try {
            this.loggedMeals.totalCalories = 0;
            this.loggedMeals.totalProtein = 0;
            this.loggedMeals.totalFat = 0;
            this.loggedMeals.totalCarbs = 0;
            this.loggedMeals.meals.splice(indexToRemove, 1);
            const today = this.getTodayKey();
            const dailyLog = this.getDailyLog();

            dailyLog[today].meals = this.loggedMeals.meals;
            this.saveDailyLog(dailyLog);
            this.showLoggedMeals();
            notyf.success('Item removed from log');
        }
        catch (error) {
            notyf.error('Failed to remove produc');
        }
    }

    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }
    getDailyLog() {
        return JSON.parse(localStorage.getItem('nutriplan_daily_log')) || {};
    }

    saveDailyLog(dailyLog) {
        const today = this.getTodayKey();
        //update Total Number:
        dailyLog[today].totalCalories = 0
        dailyLog[today].totalCarbs = 0;
        dailyLog[today].totalFat = 0;
        dailyLog[today].totalProtein = 0;



        for (let i = 0; i < dailyLog[today].meals.length; i++) {
            dailyLog[today].totalCalories += Number(dailyLog[today].meals[i].nutrition.calories) * Number(dailyLog[today].meals[i].servings);
            dailyLog[today].totalCarbs += Number(dailyLog[today].meals[i].nutrition.carbs) * Number(dailyLog[today].meals[i].servings);
            dailyLog[today].totalFat += Number(dailyLog[today].meals[i].nutrition.fat) * Number(dailyLog[today].meals[i].servings);
            dailyLog[today].totalProtein += Number(dailyLog[today].meals[i].nutrition.protein) * Number(dailyLog[today].meals[i].servings);
        }
        localStorage.setItem('nutriplan_daily_log', JSON.stringify(dailyLog));
    }
    showWeeklyProgress() {
        const chartContainer = document.getElementById('weekly-chart');
        const loggedDays = JSON.parse(localStorage.getItem('nutriplan_daily_log')) || {};
        // if (!loggedDays) {
        //     //emptyCase
        //     document.getElementById('weekly-chart').innerHTML = ` <div class="text-center text-slate-500">
        //       <i class="fa-solid fa-chart-line text-4xl mb-2"></i>
        //       <p>Weekly nutrition chart will appear here</p>
        //     </div>`
        //     //return;
        // }
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const chartDays = [];

        // last 7 days
        for (let i = 6; i >= 0; i--) {
            //lw el nahrda 18-01-2025 >> awl iteration htgeb yom 12-01-2026
            const day = new Date();
            day.setDate(today.getDate() - i);
            const dayString = day.toISOString().split('T')[0]; // YYYY-MM-DD
            chartDays.push({
                date: day,
                dayName: daysOfWeek[day.getDay()],
                key: dayString, //18-01-2025
                data: loggedDays[dayString] || null
            });
        }
        console.log(chartDays);

        //Build weekly desing

        let gridBox = `<div class="grid grid-cols-7 gap-2">`; //opening tag for grid

        for (let i = 0; i < chartDays.length; i++) {
            let isToday = false;
            let hasData = false;
            if (chartDays[i].key === today.toISOString().split('T')[0]) {
                isToday = true;
            }
            if (chartDays[i].data !== null) {
                hasData = true;
            }
            gridBox += `<div class="text-center p-2 transition-all ${isToday ? 'bg-violet-600/20 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] rounded-xl' : 'hover:bg-slate-800/40 rounded-xl'}">
             <p class="text-xs ${isToday ? 'text-violet-300' : 'text-slate-400'} mb-1 font-medium">${chartDays[i].dayName}</p>
             <p class="text-sm font-bold ${isToday ? 'text-white' : 'text-slate-300'}">${chartDays[i].date.getDate()}</p>
             <div class="mt-2 ${hasData ? 'text-violet-400' : 'text-slate-600'}">
                 <p class="text-lg font-bold">${hasData ? chartDays[i].data.totalCalories : 0}</p>
                 <p class="text-[10px] uppercase tracking-wider">kcal</p>
             </div>
            ${hasData ? `<p class="text-[10px] text-slate-500 mt-1 font-medium bg-slate-800/50 py-0.5 rounded-full">${chartDays[i].data.meals.length} items</p>` : ''}
         </div>`;

        }
        gridBox += `</div>`;//closing tag for grid 

        chartContainer.innerHTML = gridBox;
        this.showQuickStates(chartDays)
    }
    showQuickStates(chartDays) {
        const quickStatsContainer = document.getElementById('weekly-log-quick-states');
        let totalCalories = 0;
        let totalItems = 0;
        let daysOnGoal = 0;
        const calorieGoal = 2000;//human needed calories per day
        chartDays.forEach(day => {
            if (day.data) {
                totalCalories += day.data.totalCalories;
                totalItems += day.data.meals.length;
                if (day.data.totalCalories >= 1800 && day.data.totalCalories <= calorieGoal + 200) daysOnGoal++;
            }
        })
        quickStatsContainer.innerHTML = `     <div class="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl p-4 border-2 border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-violet-900/50 rounded-xl flex items-center justify-center">
                <i class="text-violet-400 text-xl fa fa-chart-line"></i>
              </div>
              <div>
                <p class="text-sm text-slate-400">Weekly Average</p>
                <p class="text-xl font-bold text-white">${Math.round(totalCalories / 7)} kcal</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl p-4 border-2 border-slate-800 transition-all hover:border-blue-500/30 hover:bg-slate-800/40 group">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-900/30 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <i class="text-blue-400 text-xl fa-solid fa-utensils"></i>
              </div>
              <div>
                <p class="text-sm text-slate-400 font-medium">Total Items This Week</p>
                <p class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">${totalItems} items</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl p-4 border-2 border-slate-800 transition-all hover:border-fuchsia-500/30 hover:bg-slate-800/40 group">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-fuchsia-900/30 border border-fuchsia-500/20 group-hover:bg-fuchsia-600/20 transition-all rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.1)]">
                <i class="text-fuchsia-400 text-xl fa-solid fa-bullseye"></i>
              </div>
              <div>
                <p class="text-sm text-slate-400">Days On Goal</p>
                <p class="text-xl font-bold text-white">${daysOnGoal} / 7</p>
              </div>
            </div>
          </div>`;
    }
}
