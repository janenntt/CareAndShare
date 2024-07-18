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
    el: '.app',
    data() {
      return {
        announcementInfo: [],
        userID: ''
      };
    },
    mounted(){
      this.initialize();
    },
    methods: {
      initialize() {
        this.getAnnouncementInfo();
      },
      getUserID() {
        return new Promise((resolve, reject) => {
          var xhttp = new XMLHttpRequest();
          xhttp.open('GET', '/getSession', true);
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
              if (xhttp.status === 200) {
                let session = JSON.parse(xhttp.response);
                if (session.userRole === "user") {
                  this.userID = session.userID;
                  resolve(this.userID);
                } else {
                  reject('User role is not "user"');
                }
              } else {
                reject('Failed to fetch session');
              }
            }
          };
          xhttp.send();
        });
      },
      getBranchName(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/getBranchName', true);
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              let session = JSON.parse(xhttp.response);
              if (session.userRole === "user") {
                this.userID = session.userID;
                resolve(this.userID);
              } else {
                reject('User role is not "user"');
              }
            } else {
              reject('Failed to fetch session');
            }
          }
        };
        xhttp.send();

      },
      getAnnouncementInfo() {
        this.getUserID().then(userID => {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
              let res = JSON.parse(xhttp.response);
              this.announcementInfo = res;
              this.getBranchName(); // Later change this to call back function.
            }
          };
          xhttp.open('POST', '/getAnnouncementInfo', true);
          xhttp.setRequestHeader('Content-Type', 'application/json');
          xhttp.send(JSON.stringify({ userID }));
        }).catch(error => console.error(error));
      }
    }
  });
