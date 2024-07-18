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
  el: '.app',
  data() {
    return {
      eventInfo: [],
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
    this.initialize();
  },
  methods: {
    initialize() {
      this.getEventInfo();
    },
    DeleteEvent(a){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 ) {
              if (xhttp.status === 200) {
                  this.eventInfo = this.eventInfo.filter(event => event.event_id !== a);
              }
          } else if (xhttp.readyState === 4 && xhttp.status === 401) {
              alert("Unsuccessful");
          }
      };
      xhttp.open('POST', '/ManagerDeleteEvent', true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({eventId:a}));
    },
    getBranchID() {
      return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/getSession', true);
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              let session = JSON.parse(xhttp.response);
              if (session.userRole === "manager") {
                this.branchID = session.branchID;
                resolve(this.branchID);
              } else {
                reject('User role is not "manager"');
              }
            } else {
              reject('Failed to fetch session');
            }
          }
        };
        xhttp.send();
      });
    },
    getEventInfo() {
      this.getBranchID().then(branchID => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            let res = JSON.parse(xhttp.response);
            this.eventInfo = res;
          }
        };
        xhttp.open('POST', '/getEventInfoForEachBranch', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({ branchID }));
      }).catch(error => console.error(error));
    },
    directEditEventPage(a){
      window.location.href=`/ManagerEditEvent.html?eventId=${a}`;
    }
  }
});