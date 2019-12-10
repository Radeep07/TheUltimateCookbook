var searchTag = $("#searchTxt"); 
//variable storing the URL to fetch all recipe categories
var allCategoriesUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
//variable storing the URL to to fetch all recipes in a selected category
var recipesInCategoryUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
//variable storing the URL to fetch a recipe by providing its name
var recipeByNameUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
//variable storing the list of all meal names
var content = [];

//ajax call to fetch all categories
$.ajax({
    url: allCategoriesUrl,
    method: "GET"
}).then(function(response){
    var allCategories = getAllCategories(response);
    for(var i=0; i<allCategories.length; i++) {
        //parsing each category name from the response object and initiating ajax call to fetch all recipes in that category
        var categoryName = allCategories[i].name;
        $.ajax({
            url: recipesInCategoryUrl + categoryName,  //passing the category name in the URL
            method: "GET"
        }).then(function(response) {
            var recipes = getAllRecipesInCategory(response);
            for(var j=0; j<recipes.length; j++) {
                //parsing each meal name from the response object and adding the meal name to the content list
                var meal = {
                    title : recipes[j].name
                };
                content.push(meal);
            }
            //Once all meal names have been searched, adding the jquery search function to search for the entered name in the content list
            $('.ui.search')
            .search({
                source: content
            });
        });
    }
});
//Function to return list of category objects containing the category name and thumbnail.
function getAllCategories(response) {
    var categoryList = [];
    for(var i=0; i<response.categories.length; i++) {
        var category = { 
            name: response.categories[i].strCategory,
            thumbnail: response.categories[i].strCategoryThumb
         };
         categoryList.push(category);
    }
    return categoryList;
}
//Function to return list of recipe objects containing the recipe name and thumbnail.
function getAllRecipesInCategory(response) {
    var recipeList = [];
    for(var i=0; i<response.meals.length; i++) {
        var recipe = { 
            name: response.meals[i].strMeal,
            thumbnail: response.meals[i].strMealThumb
         };
         recipeList.push(recipe);
    }
    return recipeList;
}
//When user selects recipe name from the search recommendation, call getRecipeByName() function
$(document).on("click", ".title", getRecipeByName);

function getRecipeByName() {
    //Adding string %20 whereever there are spaces in the meal name
    var recipeName = "";
    var splitNameList = searchTag.val().split(" ");
    sessionStorage.setItem("searchedRecipeName", searchTag.val());
    recipeName = splitNameList[0];
    for(var i=1; i<splitNameList.length; i++) {
        recipeName += "%20";
        recipeName += splitNameList[i];
    }
    console.log(recipeByNameUrl + recipeName);
    $.ajax({
        url: recipeByNameUrl + recipeName,  //passing the meal name in the URL
        method: "GET"
    }).then(function(response) {
        console.log(response);
        sessionStorage.setItem("recipe", JSON.stringify(response));
        sessionStorage.setItem("recipeId", null);
        document.location = "recipe.html";
    });
}

function fillRecipeDetails() {
    //Reading the saved recipe from sessionStorage
    var recipe = JSON.parse(sessionStorage.getItem("recipe"));
    if(recipe === null || recipe.meals === null) {
        var recipeId = JSON.parse(sessionStorage.getItem("recipeId"));
        //display recipe not found error message to user
        if(recipeId === null || recipeId === "" || recipeId === undefined) {
            $("#name").text("Sorry! This recipe is currently unavailable!");
        }
        else {
            var recipeByIdUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
            $.ajax({
                url: recipeByIdUrl + recipeId,  //passing the category name in the URL
                method: "GET"
            }).then(function(response) {
                parseRecipeResponse(response.meals[0]);
            });
        }
    }
    else {
        //API returned the correct recipe matching the searched name
        if(recipe.meals[0].strMeal === sessionStorage.getItem("searchedRecipeName")) {
            parseRecipeResponse(recipe.meals[0]);    
        }
        else {
            var searchedRecipeName = sessionStorage.getItem("searchedRecipeName");
            //API couldn't match return the correct recipe by name and instead returned a list of matching items
            for(var i=0; i<recipe.meals.length; i++) {
                if(recipe.meals[i].strMeal === searchedRecipeName) {
                    parseRecipeResponse(recipe.meals[i]);
                    break;
                }
            }
        }
    }
}

function parseRecipeResponse(recipe) {
    console.log(recipe);
    $("#recipeDetails").attr("style", "display:block;")
    //Adding the recipe name
    $("#name").text(recipe.strMeal);
    //Adding image for recipe
    $("#recipeImg").attr("src", recipe.strMealThumb);

    //Adding the recipe ingredients in ingredients div in an unordered list
    var ingredientStr = "strIngredient";
    var measureStr = "strMeasure";
    var ingredientCount = 1;
    var ingredientKey = ingredientStr + ingredientCount;
    var measureKey = measureStr + ingredientCount; 

    //Increment the ingredientCount and access the ingredients until the ingridient name is empty
    while(recipe[ingredientKey] !== "" && recipe[ingredientKey] !== null && recipe[ingredientKey] !== undefined) {
        var newUlTag = $("<ul>");
        var newLiTag = $("<li>").text(recipe[ingredientKey] + " : " + recipe[measureKey]);
        newUlTag.append(newLiTag);
        if(ingredientCount < 11) {
            $("#ingredientsDiv1").append(newUlTag);
        }
        else {
            $("#ingredientsDiv2").append(newUlTag);
        }
        ingredientCount++;
        ingredientKey = ingredientStr + ingredientCount;
        measureKey = measureStr + ingredientCount;
    }

    //Adding the recipe instructions in unordered list in instructions div
    var instructions = recipe.strInstructions;
    var instArr = instructions.split(".");
    for(var i=0; i<instArr.length-1; i++) {
        if(instArr[i].split(" ").length == 1) {
            continue;
        }
        var newUlTag = $("<ul>");
        var newLiTag = $("<li>").text(instArr[i] + ".");
        newUlTag.append(newLiTag);
        $("#instructions").append(newUlTag);
    }

    //Parsing youtube ID from the parameter in youtube link
    var youtubeLink = recipe.strYoutube.split("?v=");
    $("#youtube").attr("data-youtubeId", youtubeLink[1]);
    embedYoutubeVideo();

}
function embedYoutubeVideo() {
    var youtube = $("#youtube");
    // Create an iFrame with autoplay set to true
    var iframe = $("<iframe>");
    iframe.attr("src", "https://www.youtube.com/embed/" + youtube.attr("data-youtubeId") + "?autoplay=1"); 
    iframe.attr("allowfullscreen", "true");
    youtube.append(iframe);
}

