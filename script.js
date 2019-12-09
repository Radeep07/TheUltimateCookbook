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
}
//end of menu dropdown
