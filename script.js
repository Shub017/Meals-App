// A simple check to make sure script is working as intended
console.log("Script Loaded");

(() => {
    // Initializing all variables
    console.log("variables initialized");
    const resultContainer = document.getElementById("resultContainer");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const FavouriteButton = document.getElementById("FavouriteButton");
    const favoritesContainer = document.getElementById("favoritesContainer"); // Added favoritesContainer

    // Retrieve favorites from local storage on page load
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];

    // Function to save favorites to local storage
    const saveFavoritesToStorage = () => {
        localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
    };

    // Function to display favorites
    const displayFavorites = () => {
        resultContainer.innerHTML = '';
        favoritesContainer.innerHTML = '';
        
        favoriteMeals.forEach(favoriteMeal => {
            const favoriteItem = document.createElement('div');
            favoriteItem.innerHTML = `
                <h3 style="font-size:40px; padding-left:20%;">${favoriteMeal.strMeal}</h3>
                <img style = "padding-left:20%;" src="${favoriteMeal.strMealThumb}" alt="">
                <p style="font-size:20px;">${favoriteMeal.strInstructions}</p>
                <h5 style="font-size:30px;">Cuisine Type: ${favoriteMeal.strArea}</h5>
                <button onclick="removeFavorite('${favoriteMeal.idMeal}')">Remove from Favorites</button>
                <a href="javascript:void(0);" onclick="removeFavorite('${favoriteMeal.idMeal}')">
                    <img width="32" height="32" src="https://img.icons8.com/wired/64/hearts.png" alt="hearts">
                </a>
            `;
            favoritesContainer.appendChild(favoriteItem);
        });
    };


    // Function to remove a meal from favorites
    window.removeFavorite = (mealId) => {
        favoriteMeals = favoriteMeals.filter(favoriteMeal => favoriteMeal.idMeal !== mealId);
        saveFavoritesToStorage();
        displayFavorites();
    };

    // // Display favorites on page load
    // displayFavorites();

    searchButton.onclick = function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Clear the resultContainer
        resultContainer.innerHTML = '';

        console.log("Search Button clicked");
        if (searchInput.value !== "") {
            const inputValue = searchInput.value.trim();
            let p = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);

            p.then((response) => {
                console.log(response);
                console.log("response fetched");
                console.log(response.status);
                console.log(response.ok);
                return response.json();
            })
            .then(data => {
                console.log("API Response Data", data);

                // Processing the data and display on the webpage
                displayResults(data.meals);
            })
                .catch(error => {
                    alert("No Result Found!!!");
                    console.log("Error fetching data", error);
                })

        }
    }

    FavouriteButton.onclick = function () {
        // Display favoritesContainer content when FavouriteButton is clicked
        displayFavorites();
    }


    function displayResults(resultMeals) {

        resultMeals.forEach(element => {
            favoritesContainer.innerHTML = '';

            const mealInstructions = element.strInstructions;
            

            // meal container
            const mealContainer = document.createElement('div');
            mealContainer.classList.add('card');
            mealContainer.style.width = '18rem';

            // Meal Image
            const mealImg = document.createElement('img');
            mealImg.src = element.strMealThumb; // Use element here
            mealImg.alt = element.strMeal;
            mealImg.classList.add('card-img-top');
            mealContainer.appendChild(mealImg);

            // For the Name of the Meal
            const MealNameContainer = document.createElement('div')
            MealNameContainer.classList.add('card-body');

            const MealName = document.createElement('h1')
            MealName.innerText = element.strMeal;
            MealName.classList.add('card-title');
            MealNameContainer.appendChild(MealName);

            const MealNameTemp = document.createElement('h5')
            MealNameTemp.innerText = "Ingredients-:";
            MealNameTemp.classList.add('card-title');
            MealNameContainer.appendChild(MealNameTemp);

            // Showing the ingredients of meal
            const mealIngredientsContainer = document.createElement('ul');
            mealIngredientsContainer.classList.add('list-group', 'list-group-flush');
            for (let i = 1; i <= 20; i++) {
                if (element[`strIngredient${i}`]) {
                    const ingredient = document.createElement('li');
                    ingredient.innerText = `${element[`strIngredient${i}`]} - ${element[`strMeasure${i}`]}`;
                    ingredient.classList.add("list-group-item");
                    mealIngredientsContainer.appendChild(ingredient);
                }
                else {
                    break;
                }
            }

            // Making video link button
            const videoButtonContainer = document.createElement('div');
            const videoButton = document.createElement('a');
            videoButton.classList.add('card-link');
            videoButton.href = element.strYoutube;
            videoButton.innerText = '\u25B6'; // Unicode character for a play button
            videoButton.style.fontSize = '2em'; // Adjust the font size as needed
            videoButton.title = 'Play Video'; // Description for the tooltip
            videoButtonContainer.appendChild(videoButton);

            // More Details Button
            const detailsButton = document.createElement('a');
            detailsButton.classList.add('card-link');
            detailsButton.href = "javascript:void(0);"; // Setting href to "javascript:void(0);" to prevent the page from navigating
            detailsButton.innerText = "Instructions";
            detailsButton.style.fontSize = '1.5em';
            detailsButton.title = 'Expand for detailed instructions';

            // Attach the moreDetails function to the click event
            detailsButton.addEventListener('click', () => moreDetails(element));
            videoButtonContainer.appendChild(detailsButton);

            // Making a favourite Button
            const FavouriteButton = document.createElement('a');
            FavouriteButton.classList.add('card-link');
            FavouriteButton.href = "javascript:void(0);";
            FavouriteButton.innerHTML = '<img width="64" height="64" src="https://img.icons8.com/wired/64/hearts.png" alt="hearts">';
            FavouriteButton.title = 'Added it as Favourite';



            // Add click event to favorite button
            FavouriteButton.addEventListener('click', () => {
                // Check if the meal is already in favorites
                const isAlreadyFavorite = favoriteMeals.some(favoriteMeal => favoriteMeal.idMeal === element.idMeal);

                if (!isAlreadyFavorite) {
                    // If not in favorites, add to favorites
                    favoriteMeals.push(element);
                    FavouriteButton.innerHTML = '<img width="64" height="64" src="Images\\icons8-heart-64.png" alt="hearts">';
                    saveFavoritesToStorage();
                    // displayFavorites();
                }
                else{
                    FavouriteButton.innerHTML = '<img src="Images\\icons8-heart-64.png" alt="hearts">';
                }
            });

            

            mealContainer.appendChild(MealNameContainer);
            mealContainer.appendChild(mealIngredientsContainer);
            mealContainer.appendChild(videoButtonContainer);
            mealContainer.appendChild(FavouriteButton);

            resultContainer.appendChild(mealContainer);

        });
    }

    // Making moreDetails Section
    function moreDetails(element) {
        resultContainer.innerHTML = '';
        favoritesContainer.innerHTML = '';
    
        const div = document.createElement('div');
        div.classList.add('details-page');
        div.innerHTML = `
            <h3>${element.strMeal}</h3>
            <img src="${element.strMealThumb}" alt="">
            <p>${element.strInstructions}</p>
            <h5>Cuisine Type: ${element.strArea}</h5>
            <a href="${element.strYoutube}" target="_blank" style="text-decoration: none;">
                <button type="button" class='border-circle more-details' id='${element.idMeal}'>
                    Watch Video
                </button>
            </a>`;
    
        resultContainer.append(div);
    }

})();
