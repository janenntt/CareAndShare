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
  el: '#app',
  data() {
    return {
      eventInfo: [],
      event_id: '',
      branchName: '',
      buttonState: ''
    };
  },
  mounted() {
    this.getEventID(() => {
      this.getEventInfo(() => {
        this.getBranchName();
      });
    });
    this.getRSVPButton(this.event_id);
  },
  methods: {
    getEventID(callback) {
      this.event_id = new URLSearchParams(window.location.search).get('eventId');
      console.log(this.event_id);
      if (typeof callback === 'function') {
        callback();
      } else {
        console.error('Callback is not a function');
      }
    },
    getEventInfo(callback) {
      var eventID = this.event_id;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          let res = JSON.parse(xhttp.responseText);
          this.eventInfo = res[0];
          if (typeof callback === 'function') {
            callback();
          } else {
            console.error('Callback is not a function');
          }
        }
      };
      xhttp.open('POST', '/getEventInfo', true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({ eventID }));
    },
    getBranchName() {
      var branchID = this.eventInfo.branch_id;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          let res = JSON.parse(xhttp.responseText);
          this.branchName = res[0].branch_name;
        }
      };
      xhttp.open('POST', '/getBranchNameFromBranchID', true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({ branchID }));
    },
    getRSVPButton(event_id) {
      fetch(`/getRSVPButton/${this.event_id}`)
        .then(response => response.json())
        .then(data => {
          this.buttonState = data.button;
        })
        .catch(error => console.error('Error:', error));
    },
    handleRSVP() {
      if (this.buttonState === 'rsvp') {
        this.RSVPEvent();
      } else if (this.buttonState === 'rsvpd') {
        this.unRSVPEvent();
      }
    },
    RSVPEvent() {
      fetch('/RSVPEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_id: this.event_id })
      })
      .then(response => {
        if (response.status === 200) {
          this.getRSVPButton(this.event_id);
        } else {
          alert("Failed to RSVP");
        }
      })
      .catch(error => console.error('Error:', error));
    },
    unRSVPEvent() {
      fetch('/unRSVPEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_id: this.event_id })
      })
      .then(response => {
        if (response.status === 200) {
          this.getRSVPButton(this.event_id);
        } else {
          alert("Failed to unRSVP");
        }
      })
      .catch(error => console.error('Error:', error));
    },
    viewRSVPList() {
      window.location.href = `/ViewRSVP.html?event_id=${this.event_id}`;
    }
  }
});
