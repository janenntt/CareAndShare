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
            window.location.href=`/ManagerViewBranchInfo.html?branchId=${session.branchID}`;
          }
        };
      xhttp.send();
    },
    logout(){
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', '/logout', true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          window.location.href="/index.html";
          }
        };
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
    el: '.app1',
    data() {
        return {
            user: {
                error: '',
                oldPassword: '',
                newPassword: '',
                error2: ''
            }
        };
    },
    methods: {
        isStrongPassword(password) {
            // Ensure the regex is correct
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        },
        checkEmptyInput(input) {
            return !!input.trim(); // Simplified check for empty input
        },
        changePassword() {
            this.user.error = '';
            this.user.error2 = '';

            // Check if the new password is strong
            if (!this.isStrongPassword(this.user.newPassword)) {
                this.user.error2 = 'Password requires at least 8 characters, an uppercase and lowercase letter, one number, and one special character';
            }

            // Check if the new password field is empty
            if (!this.checkEmptyInput(this.user.newPassword)) {
                this.user.error2 = 'This is a required field';
            }

            if (!this.user.error2) { // Proceed if there are no validation errors
                const data = {
                    oldPassword: this.user.oldPassword,
                    newPassword: this.user.newPassword
                };

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            window.location.href = "/signup_login/login.html";
                        } else if (xhttp.status === 401) {
                            this.user.error = "Your old password does not match";
                        } else {
                            this.user.error = "An error occurred. Please try again.";
                        }
                    }
                };
                xhttp.open('POST', '/users/changePassword', true);
                xhttp.setRequestHeader('Content-Type', 'application/json');
                xhttp.send(JSON.stringify(data));
            }
        }
    }
});


