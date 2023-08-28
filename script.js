if(localStorage.getItem("favMealsList") == undefined) {
    localStorage.setItem("favMealsList", JSON.stringify([]));
}

async function fetchMealsFromApi(url, searchInput) {
    let res =  await fetch(`${url + searchInput}`);
    let meals = await res.json();
    return meals;
}
  
function showMealsOnSearch() {
    let searchInput = document.getElementById('search-input-value').value;
    let favs = JSON.parse(localStorage.getItem("favMealsList"));
    let fetchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(fetchUrl, searchInput);
    meals.then(data => {
        if(data.meals) {
            data.meals.forEach(meal => {
                let isFavMeal = false, classFav = "";
                for(var i = 0; i < favs.length; i++) {
                    if(meal.idMeal == favs[i])  isFavMeal = true;
                }
                if(isFavMeal)   classFav = "active";
                html += 
                    `<div id="card" class="card mb-3" style="width: 20rem;">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <button type="button" class="btn btn-outline-dark" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-dark ${classFav}" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                    `;
            });
        } else {
            html += `
                    <div> The meal you are looking for was not found. </div>
                `;
        }
        document.getElementById("meal-cards").innerHTML = html;
    });
}

function showMealDetails(id) {
    let fetchUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    let meal = fetchMealsFromApi(fetchUrl, id);
    meal.then(data => {
        console.log(data);
        html += `
                <div id = "meal-header">
                <div class="d-flex justify-content-around flex-wrap">
                    <div id="img-meal">
                        <img class="mb-2" src="${data.meals[0].strMealThumb}">
                    </div>
                    <div id="details">
                        <h4> ${data.meals[0].strMeal} </h4>
                        <h6> Category: ${data.meals[0].strCategory} </h6>
                        <h6> Area: ${data.meals[0].strArea} </h6>
                    </div>
                </div>
                </div>
                <div class="mt-3">
                    <h4 class="text-center"> Instruction: </h4>
                    <p> ${data.meals[0].strInstructions} </p>
                </div>
        `;
        document.getElementById('meal-cards').innerHTML = html;
    });
    
}