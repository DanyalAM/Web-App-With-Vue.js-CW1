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
var servicesProvided = JSON.parse(localStorage.getItem('servicesProvided'));

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
            userType: null,
            userID: 0,
            userCrumbs: [],
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
            if (this.allCorrect.length >= 5) {
                this.registerInfo.userID = (userAccounts.length + 1);
                this.registerInfo.email = this.registerInfo.email.toLowerCase();
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
                if (element.email.toLowerCase() == email.toLowerCase()) {
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
            var found = userAccounts.find(element => element.email.toLowerCase() == email.toLowerCase());

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

        //Upload our own courses to localstorage
        if (localStorage.getItem('productsUploaded') === null) {
            for (var i = 0; i < this.course.length; i++) {
                servicesProvided.push(this.course[i]);
            }
            localStorage.setItem('servicesProvided', JSON.stringify(servicesProvided));
            localStorage.setItem('productsUploaded', 1);
        }

        this.course = servicesProvided;

        if (window.location.search.split('=')[1] == "") {
            this.searchApplied = false;
        } else {
            this.searchApplied = true;
        }

    },
    data: function () {
        return {
            course:
                [
                    {
                        'Topic': 'Math', 'Location': 'Hendon', 'Price': 100, 'AvgRating': 0, 'Raters': 0, 'productID': 1, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'Math', 'Location': 'Colindale', 'Price': 80, 'AvgRating': 0, 'Raters': 0, 'productID': 2, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'Math', 'Location': 'Brent Cross', 'Price': 90, 'AvgRating': 0, 'Raters': 0, 'productID': 3, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'Math', 'Location': 'Golders Green', 'Price': 120, 'AvgRating': 0, 'Raters': 0, 'productID': 4, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'English', 'Location': 'Hendon', 'Price': 110, 'AvgRating': 0, 'Raters': 0, 'productID': 5, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'English', 'Location': 'Colindale', 'Price': 90, 'AvgRating': 0, 'Raters': 0, 'productID': 6, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'English', 'Location': 'Brent Cross', 'Price': 90, 'AvgRating': 0, 'Raters': 0, 'productID': 7, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'English', 'Location': 'Golders Green', 'Price': 130, 'AvgRating': 0, 'Raters': 0, 'productID': 8, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'Piano', 'Location': 'Hendon', 'Price': 120, 'AvgRating': 0, 'Raters': 0, 'productID': 9, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                    {
                        'Topic': 'Piano', 'Location': 'Golders Green', 'Price': 140, 'AvgRating': 0, 'Raters': 0, 'productID': 10, 'Ratings':
                        {
                            'Rated5': 0,
                            'Rated4': 0,
                            'Rated3': 0,
                            'Rated2': 0,
                            'Rated1': 0,
                        }
                    },
                ],
            productsToDisplay: [],
            avgRating: 0,
            run: false,
            crumbFound: false,
            alreadyRated: false,
            sortSelected: '',
            searchApplied: false,
            curSearch: '',
        }
    },
    methods: {
        likeProduct: function (index, prodID) {

            this.alreadyRated = false;
            //get the logged in user
            var currentUserEmail = JSON.parse(localStorage.getItem('currentUser'));

            //get their index in the array
            var loggedInUserIndex = userAccounts.map(function (item) { return item.email }).indexOf(currentUserEmail);

            for (var c = 0; c < userAccounts[loggedInUserIndex].userCrumbs.length; c++) {
                // if user's crumbs match the product ID then theyve liked it before

                if (userAccounts[loggedInUserIndex].userCrumbs[c] == prodID) {
                    //exit loop if crumb is found
                    this.crumbFound = true;
                    this.alreadyRated = true;
                    setTimeout(() => { this.alreadyRated = false }, 3000)
                } else {
                    this.crumbFound = false;
                }

            }

            //run only if the user hasn't liked this product before
            if (!this.crumbFound) {
                //get index of the rated object
                var ratedObjectIndex = servicesProvided.map(function (item) { return item.productID }).indexOf(prodID);

                //rated item
                var ratedItem = servicesProvided[ratedObjectIndex];

                //what has the user rated? (Rated5, Rated4, Rated3, Rated2, Rated1)
                var userRatingProperty = ("Rated" + (index + 1));

                //Get the rating property for user's rating number
                ratedItem.Ratings[userRatingProperty]++;

                //multiply all ratings numbers by their rated value
                //and divide them by all the ratings combined 
                //this will give a float average so we have to convert to a whole number
                ratedItem.AvgRating = Math.floor((5 * ratedItem.Ratings['Rated5']
                    + 4 * ratedItem.Ratings['Rated4']
                    + 3 * ratedItem.Ratings['Rated3']
                    + 2 * ratedItem.Ratings['Rated2']
                    + 1 * ratedItem.Ratings['Rated1'])
                    / (ratedItem.Ratings['Rated5']
                        + ratedItem.Ratings['Rated4']
                        + ratedItem.Ratings['Rated3']
                        + ratedItem.Ratings['Rated2']
                        + ratedItem.Ratings['Rated1']));


                //Update the number of people who have rated
                ratedItem.Raters++;

                // update old item and save
                servicesProvided[ratedObjectIndex] = ratedItem;
                localStorage.setItem('servicesProvided', JSON.stringify(servicesProvided));

                //update the products theyve liked
                userAccounts[loggedInUserIndex].userCrumbs.push(prodID);

                //add back the data to localstorage
                localStorage.setItem('userInfo', JSON.stringify(userAccounts));

            }
        },
        sortUpdated: function () {
            //if first sort is selected
            if (this.sortSelected == 1) {
                //sort alphabetically A-Z
                this.productsToDisplay.sort((a, b) => a.Topic.localeCompare(b.Topic));
            } else if (this.sortSelected == 2) {
                //otherwise is option 2 is selected 
                //sort alphabetically Z-A
                this.productsToDisplay.sort((a, b) => b.Topic.localeCompare(a.Topic));
            } else if (this.sortSelected == 3) {
                //otherwise if option 3 is selected
                //sort by price high to low
                this.productsToDisplay.sort(function (a, b) { return b.Price - a.Price });
            }
            else if (this.sortSelected == 4) {
                //otherwise if option 4 is selected
                //sort by price low to high
                this.productsToDisplay.sort(function (a, b) { return a.Price - b.Price });
            } else if (this.sortSelected == 5) {
                //if option 5 is selected
                //sort by best reviews to worse 
                this.productsToDisplay.sort(function (a, b) { return b.AvgRating - a.AvgRating });
            }
        }
    },
    computed: {
        displayedProducts: function () {
            this.productsToDisplay = servicesProvided;
        }
    }
});


