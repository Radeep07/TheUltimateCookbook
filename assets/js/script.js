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
//When user selects recipe name from the search recommendation, add
$(document).on("click", ".title", getRecipeByName);

function getRecipeByName() {
    $.ajax({
        url: recipeByNameUrl + searchTag.val(),  //passing the meal name in the URL
        method: "GET"
    }).then(function(response) {
        sessionStorage.setItem("recipe", JSON.stringify(response));
        document.location.replace("recipe.html");
    });
}

function fillRecipeDetails() {
    var recipe = JSON.parse(sessionStorage.getItem("recipe"));
    console.log(recipe);
    $("#name").text(recipe.meals[0].strMeal);
    $("#recipeImg").attr("src", recipe.meals[0].strMealThumb);
    $("#instructions").text(recipe.meals[0].strInstructions);
}




