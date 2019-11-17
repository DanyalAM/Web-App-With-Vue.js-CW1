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
    }
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