//variable storing the URL to to fetch all recipes in a selected category
var recipesInAreaCategoryUrl = "https://www.themealdb.com/api/json/v1/1/list.php?a=";

//ajax call to fetch all categories by area

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

    
    $(document).on("click", ".item", function(){
        var areaTag=console.log($(this).text());
        $.ajax({
            url: recipesInAreaCategoryUrl+areaTag,  //passing the area name in the URL
            method: "GET"
        }).then(function(response) {
            

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
            //Recognizing when enter key is pressed on the search text box
            $("#searchTxt").keydown(function (e){
                if(e.keyCode === 13){
                    console.log("clicked");  
                }
            });
        });
    }
});
