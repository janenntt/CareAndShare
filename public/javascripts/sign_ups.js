function isValidEmailInput(email){
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}

function isStrongPassword(password){
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function checkEmptyInput(input){
    if(!input.trim()){
        return false;
    }else{
        return true;
    }
}

function SignUp(){
    const isManager = document.querySelector('input[name = "isManager"]');
    const passwordInput = document.querySelector('input[name = "password"]');
    const verifyPassword = document.querySelector('input[name = "reenter-password"]');
    const passwordStrength = document.getElementById('password-strength');
    const passwordError = document.getElementById('confirm-password-error');
    const emailInput = document.querySelector('input[name = "email"]');
    const emailError = document.getElementById('email-error');
    const firstNameInput = document.querySelector('input[name = "first-name"]');
    const givenNameInput = document.querySelector('input[name = "given-name"]');
    const locationInput = document.querySelector('input[name = "location"]');
    const phoneInput = document.querySelector('input[name = "phone"]');
    const emptyFields = document.getElementById('empty');

    if(!isStrongPassword(passwordInput.value)){
        passwordStrength.textContent = 'Password require at least 8 characters, an uppercase and lowercase letter, one number and one special character';
    }else{
        passwordStrength.textContent = '';
    }

    if(passwordInput.value !== verifyPassword.value){
        passwordError.textContent = 'Password does not match';
    }else{
        passwordError.textContent = '';
    }

    if(!isValidEmailInput(emailInput.value)){
        emailError.textContent = 'Invalid email';
    }else{
        emailError.textContent = '';
    }

    if(!checkEmptyInput(firstNameInput.value) || !checkEmptyInput(givenNameInput.value)){
        emptyFields.textContent = 'This is a required field';
    }else{
        emptyFields.textContent = '';
    }

    if(!checkEmptyInput(locationInput.value) || !checkEmptyInput(phoneInput.value)){
        emptyFields.textContent = 'This is a required field';
    }else{
        emptyFields.textContent = '';
    }

    //pass all validation
    if(
        !emailError.textContent &&
        !passwordError.textContent &&
        !emptyFields.textContent &&
        !passwordStrength.textContent
    ){
        if(isManager.value === "false"){ //volunteer
            const email = emailInput.value;
            const password = passwordInput.value;
            const firstName = firstNameInput.value;
            const givenName = givenNameInput.value;
            const location = locationInput.value;
            const phoneNumber = phoneInput.value;
            const user_data = {
                emailAddress : email,
                password: password,
                firstName: firstName,
                givenName: givenName,
                location: location,
                phoneNumber: phoneNumber,
                isManager: false
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    window.location.href = '/signup_login/login.html';
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Unsuccessful Sign Up");
                } else if(xhttp.readyState === 4 && xhttp.status === 409){
                    emailError.textContent = 'This email already exists';
                }
            };
            xhttp.open('POST', '/SignUp', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(user_data));
        }else if(isManager.value === "true"){ //manager
            sessionStorage.removeItem('Manager_data');
            const email = emailInput.value;
            const password = passwordInput.value;
            const firstName = firstNameInput.value;
            const givenName = givenNameInput.value;
            const location = locationInput.value;
            const phoneNumber = phoneInput.value;
            const manager_data = {
                emailAddress : email,
                password: password,
                firstName: firstName,
                givenName: givenName,
                location: location,
                phoneNumber: phoneNumber,
                isManager: true
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    sessionStorage.setItem('Manager_data', JSON.stringify(manager_data));
                    window.location.href = `/signup_login/manager_signup2.html`;
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Sign Up Unsuccessful");
                } else if(xhttp.readyState === 4 && xhttp.status === 409){
                    emailError.textContent = 'This email already exists';
                }
            };
            xhttp.open('POST', '/SignUpManager1', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(manager_data));
        }else{ //admin
            const email = emailInput.value;
            const password = passwordInput.value;
            const firstName = firstNameInput.value;
            const givenName = givenNameInput.value;
            const location = locationInput.value;
            const phoneNumber = phoneInput.value;
            const admin_data = {
                emailAddress : email,
                password: password,
                firstName: firstName,
                givenName: givenName,
                location: location,
                phoneNumber: phoneNumber,
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    window.location.href = '/signup_login/login.html';
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Sign Up Unsuccessful");
                } else if(xhttp.readyState === 4 && xhttp.status === 409){
                    emailError.textContent = 'This email already exists';
                }
            };
            xhttp.open('POST', '/SignUpAdmin', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(admin_data));
        }
    }
}

