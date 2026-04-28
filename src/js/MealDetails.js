import { mealSection, sectionsNavigation, foodLogSection } from './main.js';
export class MealDetails {
    constructor() {
        this.mealDetails = document.getElementById('meal-details');
        this.backToMealsBtn = document.getElementById('back-to-meals-btn');

        this.logMealBtn = document.getElementById('log-meal-btn');


        this.logMealModal = document.getElementById('log-meal-modal');
        this.canclLogMeal = document.getElementById('cancel-log-meal');
        this.confirmLogMeal = document.getElementById('confirm-log-meal');
        this.mealServings = document.getElementById('meal-servings');
        this.decreaseServings = document.getElementById('decrease-servings');
        this.increaseServings = document.getElementById('increase-servings');

        this.nutritionFactsContainer = document.getElementById('nutrition-facts-container');
        this.USDA_API_KEY = 'rMVu4aYBEzDZBvY5OHio1vk9tObxaIIxd0G4Ld0k';
        this.loggedMeal = {
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

        this.backToMealsBtn.addEventListener('click', () => {
            this.hideSection();
        })

        ////////////logMealModal//////////////////
        this.logMealBtn.addEventListener('click', () => {
            this.logMealModal.classList.remove('loading');
            this.mealServings.value = 1;
            document.getElementById('log-meal-modal-title').textContent = this.loggedMeal.name;
            document.getElementById('modal-calories').textContent = this.loggedMeal.nutrition.calories;
            document.getElementById('modal-protein').textContent = this.loggedMeal.nutrition.protein;
            document.getElementById('modal-carbs').textContent = this.loggedMeal.nutrition.carbs;
            document.getElementById('modal-fat').textContent = this.loggedMeal.nutrition.fat;
            document.getElementById('modal-image').src = this.loggedMeal.thumbnail;
            document.getElementById('modal-image').alt = this.loggedMeal.name;

        });
        this.canclLogMeal.addEventListener('click', () => {
            this.logMealModal.classList.add('loading');
        });


        this.currentMeal = null;
        this.confirmLogMeal.addEventListener('click', () => {
            var currentServing = Number(this.mealServings.value);
            const now = new Date();
            this.loggedMeal.loggedAt = `${(h => h % 12 || 12)(now.getHours())}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
            this.loggedMeal.servings = Number(this.mealServings.value);
            console.log('Before Fire:', this.loggedMeal);

            foodLogSection.logMeal(this.loggedMeal);

            Swal.fire({
                title: "Meal logged",
                icon: "success",
                html: `
            ${this.currentMeal.name} (${currentServing} serving) has been added to your daily log.
            <br>
            <br>
            <span style="color: green;" class='font-semibold mt-1'>+ ${Number(this.loggedMeal.nutrition.calories) * Number(this.mealServings.value)} calories!</span>
        `,
                showConfirmButton: false,  // Hide the default "OK" button so the alert closes automatically
                timer: 2500,               // Set the alert to disappear automatically after 2500 milliseconds (2.5 seconds)
                timerProgressBar: true     // Display a progress bar showing the countdown until the alert closes

            });

            this.logMealModal.classList.add('loading');



        });

        this.logMealModal.addEventListener('click', (e) => {
            if (e.target === this.logMealModal) { // only if clicked on the overlay
                this.logMealModal.classList.add('loading');
            }
        });
        this.increaseServings.addEventListener('click', () => {

            var currentServing = Number(this.mealServings.value);
            currentServing += 0.5;
            if (currentServing <= 10) {
                this.mealServings.value = currentServing;
            }
        })

        this.decreaseServings.addEventListener('click', () => {
            var currentServing = Number(this.mealServings.value);
            currentServing -= 0.5;
            if (currentServing >= 0.5) {
                this.mealServings.value = currentServing;
            }
        })
    };
    showSection() {
        mealSection.hideSection();
        this.mealDetails.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    hideSection() {
        mealSection.showSection();
        this.mealDetails.classList.add('hidden');
    }

    cleanMeasure(measure) {
        if (!measure) return ''; //if empty
        // Replace special fraction symbols
        measure = measure
            .replace('½', '0.5')
            .replace('¼', '0.25')
            .replace('¾', '0.75')
            // Replace textual fractions like "1/2" etc.
            .replace(/(\d+)\s*\/\s*(\d+)/g, (_, num, denom) => `${parseInt(num) / parseInt(denom)}`)
            .trim();
        return measure;
    }

    showloadingDesign(mealID) {

        //Button
        this.logMealBtn.classList.replace('bg-violet-600', 'bg-slate-800');
        this.logMealBtn.classList.replace('hover:bg-violet-500', 'hover:bg-slate-800');
        this.logMealBtn.classList.replace('text-white', 'text-slate-400');
        this.logMealBtn.classList.remove('shadow-[0_0_20px_rgba(139,92,246,0.3)]');
        this.logMealBtn.classList.replace('border-violet-500/50', 'border-slate-700');
        this.logMealBtn.classList.replace('cursor-pointer', 'cursor-not-allowed');
        this.logMealBtn.setAttribute('data-meal-id', `${mealID}`);
        this.logMealBtn.setAttribute('title', `Waiting for nutrition data`);
        this.logMealBtn.setAttribute('disabled', `true`);

        // Font Awesome automatically replaces <i> tags with SVG elements.
        // Once this happens, changing the icon by just updating class names
        // does NOT update the rendered SVG.
        // To avoid mixing icons or losing the icon, we replace the entire <i> element
        // with a new one so Font Awesome can render the correct icon properly.
        const icon = this.logMealBtn.querySelector('i');
        const newIcon = document.createElement('i');
        newIcon.className = 'fa-solid fa-spinner fa-spin';
        icon.replaceWith(newIcon);
        this.logMealBtn.querySelector('span').textContent = `Calculating...`



        //Container

        this.nutritionFactsContainer.innerHTML = `
        <div class="text-center py-8">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-900/50 mb-4">
        <i class="animate-pulse text-violet-400 text-xl fas fa-calculator"></i>
    </div>
    <p class="text-slate-200 font-medium mb-1">Calculating Nutrition</p>
    <p class="text-sm text-slate-400">Analyzing ingredients...</p>
    <div class="mt-4 flex justify-center">
        <div class="flex space-x-1">
            <div class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
    </div>
</div>
        `;
        document.getElementById('hero-calories').textContent = `Calculating...`;
    }


    hideLoadingDesign() {

        this.logMealBtn.classList.replace('bg-slate-800', 'bg-violet-600');
        this.logMealBtn.classList.replace('hover:bg-slate-800', 'hover:bg-violet-500');
        this.logMealBtn.classList.replace('text-slate-400', 'text-white');
        this.logMealBtn.classList.add('shadow-[0_0_20px_rgba(139,92,246,0.3)]');
        this.logMealBtn.classList.replace('border-slate-700', 'border-violet-500/50');
        this.logMealBtn.classList.replace('cursor-not-allowed', 'cursor-pointer');
        this.logMealBtn.setAttribute('title', ``);
        this.logMealBtn.removeAttribute('disabled');

        // Alternative simpler approach to replaceWith: elly mwgoda fy showloadingDesign(mealID)
        // Instead of creating a new <i> element, we reset the button's innerHTML
        // This removes the old Font Awesome SVG and renders the correct icon cleanly.
        this.logMealBtn.innerHTML = `<i class="fa-solid fa-clipboard-list"></i>
            <span>Log This Meal</span>`;
    }


    async getMealDetails(mealID) {
        console.log(mealID);
        this.showloadingDesign(mealID);
        try {
            // 1. Fetch the meal details from the API using the mealID
            const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${mealID}`);
            let responseJson = await response.json();
            let meal = responseJson.result;
            this.currentMeal = meal;

            // 2. Convert ingredients from objects to strings in the format required by the nutrition API
            // Example: {ingredient: 'Chicken Breasts', measure: '2'} => "2 Chicken Breasts"
            const ingredientsArray = meal.ingredients.map(item => {
                let clean = this.cleanMeasure(item.measure);
                return `${clean} ${item.ingredient}`;
            });
            console.log(meal);
            //fill meal normal data
            await this.fillMealData(meal)
            //change URL
            sectionsNavigation.navigate(`meal/${meal.name.replaceAll(' ', '-')}`);
            // 3. Send a POST request to the nutrition analyze endpoint
            // Include the meal name as the title and the formatted ingredients array
            console.log(ingredientsArray);

            const nutriplanResponse = await fetch(
                'https://nutriplan-api.vercel.app/api/nutrition/analyze',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'rMVu4aYBEzDZBvY5OHio1vk9tObxaIIxd0G4Ld0k'  //this.USDA_API_KEY
                    },
                    body: JSON.stringify({
                        title: meal.name,
                        ingredients: ingredientsArray
                    })
                }
            );
            // 4. Parse the JSON response from the nutrition API
            let nutritionJson = await nutriplanResponse.json();
            console.log('Post Result:', nutritionJson);
            await this.fillNutritionData(nutritionJson.data);
            this.hideLoadingDesign();
        }
        catch (error) {
            document.getElementById('hero-calories').textContent = 'Error :(';
            const icon = this.logMealBtn.querySelector('i');
            const newIcon = document.createElement('i');
            newIcon.className = 'fa-solid fa-triangle-exclamation';
            icon.replaceWith(newIcon);
            this.logMealBtn.querySelector('span').textContent = `Error :(`
            this.nutritionFactsContainer.innerHTML = `    <p class="text-sm text-slate-400 mb-4">Per serving</p>

                <div class="text-center py-4 mb-4 bg-linear-to-br from-red-50 to-rose-50 rounded-xl">
                  <p class="text-4xl font-bold text-red-600">failed</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-violet-500"></div>
                      <span class="text-slate-200">Protein</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-violet-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-slate-200">Carbs</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span class="text-slate-200">Fat</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-slate-200">Fiber</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span class="text-slate-200">Sugar</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-violet-500"></div>
                      <span class="text-slate-200">Protein</span>
                    </div>
                    <span class="font-bold text-white">unknown</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-violet-500 h-2 rounded-full" style="width: 0%"></div>
                  </div>

                </div>`;
            console.log(error);
        }

    }

    async fillMealData(meal) {
        document.getElementById('hero-title').textContent = meal.name;
        document.getElementById('hero-category').textContent = meal.category;
        document.getElementById('hero-area').textContent = meal.area;
        const image = document.getElementById('hero-image');
        image.src = meal.thumbnail;
        image.alt = meal.name;
        //=>>>>>>>>>
        document.getElementById('hero-time').textContent = `30 minutes`
        // //===ingredients===/
        const mealIngredientsGrid = document.getElementById('meal-ingredients-grid');
        const mealIngredients = meal.ingredients;
        document.getElementById('ingredients-length').textContent = `${mealIngredients.length} items`
        let box = ``;
        for (let i = 0; i < mealIngredients.length; i++) {
            box += `<div class="flex items-center gap-4 p-3.5 bg-slate-800/30 border border-slate-700/50 backdrop-blur-md rounded-2xl hover:bg-violet-900/20 hover:border-violet-500/40 transition-all shadow-sm group">
                  <div class="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center group-hover:bg-violet-600/20 group-hover:border-violet-500/30 transition-all shrink-0">
                    <i class="fa-solid fa-seedling text-slate-500 group-hover:text-violet-400 text-sm transition-colors"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-white text-sm leading-tight">${mealIngredients[i].measure}</span> 
                    <span class="text-slate-400 text-xs font-medium">${mealIngredients[i].ingredient}</span>
                  </div>
                </div>`
        }

        mealIngredientsGrid.innerHTML = box;

        //===Instructions===/
        const mealInstructionsList = document.getElementById(`meal-instructions-list`);
        box = ``;
        const mealInstructions = meal.instructions;
        for (let i = 0; i < mealInstructions.length; i++) {
            box += ` <div class="flex gap-5 p-5 mb-3 rounded-2xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/50 hover:border-violet-500/40 transition-all group relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 group-hover:border-violet-500 group-hover:text-white group-hover:bg-violet-600 transition-all duration-300 shadow-lg">
                    ${i + 1}
                  </div>
                  <p class="text-slate-300 leading-relaxed pt-1 text-sm md:text-base font-medium group-hover:text-slate-100 transition-colors duration-300">
                    ${mealInstructions[i]}
                  </p>
                </div>`
        }
        mealInstructionsList.innerHTML = box;
        //===Meal Video===
        //// Convert a standard YouTube URL to an embed URL so it can be displayed in an iframe
        const embedURL = meal.youtube.replace("watch?v=", "embed/");
        document.getElementById('meal-video').querySelector('iframe').src = embedURL;

        //fill selected meal
        this.loggedMeal.name = meal.name
        this.loggedMeal.id_barcode = meal.id;
        this.loggedMeal.category = meal.category;
        this.loggedMeal.thumbnail = meal.thumbnail;
        this.loggedMeal.type = 'Recipe';


    }
    async fillNutritionData(nutrition) {
        let food = nutrition.perServing;
        let foodWeight = nutrition.totalWeight / nutrition.servings;
        console.log('foodWeight : ', foodWeight);
        // console.log('nutrition servings: ',nutrition.servings);

        document.getElementById('hero-servings').textContent = `${nutrition.servings} servings`
        const nutitionInfo = {
            'Protein': 0,
            'Carbs': 0,
            'Fats': 0,
            'Sugar': 0,
            'Fiber': 0,
            'Saturated_Fat': 0,
            'Sodium': 0,
            'Calories': 0
        }
        nutitionInfo['Protein'] = food.protein;
        nutitionInfo['Calories'] = food.calories;
        nutitionInfo['Carbs'] = food.carbs;
        nutitionInfo['Fats'] = food.fat;
        nutitionInfo['Fiber'] = food.fiber;
        nutitionInfo['Sodium'] = food.sodium;
        nutitionInfo['Saturated_Fat'] = food.saturatedFat;
        nutitionInfo['Sugar'] = food.sugar;
        // for (let i = 0; i < food.length; i++) {
        //     try {
        //         let foodTosearch = food[i].match.replace('/', '');
        //         // console.log(foodTosearch);

        //         let response = await fetch(`https://nutriplan-api.vercel.app/api/nutrition/search?q=${food[i].foodTosearch}=1&limit=24`,
        //             {
        //                 headers: {
        //                     'x-api-key': 'rMVu4aYBEzDZBvY5OHio1vk9tObxaIIxd0G4Ld0k'
        //                 }
        //             });


        //         const responseJson = await response.json();
        //         let ingredient = responseJson.results[0];
        //         nutitionInfo['Protein'] += ingredient.nutrients.protein;
        //         nutitionInfo['Calories'] += ingredient.nutrients.calories;
        //         nutitionInfo['Carbs'] += ingredient.nutrients.carbs;
        //         nutitionInfo['Fats'] += ingredient.nutrients.fat;
        //         nutitionInfo['Fiber'] += ingredient.nutrients.fiber;
        //         nutitionInfo['Sodium'] += ingredient.nutrients.sodium;
        //         nutitionInfo['Sugar'] += ingredient.nutrients.sugar;
        //     }

        //     catch (error) {
        //         console.log(error);
        //     }

        // }
        console.log(nutitionInfo);
        //====nutrition-facts-container====
        console.log(`nutritionFactsContainer`);
        //convert to int
        for (let key in nutitionInfo) {
            nutitionInfo[key] = Math.round(nutitionInfo[key]);
        }
        //ERRRRROOOORRR//=>>>>>>>>>
        // document.getElementById('hero-servings').textContent = `${nutrition.servingSize} servings`;
        document.getElementById('hero-calories').textContent = `${nutitionInfo.Calories} cal/serving`;
        this.nutritionFactsContainer.innerHTML = `
           <p class="text-sm text-slate-400 mb-4">Per serving</p>

                <div class="text-center py-4 mb-4 bg-linear-to-br from-violet-900/40 to-fuchsia-900/40 rounded-xl">
                  <p class="text-sm text-slate-300">Calories per serving</p>
                  <p class="text-4xl font-bold text-violet-400">${nutitionInfo.Calories}</p>
                  <p class="text-xs text-slate-400 mt-1">Total: ${nutitionInfo.Calories * nutrition.servings} cal</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-violet-500"></div>
                      <span class="text-slate-200">Protein</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Protein}g</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-violet-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Protein) / foodWeight) * 100), 100)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-slate-200">Carbs</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Carbs}g</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Carbs) / foodWeight) * 100), 100)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span class="text-slate-200">Fat</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Fats}g</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Fats) / foodWeight) * 100), 100)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-slate-200">Fiber</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Fiber}g</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Fiber) / foodWeight) * 100), 100)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span class="text-slate-200">Sugar</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Sugar}g</span>
                  </div>
                  <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Sugar) / foodWeight) * 100), 100)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-slate-200">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-white">${nutitionInfo.Saturated_Fat}g</span>
                </div>
                <div class="w-full bg-slate-800/40 backdrop-blur-md rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(Math.round((Number(nutitionInfo.Saturated_Fat) / foodWeight) * 100), 100)}%"></div>
                </div>
                </div>

        `;

        //fill selected meal
        this.loggedMeal.nutrition.calories = nutitionInfo.Calories;
        this.loggedMeal.nutrition.carbs = nutitionInfo.Carbs;
        this.loggedMeal.nutrition.fat = nutitionInfo.Fats;
        this.loggedMeal.nutrition.protein = nutitionInfo.Protein;
    }
}