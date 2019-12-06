var searchTag = $("#search");
//variable storing the URL to fetch all recipe categories
var allCategoriesUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
//variable storing the URL to to fetch all recipes in a selected category
var recipesInCategory = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
//variable storing the list of all meal names
var content = [];

//ajax call to fetch all categories
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
            //Recognizing when enter key is pressed on the search text box
            $("#searchTxt").keydown(function (e){
                if(e.keyCode === 13){
                    console.log("clicked");  
                }
            });
        });
    }

});