function SignUpBranch(){
    const managerData = JSON.parse(sessionStorage.getItem('Manager_data'));
    const branchNameInput = document.querySelector('input[name = "branch-name"]').value;
    const emailInput = document.querySelector('input[name = "email"]').value;
    const locationInput = document.querySelector('input[name = "location"]').value;
    const phoneInput = document.querySelector('input[name = "phone"]').value;
    const descriptionInput = document.querySelector('textarea[name="branch-description"]').value;
    const emptyFields = document.getElementById('empty');
    const emailError = document.getElementById('email-error');

    if(!isValidEmailInput(emailInput)){
        emailError.textContent = 'Invalid email';
    } else {
        emailError.textContent = '';
    }

    if (!checkEmptyInput(branchNameInput) || !checkEmptyInput(emailInput) || !checkEmptyInput(locationInput) || !checkEmptyInput(phoneInput) || !checkEmptyInput(descriptionInput)) {
        emptyFields.textContent = 'All fields are required';
    } else {
        emptyFields.textContent = '';
    }

    if (!emailError.textContent && !emptyFields.textContent){
        const branchData = {
                branchName : branchNameInput,
                branchEmailAddress: emailInput,
                locationBranch: locationInput,
                phoneNumberBranch: phoneInput,
                branchDescription: descriptionInput
            }

            const combinedData = {
                ...managerData,
                ...branchData
            };

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    window.location.href = '/signup_login/login.html';
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Sign Up Unsuccessful");
                } else if (xhttp.readyState === 4 && xhttp.status === 409){
                    emailError.textContent = 'This branch already exists';
                }
            };
            xhttp.open('POST', '/SignUpManager', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(combinedData));
        }
}



function goToMiddle(){
    window.location.href = "../signup_login/middle.html";
}

function goToVolunteer(){
    window.location.href = '/signup_login/volunteer_signup.html';
}
function goToManager(){
    window.location.href = '/signup_login/manager_signup1.html';
}
function goToAdmin(){
    window.location.href = '/signup_login/systemadmin_signup.html';
}

function goToManager2(){
    window.location.href = '/signup_login/manager_signup2.html';
}

function goToMyAccount(){
    window.location.href = '/MyAccount.html';
}

// This is for the header
new Vue({
    el: '.right_header2',
    data: {
      avatar:'',
      isNotLoggedIn: true,
      isUser: false,
      isManager: false,
      isAdmin: false
    },
    mounted(){
      this.getUser();
    },
    methods: {
      DirectToMyAccount(){
        window.location.href = "/MyAccount.html";
      },
      DirectToNotificationList(){
        window.location.href= "/Announcements.html";
      },
      DirectToBranch(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/getSession', true);
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              let session = JSON.parse(xhttp.response);
              window.location.href=`/ManagerViewBranchInfo.html?branchId=${session.branchID}`
            }
          }
        xhttp.send();
      },
      logout(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/logout', true);
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.href="/index.html";
            }
          }
        xhttp.send();
      },
      hideDropDown(){
        console.log("This is passed");
        var x = document.querySelector('.dropdown-menu');
        if (x.style.display === 'none') {
          x.style.display = 'flex';
        } else {
          x.style.display = 'none';
        }
      },
      getUser(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/getSession', true);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let session = JSON.parse(xhttp.response);
                if (session.userRole === "manager"){
                  this. isNotLoggedIn = false;
                  this.isUser = false;
                  this.isManager = true;
                  this.isAdmin = false;
                  this.avatar = session.avatar;
                }
                else if (session.userRole === "admin"){
                  this. isNotLoggedIn = false;
                  this.isUser = false;
                  this.isManager = false;
                  this.isAdmin = true;
                  this.avatar = session.avatar;
                }
                else if (session.userRole === "user"){
                  this. isNotLoggedIn = false;
                  this.isUser = true;
                  this.isManager = false;
                  this.isAdmin = false;
                  this.avatar = session.avatar;
                }
                else {
                  this. isNotLoggedIn = true;
                  this.isUser = false;
                  this.isManager = false;
                  this.isAdmin = false;
                  this.avatar ='';
                }
            }
        };
        xhttp.send();
      }
    }
  });