var userPage = new Vue({
    el: '.user-page',
    data: {
        username: '',
        currentUserIsProvider: false,
        providerProducts: [],
        allCorrect: [],
        userProducts: JSON.parse(localStorage.getItem('servicesProvided')),

        subjectInfo: {
            Topic: null,
            Location: null,
            Price: 100,
            Rating: 0,
            AvgRating: 0,
            Raters: 0,
            productID: 0,
            Ratings: {
                'Rated5': 0,
                'Rated4': 0,
                'Rated3': 0,
                'Rated2': 0,
                'Rated1': 0,
            },
            userID: 0,
        },

        topicError: false,
        topicErrorText: '',
        priceError: false,
        priceErrorText: '',
        locationError: false,
        locationErrorText: ''
    },
    mounted() {
        this.confirmName();
        this.checkUserID();
        this.displayUserLessons();
    },
    methods: {
        verifyLesson: function (e) {
            if (!this.subjectInfo.Topic) {
                this.topicError = true;
                this.topicErrorText = "Please enter the topic of your course"
                this.allCorrect[0] = false;
            } else {
                this.topicError = false;
                this.topicErrorText = "";
                this.allCorrect[0] = true;
            }

            if (!this.subjectInfo.Price) {
                this.priceError = true;
                this.priceErrorText = "Please enter the price of your course"
                this.allCorrect[1] = false;
            } else {
                this.priceError = false;
                this.priceErrorText = "";
                this.allCorrect[1] = true;
            }

            if (!this.subjectInfo.Location) {
                this.locationError = true;
                this.locationErrorText = "Please enter the location of your course"
                this.allCorrect[2] = false;
            } else {
                this.locationError = false;
                this.locationErrorText = "";
                this.allCorrect[2] = true;

            }

            if (this.allCorrect.filter(item => item === true).length > 2) {
                var currentUserEmail = JSON.parse(localStorage.getItem('currentUser')); //current user email
                //find user full details with that email
                var found = userAccounts.find(element => element.email == currentUserEmail);

                this.subjectInfo.userID = found.userID;

                //get services localstorage
                if (this.userProducts !== null) {

                    var uniqueID = Date.now() + Math.random()
                    this.subjectInfo.productID = (parseInt(uniqueID));

                    //number has to be parsed or it saves as string
                    this.subjectInfo.Price = parseInt(this.subjectInfo.Price);
                    servicesProvided.push(this.subjectInfo);
                    localStorage.setItem('servicesProvided', JSON.stringify(servicesProvided));
                    e.submit();
                }

            }

            e.preventDefault();
        },
        confirmName: function () {
            if (localStorage.getItem('currentUser') !== null) {
                var currentUserEmail = JSON.parse(localStorage.getItem('currentUser')); //current user email
                //find user full details with that email
                var found = userAccounts.find(element => element.email == currentUserEmail);
                //update username on user's page
                this.username = found.name;
            }
        },
        checkUserID: function () {
            var currentUserEmail = JSON.parse(localStorage.getItem('currentUser')); //current user email
            //find user full details with that email
            var found = userAccounts.find(element => element.email == currentUserEmail);

            if (found !== undefined) {
                if (found.userType == 1) {
                    this.currentUserIsProvider = false
                } else if (found.userType == undefined) {
                    this.currentUserIsProvider = false
                }
                else {
                    this.currentUserIsProvider = true;
                }
            }
        },
        displayUserLessons: function () {
            var currentUserEmail = JSON.parse(localStorage.getItem('currentUser')); //current user email
            //find user full details with that email

            if (currentUserEmail !== null) {
                var found = userAccounts.find(element => element.email == currentUserEmail);

                this.providerProducts = this.servicesFilter(found.userID, this.userProducts);
            }
        },
        servicesFilter: function (checkVal, ar) {
            //check what services belongs to the logged on user only
            var topicFiltered = ar;

            var filterGenerated = topicFiltered.filter(function (service) {
                return service.userID == checkVal;
            })

            return filterGenerated;
        },
        removeProduct: function (removalPos) {
            this.userProducts = this.userProducts.filter(item => item.productID !== this.providerProducts[removalPos].productID);

            localStorage.setItem('servicesProvided', JSON.stringify(this.userProducts));

            this.providerProducts.splice(removalPos, 1);
            window.location.reload();
        }
    }
})


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
        priceApplied: false,
        sliderValue: 50,
        locationFilterValue: [],
        topicFilterValue: [],
        filterValue: [],
        onlyTopicAR: [],
        onlyLocationAR: [],
        onlyPriceAR: [],
        endLFilter: false,
        endTFilter: false,
        alreadyRunL: false,
        alreadyRunT: false,
    },
    mounted() {
        //on page load do this
        this.onlyLocation;
        this.onlyTopic;
        this.onlyPrice;
    },
    methods: {
        applyLocationFilter: function () {
            this.onlyLocationAR = ourProducts.course;
            var filterGenerated = []; //All courses are pushed here
            var filteredObjects = []; //Filtered courses per filter go here
            var currentFilter = [];

            if (!this.topicApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = ourProducts.course;
                this.onlyLocationAR = ourProducts.course;
            } else if (this.topicApplied) {

                if (this.onlyTopicAR.length > 0 || !this.endTFilter) {
                    this.endTFilter = true;
                    this.applyTopicFilter();
                }
                currentFilter = this.onlyTopicAR;
            }
            else if (this.locationApplied) {
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = this.onlyLocationAR;
            }
            else {
                currentFilter = ourProducts.productsToDisplay;
            }

            if (this.locationFilterValue.length > 0) {
                this.endLFilter = false;
                this.locationApplied = true;
                this.alreadyRunL = false;
                for (var i = 0; i < this.locationFilterValue.length; i++) {
                    filteredObjects = this.locationFilterChecker(this.locationFilterValue[i], currentFilter);

                    for (var o = 0; o < filteredObjects.length; o++) {
                        filterGenerated.push(filteredObjects[o]);
                    }
                }

                if (this.priceApplied) {
                    filterGenerated = this.priceFilterChecker(this.sliderValue, filterGenerated);
                }


                ourProducts.productsToDisplay = filterGenerated;
                this.onlyLocationAR = filterGenerated;

            } else {
                if (!this.endTFilter) {
                    this.endTFilter = true;
                    this.applyTopicFilter();
                    ourProducts.productsToDisplay = this.onlyTopicAR;
                } else {
                    ourProducts.productsToDisplay = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), ourProducts.course);
                }
                if (!this.alreadyRunL) {
                    this.alreadyRunL = true;
                    this.applyPriceFilter();
                }
                this.onlyLocationAR = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), servicesProvided);
                this.locationApplied = false;

                if (ourProducts.sortSelected != "") {
                    ourProducts.sortUpdated();
                }
            }
        }, applyTopicFilter: function () {
            this.onlyTopicAR = ourProducts.course;
            var filterGenerated = [];
            var filteredObjects = [];
            var currentFilter = [];

            //if location filter is not applied
            if (!this.locationApplied) {
                //Just use the full productd array because its a 
                //singular filter
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = ourProducts.course;
                this.onlyTopicAR = ourProducts.course;
            }
            //if location filter IS applied
            else if (this.locationApplied) {
                //rerun the location filter ONCE
                if (!this.endLFilter) {
                    this.endLFilter = true;
                    this.applyLocationFilter();
                }
                //if location is applied then use the location only array as filter
                currentFilter = this.onlyLocationAR;
                //update the topic array

            }
            else if (this.topicApplied) {
                //if only topic is applied use the 
                //topic array for filter
                ourProducts.productsToDisplay = ourProducts.course;
                currentFilter = this.onlyTopicAR;
            }
            else {
                //otherwise no filter is selected
                //apply filter to ALL products
                currentFilter = ourProducts.productsToDisplay;
            }

            if (this.topicFilterValue.length > 0) {
                this.alreadyRunT = false;
                this.topicApplied = true;
                this.endTFilter = false;

                for (var i = 0; i < this.topicFilterValue.length; i++) {
                    filteredObjects = this.topicFilterChecker(this.topicFilterValue[i], currentFilter);

                    for (var o = 0; o < filteredObjects.length; o++) {
                        filterGenerated.push(filteredObjects[o]);
                    }
                }

                if (this.priceApplied) {
                    filterGenerated = this.priceFilterChecker(this.sliderValue, filterGenerated);
                }

                ourProducts.productsToDisplay = filterGenerated;
                this.onlyTopicAR = filterGenerated;

            } else {
                if (this.onlyLocationAR.length > 0 && !this.endLFilter) {
                    this.endLFilter = true;
                    this.applyLocationFilter();
                    ourProducts.productsToDisplay = this.onlyLocationAR;
                } else {
                    ourProducts.productsToDisplay = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), ourProducts.course);
                }
                if (!this.alreadyRunT) {
                    this.alreadyRunT = true;
                    this.applyPriceFilter();
                }
                this.onlyTopicAR = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), servicesProvided);
                this.topicApplied = false;

                if (ourProducts.sortSelected != "") {
                    ourProducts.sortUpdated();
                }
            }
        },
        applyPriceFilter: function () {
            if (!this.locationApplied && !this.topicApplied) {
                ourProducts.productsToDisplay = this.priceFilterChecker(this.sliderValue, ourProducts.course);
            } else if (this.locationApplied && !this.topicApplied) {
                this.applyLocationFilter();
                ourProducts.productsToDisplay = this.priceFilterChecker(this.sliderValue, this.onlyLocationAR);
            } else if (!this.locationApplied && this.topicApplied) {
                this.applyTopicFilter();
                ourProducts.productsToDisplay = this.priceFilterChecker(this.sliderValue, this.onlyTopicAR);
            } else {
                this.applyLocationFilter();
                this.applyTopicFilter();
                ourProducts.productsToDisplay = this.priceFilterChecker(this.sliderValue, ourProducts.productsToDisplay);
            }

            if (ourProducts.sortSelected != "") {
                ourProducts.sortUpdated();
            }

            this.priceApplied = true;

        },
        locationFilterChecker: function (checkVal, ar) {
            var locationsFiltered = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), ar);

            var filterGenerated = locationsFiltered.filter(function (location) {
                return location.Location == checkVal;
            })

            return filterGenerated;
        },
        topicFilterChecker: function (checkVal, ar) {
            var topicFiltered = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), ar);

            var filterGenerated = topicFiltered.filter(function (topic) {
                return topic.Topic == checkVal;
            })

            return filterGenerated;
        },
        priceFilterChecker: function (checkVal, ar) {
            var topicFiltered = pageHeader.searchFilter(pageHeader.searchedQuery.toLowerCase(), ar);

            var filterGenerated = topicFiltered.filter(function (price) {
                return price.Price <= checkVal;
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
            for (var i = 0; i < servicesProvided.length; i++) {
                locations.add(servicesProvided[i].Location);
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

            for (var i = 0; i < servicesProvided.length; i++) {
                topics.add(servicesProvided[i].Topic);
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
            for (var i = 0; i < servicesProvided.length; i++) {
                prices[i] = servicesProvided[i].Price;
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

//Hamburger-Menu
//If button is clicked and Nav bar is not open then the nav bar opens
//If the nav bar is already open then button click will close it
var pageHeader = new Vue({
    el: 'header',
    data: {
        loggedIn: false,
        buttonLinkRegister: "../page/register.html",
        buttonLinkLogin: "../page/login.html",
        buttonLinkAccount: "../page/myAccount.html",
        searchedQuery: '',
        currentSearch: window.location.search,
        listOfWords: [],
    },
    mounted() {
        //on page load do this
        this.isLoggedIn();
        this.userSearched();
    },
    methods: {
        menuClicked: function () {
            if (menuBar.show) {
                menuBar.show = false;
            } else {
                menuBar.show = true;
            }
        },
        isLoggedIn: function () {
            if (localStorage.getItem('currentUser') != undefined) {
                this.loggedIn = true;
            }
        },
        logout: function () {
            if (localStorage.getItem('currentUser') != undefined) {
                localStorage.removeItem('currentUser');
                this.loggedIn = false;
            }
        },
        userSearched: function () {
            //remove = and everything before it
            this.listOfWords = [];
            var queryString = this.currentSearch ? this.currentSearch.split('=')[1] : this.currentSearch.slice(1);

            //split all words based on where ever + is found
            //this will create an array of words
            this.listOfWords = queryString.split('+');

            //turn that array into a word or sentence
            for (var i = 0; i < this.listOfWords.length; i++) {
                this.searchedQuery += this.listOfWords[i] + " ";
                ourProducts.curSearch += this.listOfWords[i] + " "; 
            }

            this.currentSearch = '';

            if (this.searchedQuery !== undefined) {
                ourProducts.productsToDisplay = this.searchFilter(this.searchedQuery.toLowerCase(), servicesProvided);
            }
        },
        searchFilter: function (val, ar) {
            var searchGenerated = ar.filter(function (a) {
                return a.Topic.toLowerCase().includes(val.trim());
            })

            return searchGenerated;
        }
    }
})

//THIS SCRIPT FROM THIS POINT FORWARD IS COSEMETIC ONLY IT SERVES 
//NO PURPOSE OTHER THAN CONTROLLING THE BEHAVIOUR OF THE NAVIGATION MENU

//This is a directive to check if user click outside of the navigation menu
Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            //if the click is outside the nav bar and its children then proceed
            //otherwise nothing happens
            if (!(el == event.target || el.contains(event.target))) {
                //If the click is not on the hamburger menu or its child (the icon) then proceed
                //or nothing happens
                if (!(event.target == pageHeader.$refs.menuButton || pageHeader.$refs.menuButton.contains(event.target))) {
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

