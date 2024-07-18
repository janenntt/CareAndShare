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



//this is for event list
new Vue({
    el: '.app',
    data() {
        return {
            eventInfo: [],
            role: '',
            userID: '',
            branchID: ''
        };
    },
    computed: {
      formattedEvents() {
          return this.eventInfo.map(event => {
              return {
                  ...event,
                  formattedDate: new Date(event.event_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  }),
                  formattedTime: new Date('1970-01-01T' + event.event_time + 'Z').toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                  })
              };
          });
        }
      },
    mounted(){
        this.getRole();

    },
    methods: {
        directToEventDetails(a){
            window.location.href=`/eventDetails.html?eventId=${a}`;
        },
        getRole(){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getSession', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let session = JSON.parse(xhttp.response);
                        console.log(session);
                        this.role = session.userRole;
                        console.log(this.role);
                        this.getEvent();
                    }
                }
            }
            xhttp.send();
        },
        getEvent(){
            console.log(this.role);
            if (this.role === "guest"){
                this.getEventListForGuest();
            } else if (this.role === "manager"){
                this.getBranchID(this.getEventListForManager);

            } else if (this.role === "admin"){
                this.getEventListForAdmin();
            } else if (this.role === "user"){
                this.getUserID(this.getEventListForUser);

            }
        },

        getUserID(callback){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getSession', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let session = JSON.parse(xhttp.response);
                        if (session.userRole === "user") {
                            this.userID = session.userID;
                            callback();
                        }
                    }
                }
            }
            xhttp.send();
        },


        getEventListForGuest(){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getEventForGuestUser', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let res = JSON.parse(xhttp.response);
                        this.eventInfo = res;
                    }
                }
            }
            xhttp.send();
        },
        getEventListForUser(){
            var user_ID = this.userID;
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/getEventForNormalUser', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let res = JSON.parse(xhttp.response);
                        this.eventInfo = res;
                    }
                }
            }
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify({ user_ID }));
        },
        getEventListForManager(){
            var branch_ID = this.branchID;
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/getEventForManager', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let res = JSON.parse(xhttp.response);
                        this.eventInfo = res;
                    }
                }
            }
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify({ branch_ID }));
        },
        
        getEventListForAdmin(){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getEventForAdmin', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let res = JSON.parse(xhttp.response);
                        this.eventInfo = res;
                    }
                }
            }
            xhttp.send();
        },
        getBranchID(callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getSession', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        let session = JSON.parse(xhttp.response);
                        if (session.userRole === "manager") {
                            this.branchID = session.branchID;
                            callback();
                        }
                    }
                }
            };
            xhttp.send();
        }
    }
});


// This is for admin line
new Vue({
    el: '.adminline',
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
