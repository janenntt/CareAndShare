/* eslint-disable no-undef */
// This is for the header
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

new Vue({
    el: ".branch",
    data() {
        return {
            users: []
        };
    },
    mounted(){
        this.getUsersToAssign();
    },
    methods: {
        getUsersToAssign(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                        var response = JSON.parse(xhttp.responseText);
                        this.users = response.users;
                    } catch (e) {
                        console.error("Error parsing response JSON", e);
                    }
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Unsuccessful");
                }
              };
            xhttp.open('GET', '/admin/getUsersAssignManagers', true);
            xhttp.send();
        }
    }
});

function isValidEmailInput(email){
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}

function checkEmptyInput(input){
    if(!input.trim()){
        return false;
    }else{
        return true;
    }
}

function SignUpBranch(){
        const errorEmpty = document.getElementById('errors-empty');
        const errorEmail = document.getElementById('errors-email');
        const errorMana = document.getElementById('errors-manager');

        const branchNameInput = document.querySelector('input[name = "branch-name"]').value;
        const emailInput = document.querySelector('input[name = "email"]').value;
        const locationInput = document.querySelector('input[name = "location"]').value;
        const phoneInput = document.querySelector('input[name = "phone"]').value;
        const descriptionInput = document.querySelector('textarea[name="branch-description"]').value;
        const selectedUserId = document.getElementById('user-select').value;
        if(!isValidEmailInput(emailInput)){
            errorEmail.textContent = 'Invalid email';
        }else{
            errorEmail.textContent = '';
        }

        if(!checkEmptyInput(branchNameInput) || !checkEmptyInput(descriptionInput)){
            errorEmpty.textContent = 'This is a required field';
        }else{
            errorEmpty.textContent = '';
        }

        if(!checkEmptyInput(locationInput) || !checkEmptyInput(phoneInput)){
            errorEmpty.textContent = 'This is a required field';
        }else{
            errorEmpty.textContent = '';
        }

        if (selectedUserId === '0') {
            errorMana.textContent = "Please select a manager.";
        }else{
            errorMana.textContent = "";
        }

        const branchData = {
            name: branchNameInput,
            email: emailInput,
            phone: phoneInput,
            location: locationInput,
            description: descriptionInput,
            managerId: selectedUserId
        };

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                try {
                    alert("Succesfully Create New Branch");
                    window.location.href = '/SystemAdminViewBranches.html';
                } catch (e) {
                    console.error("Error parsing response JSON", e);
                }
            } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                alert("Unsuccessful");
            }
        };
        xhttp.open('POST', '/admin/adminCreateNewBranch', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(branchData));
}
