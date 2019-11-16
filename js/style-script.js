//THIS SCRIPT IS COSEMETIC ONLY IT SERVES NO PURPOSE OTHER THAN CONTROLLING THE BEHAVIOUR
//OF THE NAVIGATION MENU


Vue.directive('focus', {
        // When the bound element is inserted into the DOM...
        inserted: function (el) {
                // Focus the element
                el.focus()
        }
})

//This is a directive to check if user click outside of the navigation menu
Vue.directive('click-outside', {
        bind: function (el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                        //if the click is outside the nav bar and its children then proceed
                        //otherwise nothing happens
                        if (!(el == event.target || el.contains(event.target))) {
                                //If the click is not on the hamburger menu or its child (the icon) then proceed
                                //or nothing happens
                                if (!(event.target == menuButtonClicker.$refs.menuButton || menuButtonClicker.$refs.menuButton.contains(event.target))) {
                                        vnode.context[binding.expression](event.target);
                                };
                        }
                }
                document.body.addEventListener('click', el.clickOutsideEvent)
        },
        unbind: function (el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
        },
});

//Hamburger-Menu
//If button is clicked and Nav bar is not open then the nav bar opens
//If the nav bar is already open then button click will close it
var menuButtonClicker = new Vue({
        el: 'header',
        data: {
                buttonLinkRegister: "../page/register.html",
                buttonLinkLogin: "../page/login.html"
            },
        methods: {
                menuClicked: function () {
                        if (menuBar.show) {
                                menuBar.show = false;
                        } else {
                                menuBar.show = true;
                        }
                },
                clickedOutside: function (event) {
                        this.show = false;
                }

        }
});


//Navigation Bar
//At the start it will always be false so the nav var will not be open
var menuBar = new Vue({
        el: '.scripted-menu',
        data: {
                show: false
        },
        methods: {
                clickedOutside: function (event) {
                        this.show = false;
                }
        }

});






