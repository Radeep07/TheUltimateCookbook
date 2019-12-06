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
            for(var j=0; j<response.meals.length; j++) {
                //parsing each meal name from the response object and adding the meal name to the content list
                var mealName = response.meals[j].strMeal;
                var meal = {
                    title : mealName
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
//When user selects recipe name from the search recommendation, add
$(document).on("click", ".title", getRecipeByName);

function getRecipeByName() {
    $.ajax({
        url: recipeByNameUrl + searchTag.val(),  //passing the meal name in the URL
        method: "GET"
    }).then(function(response) {
        console.log(response);
    });
}






