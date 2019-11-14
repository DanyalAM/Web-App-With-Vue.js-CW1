//Must let all HTML components load before accessing them
//or [item] undefined might occur

window.onload = function () {
    //Defining a list of personalised components

    //This is the hamburger menu which people would be able to select 
    //to navigate through the pages
    Vue.component('hamburger-menu', {
        template: '<i class="fa fa-bars menu-icon"></i>'
    });


    //This is the search bar
    Vue.component('search-bar', {
        template: '<div class="searchCenter">' +
            '<form class= "searchContainer">' +
            '<i class="fa fa-search searchIcon"></i>' +
            '<input class="searchBox" type="text" name="search" placeholder="Search...">' +
            '<input type="submit" value="Search" class="searchButton">' +
            '</form>' +
            '</div>'
    });


    //Header must be linked here because the components above
    //will go inside this 
    new Vue({
        el: 'header'
    });

    new Vue({
        el: '#login',
        methods: {
            sayHello: function () {
    
                console.log("hi");
            }
        }
    });   
    
}