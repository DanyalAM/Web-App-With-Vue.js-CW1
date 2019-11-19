// check if the userInfo localstorage key exists
if (localStorage.getItem('userInfo') === null) {
    var userInfo = [];
    //if not add it in
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

//If the services provided (from users) doesn't exist
if (localStorage.getItem('servicesProvided') === null) {
    var services = [];
    //then add it then
    localStorage.setItem('servicesProvided', JSON.stringify(services));
}

//Check if just registered storage exists
if (localStorage.getItem('justRegistered') !== null) {

    //if it exists then save the registration time
    var registerTime = localStorage.getItem('justRegistered');
    var oneMinute = 1000 * 60; //one minute

    //if the register time was more than a minute ago
    //delete the registeration storage item
    if (minuteChecker(registerTime, oneMinute)) {
        localStorage.removeItem('justRegistered');
    }
}


//if a minute has passed from the old time then return true
function minuteChecker(oldTime, timeDifference) {
    var minutePassed = true;
    if (new Date().getTime() - oldTime < timeDifference) {
        minutePassed = false;
    }
    return minutePassed;
}



var userAccounts = JSON.parse(localStorage.getItem('userInfo'));

//Registration validation
var registerForm = new Vue({
    el: '#register-form',
    data: {
        allCorrect: [],
        nameError: false,
        nameErrorText: "",
        passwordError: false,
        passwordErrorText: "",
        passwordAgainError: false,
        passwordAgainErrorText: "",
        emailError: false,
        emailErrorText: "",
        userTypeError: false,
        userTypeErrorText: "",
        passwordAgain: null,

        registerInfo: {
            name: null,
            password: null,
            email: null,
            userType: null
        }
    },
    methods: {
        checkForm: function (e) {
            this.allCorrect = [];
            //If the user hasn't entered a name
            //Prompt them to do so
            if (!this.registerInfo.name) {
                this.nameErrorText = "Please enter your name";
                this.nameError = true;
            } else {
                this.nameError = false;
                this.nameErrorText = "";
                this.allCorrect.push(true);
            }

            //If the user hasn't entered a password
            //Give error message
            if (!this.registerInfo.password) {
                this.passwordErrorText = "Please enter a password";
                this.passwordError = true;
            } else if (!this.validPassword(this.registerInfo.password)) {
                //If password doesn't match the regex definition
                this.passwordErrorText = "Please choose a stronger password";
                this.passwordError = true;
                errorMessageBox.passwordWrong = true;
            } else {
                //If password is acceptable
                this.passwordErrorText = "";
                this.passwordError = false;
                errorMessageBox.passwordWrong = false;
                this.allCorrect.push(true);
            }

            //If the user hasn't entered a password again
            //Give error message
            if (!this.passwordAgain) {
                this.passwordAgainErrorText = "Please enter your password again";
                this.passwordAgainError = true;
            } else if (this.passwordAgain != this.registerInfo.password) {
                //if re-enter password doesn't match password
                this.passwordAgainErrorText = "Your passwords do not match!"
                this.passwordAgainError = true;
            } else {
                //if re-enter password is correctly written
                this.passwordAgainErrorText = "";
                this.passwordAgainError = false;
                this.allCorrect.push(true);
            }

            //If the user hasn't entered an email
            //Give error message
            if (!this.registerInfo.email) {
                this.emailErrorText = "Please enter an email";
                this.emailError = true;
            } else if (!this.validEmail(this.registerInfo.email)) {
                //if email doesn't match the regex definition
                this.emailErrorText = "Please enter a valid email";
                this.emailError = true;
            } else if (this.emailExists(this.registerInfo.email)) {
                //if email already exists
                this.emailErrorText = "This email is already in use";
                this.emailError = true;
            } else {
                //if email is correctly written
                this.emailErrorText = "";
                this.emailError = false;
                this.allCorrect.push(true);
            }

            //If the user hasn't selected an option
            //Give error message
            if (!this.registerInfo.userType) {
                this.userTypeErrorText = "Please select an option";
                this.userTypeError = true;
            } else {
                this.userTypeErrorText = "";
                this.userTypeError = false;
                this.allCorrect.push(true);
            }

            //If all information is correctly entered
            //Push the user information to localstorage
            if (this.allCorrect.length == 5) {
                userAccounts.push(this.registerInfo);
                localStorage.setItem('userInfo', JSON.stringify(userAccounts));

                var justRegistered = (new Date()).getTime();
                localStorage.setItem('justRegistered', justRegistered);

                e.submit();
            }

            e.preventDefault();
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validPassword: function (password) {
            var tester = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            return tester.test(password);
        },
        emailExists: function (email) {
            //if the email already is in use return true
            var found = false;
            userAccounts.find(function (element) {
                if (element.email == email) {
                    found = true;
                }
                return found;
            });
            return found;
        }
    },
})

//Custom error box that appears
//When password is incorrect
var errorMessageBox = new Vue({
    el: '.password-error-holder',
    data: {
        passwordWrong: false,
        requirements: ["one digit", "one lowercase", "one uppercase", "be 8 characters long"]
    }
})


//Login Validation
var loginForm = new Vue({
    el: '#login-form',
    data: {
        registrationSuccess: false,
        loginEmail: null,
        loginPassword: null,
        incorrectInfo: false,

        emailErrorText: "",
        emailError: false,
        passwordErrorText: "",
        passwordError: false
    },
    mounted() {
        //on page load do this
        this.newlyRegistered();
    },
    methods: {
        checkLogin: function (e) {
            if (!this.loginEmail) {
                this.emailErrorText = "Please enter your email";
                this.emailError = true;
                this.incorrectInfo = false;
            } else if (!registerForm.validEmail(this.loginEmail)) {
                //if email doesn't match the regex definition
                this.emailErrorText = "Please enter a valid email";
                this.emailError = true;
                this.incorrectInfo = false;
            } else {
                this.emailErrorText = "";
                this.emailError = false;
                this.incorrectInfo = false;
            }

            if (!this.loginPassword) {
                this.passwordErrorText = "Please enter your password";
                this.passwordError = true;
                this.incorrectInfo = false;
            } else {
                this.passwordErrorText = "";
                this.passwordError = false;
                this.incorrectInfo = false;
            }

            //if both email and password are entered
            if (this.loginPassword && this.loginEmail) {
                if (!this.checkCredentials(this.loginEmail, this.loginPassword)) {
                    this.incorrectInfo = true;
                } else {
                    this.incorrectInfo = false;
                    localStorage.setItem('currentUser', JSON.stringify(this.loginEmail));
                    e.submit();
                }
            }

            e.preventDefault();
        },
        newlyRegistered: function () {
            if (localStorage.getItem("justRegistered") !== null) {
                this.registrationSuccess = true;
            }
        },
        checkCredentials: function (email, password) {
            var success = false;
            var found = userAccounts.find(element => element.email == email);

            if (found != undefined) {
                if (found.password == password) {
                    success = true;
                }
            }

            return success;
        }
    }
})


// Products Page
var ourProducts = new Vue({
    el: '.products',
    mounted() {
        //on page load do this
        this.displayedProducts;
    },
    data: function () {
        return {
            course:
                [
                    { 'Topic': 'Math', 'Location': 'Hendon', 'Price': 100 },
                    { 'Topic': 'Math', 'Location': 'Colindale', 'Price': 80 },
                    { 'Topic': 'Math', 'Location': 'Brent Cross', 'Price': 90 },
                    { 'Topic': 'Math', 'Location': 'Golders Green', 'Price': 120 },
                    { 'Topic': 'English', 'Location': 'Hendon', 'Price': 110 },
                    { 'Topic': 'English', 'Location': 'Colindale', 'Price': 90 },
                    { 'Topic': 'English', 'Location': 'Brent Cross', 'Price': 90 },
                    { 'Topic': 'English', 'Location': 'Golders Green', 'Price': 130 },
                    { 'Topic': 'Piano', 'Location': 'Hendon', 'Price': 120 },
                    { 'Topic': 'Piano', 'Location': 'Golders Green', 'Price': 140 },
                ],
            productsToDisplay: [],
        }
    },
    computed: {
        displayedProducts: function () {
            this.productsToDisplay = this.course;
        }
    }
});


var asideMenu = new Vue({
    el: '#aside',
    data: {
        location: [],
        topic: [],
        price: [],
        locationsExist: false,
        topicsExist: false,
        pricesExist: false,
        locationApplied: false,
        topicApplied: false,
        sliderValue: 50,
        locationFilterValue: [],
        topicFilterValue: [],
        filterValue: [],
        onlyTopicAR: [],
        onlyLocationAR: [],
    },
    mounted() {
        //on page load do this
        this.onlyLocation;
        this.onlyTopic;
        this.onlyPrice;
    },
    methods: {
        applyLocationFilter: function () {
            var filterGenerated = []; //All courses are pushed here
            var filteredObjects = []; //Filtered courses per filter go here
            var currentFilter = [];

            if (!this.topicApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = ourProducts.course;
                this.onlyLocationAR = ourProducts.course;
            } else if (this.locationApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = this.onlyLocationAR;
            }
            else {
                currentFilter = ourProducts.productsToDisplay;
            }

            if (this.locationFilterValue.length > 0) {
                this.locationApplied = true;
                for (var i = 0; i < this.locationFilterValue.length; i++) {
                    filteredObjects = this.locationFilterChecker(this.locationFilterValue[i], currentFilter);

                    for (var o = 0; o < filteredObjects.length; o++) {
                        filterGenerated.push(filteredObjects[o]);
                    }
                }
                ourProducts.productsToDisplay = filterGenerated;
                this.onlyLocationAR = filterGenerated;

            } else {
                if (this.onlyTopicAR.length > 0) {
                    ourProducts.productsToDisplay = this.onlyTopicAR;
                }else{
                    ourProducts.productsToDisplay = ourProducts.course;
                }
                this.onlyLocationAR = ourProducts.course;
                this.locationApplied = false;
            }
            console.log(this.onlyLocationAR);
        }, applyTopicFilter: function () {
            var filterGenerated = [];
            var filteredObjects = [];
            var currentFilter = [];

            if (!this.locationApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = ourProducts.course;
                this.onlyTopicAR = ourProducts.course;
            } else if (this.topicApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = this.onlyTopicAR;
            }
            else {
                currentFilter = ourProducts.productsToDisplay;
            }

            if (this.topicFilterValue.length > 0) {
                this.topicApplied = true;

                for (var i = 0; i < this.topicFilterValue.length; i++) {
                    filteredObjects = this.topicFilterChecker(this.topicFilterValue[i], currentFilter);

                    for (var o = 0; o < filteredObjects.length; o++) {
                        filterGenerated.push(filteredObjects[o]);
                    }
                }
                ourProducts.productsToDisplay = filterGenerated;
                this.onlyTopicAR = filterGenerated;

            } else {
                if (this.onlyLocationAR.length > 0) {
                    ourProducts.productsToDisplay = this.onlyLocationAR;
                }else{
                    ourProducts.productsToDisplay = ourProducts.course;
                }
                this.onlyTopicAR = ourProducts.course;
                this.topicApplied = false;
            }
            
            console.log(this.onlyTopicAR);
        },

        locationFilterChecker: function (checkVal, ar) {
            var locationsFiltered = ar;

            var filterGenerated = locationsFiltered.filter(function (location) {
                return location.Location == checkVal;
            })

            return filterGenerated;
        },
        topicFilterChecker: function (checkVal, ar) {
            var topicFiltered = ar;

            var filterGenerated = topicFiltered.filter(function (topic) {
                return topic.Topic == checkVal;
            })

            return filterGenerated;
        }
    },
    watch: {
        //this is watching for filter value to update
        locationFilterValue: function (val) {
            this.applyLocationFilter();
        },
        topicFilterValue: function (val) {
            this.applyTopicFilter();
        }
    },
    computed: {
        onlyLocation: function () {
            //Set will keep unique values and remove duplicates
            var locations = new Set();

            //Check for all locations and store them in set
            for (var i = 0; i < ourProducts.course.length; i++) {
                locations.add(ourProducts.course[i].Location);
            }

            //Our location array now holds all values of the set
            this.location = locations;

            //If there were values present then display the locations filter option
            if (this.location.size > 0) {
                this.locationsExist = true;
            }
        },
        onlyTopic: function () {
            var topics = new Set();

            for (var i = 0; i < ourProducts.course.length; i++) {
                topics.add(ourProducts.course[i].Topic);
            }

            this.topic = topics;

            if (this.topic.size > 0) {
                this.topicsExist = true;
            }
        },
        onlyPrice: function () {
            //create empty array for prices
            var prices = [];

            //push all prices to this new array
            for (var i = 0; i < ourProducts.course.length; i++) {
                prices[i] = ourProducts.course[i].Price;
            }

            //find max and min prices
            var maxPrice = Math.max(...prices);
            var minPrice = Math.min(...prices);

            //empty array once again and 
            //push the min and max only
            prices = [];
            prices.push(minPrice, maxPrice);

            this.price = prices;

            if (this.price.length > 0) {
                this.pricesExist = true;
                this.sliderValue = this.price[1];
            }

        }
    }
})

