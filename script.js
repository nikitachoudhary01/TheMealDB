let api = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

let allMeals = [];


const requestApi = (query = ' ') => {
    fetch(api + query)
        .then(response => response.json())
        .then(allData => {
            allMeals = allData.meals.map(meal => {
                // Assign a consistent random cost between $50 and $200 to each meal
                meal.cost = Math.floor(Math.random() * 151 + 50);
                return meal;
            });
            displayData(allMeals); // Display the meals
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
};


requestApi(); 

// Display meals
function displayData(data) {
    const container = document.getElementById('contain');
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No meals found.</p>";
        return;
    }

    data.forEach(item => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal-item');
        
        // Create meal title
        const mealTitle = document.createElement('h1');
        mealTitle.classList.add('meal-title');
        mealTitle.innerText = item.strMeal;
        
        // Create meal image
        const mealImage = document.createElement('img');
        mealImage.classList.add('meal-image');
        mealImage.src = item.strMealThumb;
        mealImage.alt = item.strMeal;
        
        // Add click event for image
        mealImage.addEventListener('click', () => {
            showRecipe(item); // Call the showRecipe function with the current meal data
        });

        // Create meal cost paragraph
        const mealCost = document.createElement('p');
        mealCost.classList.add('meal-cost');
        mealCost.style.color = 'white';
        mealCost.innerText = `Cost: $${item.cost}`;
        
        // Create rating section
        const ratingSection = document.createElement('div');
        ratingSection.classList.add('rating-section');
        ratingSection.style.color = 'white';
        const rateText = document.createElement('span');
        rateText.innerText = 'Rate this meal:';
        const starsDiv = document.createElement('span');
        starsDiv.classList.add('stars');
        starsDiv.id = `stars-${item.idMeal}`;
        starsDiv.innerHTML = getStars(item.idMeal, getSavedRating(item.idMeal));
        
        const ratingValue = document.createElement('span');
        ratingValue.id = `rating-value-${item.idMeal}`;
        ratingValue.innerText = getSavedRating(item.idMeal);
        
        ratingSection.appendChild(rateText);
        ratingSection.appendChild(starsDiv);
        ratingSection.appendChild(ratingValue);
        
        // Append elements to the mealDiv
        mealDiv.appendChild(mealTitle);
        mealDiv.appendChild(mealImage);
        mealDiv.appendChild(mealCost);
        mealDiv.appendChild(ratingSection);

        // Append mealDiv to the container
        container.appendChild(mealDiv);
    });
}

// Search functionality
const searchBtn = document.querySelector("#but");
const searchInput = document.querySelector("#search");
searchBtn.addEventListener("click", searchData);

function searchData() {
    const query = searchInput.value.trim();  // Get the trimmed search input
    if (query) {  // Check if the query is not empty
        requestApi(`&s=${query}`);  // Make the API request with the query
    } else {
        requestApi('');  // Make the API request without a query
    }
}


// Show recipe details
function showRecipe(meal) {
    document.getElementById('recipe-title').innerText = meal.strMeal;
    document.getElementById('recipe-image').src = meal.strMealThumb;
    document.getElementById('recipe-instructions').innerText = meal.strInstructions;
    document.getElementById('recipe-cost').innerText = `Cost: $${meal.cost}`;
    document.getElementById('contain').style.display = 'none';
    document.getElementById('recipe-details').style.display = 'block';
}

function goBack() {
    document.getElementById('recipe-details').style.display = 'none';
    document.getElementById('contain').style.display = 'flex';
   
    displayData(allMeals); 
}


// Get stars for a meal rating
function getStars(idMeal, rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star" data-value="${i}" data-id="${idMeal}" style="font-size: 20px; cursor: pointer; color: ${i <= rating ? 'gold' : 'white'};">&#9733;</span>`;
    }
    return stars;
}

// Save and update star ratings
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('star')) {
        const idMeal = e.target.getAttribute('data-id');
        const value = e.target.getAttribute('data-value');
        localStorage.setItem(`rating-${idMeal}`, value); // Save rating in localStorage
        document.getElementById(`rating-value-${idMeal}`).innerText = value;
        updateStarColors(idMeal, value);
    }
});

function updateStarColors(idMeal, rating) {
    const stars = document.querySelectorAll(`#stars-${idMeal} .star`);
    stars.forEach(star => {
        const value = star.getAttribute('data-value');
        star.style.color = value <= rating ? 'gold' : 'white';
    });
}

function getSavedRating(idMeal) {
    return localStorage.getItem(`rating-${idMeal}`) || 0; 
}


document.getElementById('low-btn').addEventListener('click', () => {
    const lowPriceMeals = allMeals.filter(meal => meal.cost <= 120); 
    displayData(lowPriceMeals);
});

document.getElementById('high-btn').addEventListener('click', () => {
    const highPriceMeals = allMeals.filter(meal => meal.cost > 120); 
    displayData(highPriceMeals);
});

function navigateToHome() {
    window.location.href = 'index.html';  // Reloads the current page (home)
}