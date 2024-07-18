
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
              // if (session.userRole === "manager"){
              // }
              window.location.href=`/AdminViewBranchInfo.html?branchId=${session.branchID}`;
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


" event, both, branch, none";


new Vue({
    el: '#app',
    data: {
        userId: '',
        isButton1On: false,
        isButton2On: false
    },
    type: "both",
    mounted(){
        this.getUserID();
    },
    methods: {
        getUserID(){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getSession', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    let session = JSON.parse(xhttp.response);
                    if (session.userRole === "user"){
                        this.userId = session.userID;
                    }
                }
            };
            xhttp.send();
        },
        toggleButton1() {
            this.isButton1On = !this.isButton1On;
            this.updateEmailNotification();
        },
        toggleButton2() {
            this.isButton2On = !this.isButton2On;
            this.updateEmailNotification();
        },
        updateEmailNotification(){
            let type = "none";
            if (this.isButton1On && this.isButton2On) {
                type = "both";
            } else if (this.isButton1On) {
                type = "event";
            } else if (this.isButton2On) {
                type = "branch";
            }
            console.log(type);
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/updateEmailNotificationOptions', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    alert("Update email notification list successfully");
                }
            };
            xhttp.setRequestHeader('Content-Type', 'application/json');
            
            var emailData ={
                Email_type: type,
                userID: this.userId
            };
            xhttp.send(JSON.stringify(emailData));
        }
    }
});