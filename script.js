//variable storing the URL to to fetch all recipes in a selected category
var recipesInAreaCategoryUrl = "https://www.themealdb.com/api/json/v1/1/list.php?a=";
var recipesAreaWiseUrl="https://www.themealdb.com/api/json/v1/1/filter.php?a="

//index to keep track of starting index when next/previous button is clicked
var startingIndex = 0;

//dynamically add menu categories
$(document).ready(function () {
    var categoryAreaName=[];
    $.ajax({
        url: recipesInAreaCategoryUrl,
        method: "GET"
    }).then(function(response){
        //store the each category area name into an array        
        for(var i=0; i<response.meals.length; i++) {
            //parsing each category area name from the response object and storing in an array
            categoryAreaName.push(response.meals[i].strArea);         
        }
        //function call for filling the dropdown box items
        fillDropdown(categoryAreaName);
    });//end of funtion
});//end of document load

//function for filling the dropdown box items
function fillDropdown(categoryAreaName) {
    var menuVar = $("#menuID");  
    
    for(var m=0;m<categoryAreaName.length;m++){
        var list = $("<div>");
        list.attr("class","item");
        list.text(categoryAreaName[m]);
        menuVar.append(list);
    } 
    $('.ui.dropdown').dropdown();    
    //checkForItemSelected(categoryAreaName);              
}
//end of menu dropdown

$(document).on("click", ".item", function(event){
    event.preventDefault();
    //On selecting new area, reseting the startingIndex back to 0
    startingIndex = 0;
    var areaTag=$(this).text();
    $.ajax({
        url: recipesAreaWiseUrl+areaTag,  //passing the area name in the URL
        method: "GET"
    }).then(function(response) {
        console.log(response);
        sessionStorage.setItem("filteredRecipes", JSON.stringify(response));
        loadFilteredRecipes(response);
    });
});   

var searchTag = $("#search");
//variable storing the URL to fetch all recipe categories
var allCategoriesUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
//variable storing the URL to to fetch all recipes in a selected category
var recipesInCategory = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
//variable storing the list of all meal names
var content = [];
//ajax call to fetch all categories by area
$.ajax({
    url: allCategoriesUrl,
    method: "GET"
}).then(function(response){
    for(var i=0; i<response.categories.length; i++) {
        //parsing each category name from the response object and initiating ajax call to fetch all recipes in that category
        var categoryName = response.categories[i].strCategory;
        $.ajax({
            url: recipesInCategory + categoryName,  //passing the category name in the URL
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

$(".img").on("click", function(event){

    event.preventDefault();
    var categoryName = $(this).attr("data-name");
    //When category name is not empty then the page has loaded the categories; fire ajax call to get the recipes in the selected category
    if(categoryName !== "") {
        $.ajax({
            url: recipesInCategory + categoryName,
            method: "GET"
        }).then(function(response){
            console.log(response);
            sessionStorage.setItem("filteredRecipes", JSON.stringify(response));
            loadFilteredRecipes(response);
        });
    }
    //If the categoryName is empty that means the page contains the recipes and on click of the image should load the recipe
    else {
        var recipeId = $(this).attr("data-recipeId");
        sessionStorage.setItem("recipeId", recipeId);
        sessionStorage.setItem("recipe", null);
        document.location = "recipe.html";
    }
});

function clearAllRecipeDivs() {
    $(".img").map(function() {
        $(this).attr("src", "");
        $(this).attr("alt", "")
    });
    
    $(".category").map(function() {
        $(this).text("");
    });
}

function fillCategories(){
    $.ajax({
        url: allCategoriesUrl,
        method: "GET"
    }).then(function(response){
        clearAllRecipeDivs();
        for( var i=0; i< response.categories.length; i++){
            $(".img").map(function() {
                if($(this).attr("data-id") == i) {
                    $(this).attr("src", response.categories[i].strCategoryThumb);
                    $(this).attr("data-recipeId", "");
                    $(this).attr("data-name", response.categories[i].strCategory);
                    sessionStorage.setItem("filteredRecipes", null);
                }
            });
            $(".category").map(function() {
                if($(this).attr("data-id") == i) {
                    $(this).text(response.categories[i].strCategory);            
                }
            });
        }
    });
}

$(".headLine").on("click", function(event){
    event.preventDefault();
    fillCategories();
});

//Function to load the previous 16 recipes on index.html
$("#back").on("click", function(event) {
    event.preventDefault();
    var response = JSON.parse(sessionStorage.getItem("filteredRecipes"));
    if(response != null && response.meals != null) {
        if((startingIndex - 15) > 0) {
            startingIndex = startingIndex - 16;
            loadFilteredRecipes(response);
        }
    }
});

//Function to load the next 16 recipes on index.html
$("#next").on("click", function(event) {
    event.preventDefault();
    var response = JSON.parse(sessionStorage.getItem("filteredRecipes"));
    if(response != null && response.meals != null) {
        if(response.meals.length > (startingIndex + 16)) {
            startingIndex = startingIndex + 16;
            loadFilteredRecipes(response);
        }
    }
});

//Function to load the list of recipes selected based on filter(area/category) on the index.html
function loadFilteredRecipes(response) {
    clearAllRecipeDivs();
    for(var i=startingIndex; i< response.meals.length; i++){
        $(".img").map(function() {
            if((startingIndex + parseInt($(this).attr("data-id"))) === i) {
                $(this).attr("src", response.meals[i].strMealThumb);
                $(this).attr("data-recipeId", response.meals[i].idMeal);
                $(this).attr("data-name", "");
            }
        });

        $(".category").map(function() {
            if((startingIndex + parseInt($(this).attr("data-id"))) === i) {
                $(this).text(response.meals[i].strMeal);          
            }
        });
    }
}