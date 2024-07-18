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
  el: '#Join',
  data() {
    return {
      isNotLoggedIn:''
    };
  },
  mounted(){
    this.getButton();
  },
  methods: {
    getButton(){
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', '/getSession', true);
      xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              let session = JSON.parse(xhttp.response);
              if (session.userRole === "manager"){
                this. isNotLoggedIn = false;
              }
              else if (session.userRole === "admin"){
                this. isNotLoggedIn = false;
              }
              else if (session.userRole === "user"){
                this. isNotLoggedIn = false;
              }
              else {
                this. isNotLoggedIn = true;
              }
          }
      };
      xhttp.send();
    },
    ReDirectToMiddle(){
      window.location.href = '/signup_login/middle.html';
    }
  }
});