new Vue({
    el: '#app',
    data: {
        events: []
    },
    mounted() {
        this.fetchEvents();
    },
    methods: {
        fetchEvents() {
            fetch('/get_events')
            .then(response => response.json())
            .then(data => {
                this.events = data;
            })
            .catch(error => console.error('Error:', error));
        },
        goToEventDetails(eventId) {
            window.location.href = `/event_details/${eventId}`;
        }
    }
});

Vue.component('event-card', {
    props: ['event'],
    template: `
        <div class="event-card">
            <img src="../images/Rectangle.png" class="event-card-img" :alt="event.event_name + '-img'">
            <div class="event-name">{{ event.event_name }}</div>
            <div class="event-details-btn" @click="$emit('details', event.event_id)">Find out more</div>
        </div>
    `
});



// This is for the header
new Vue({
  el: '.right_header2',
  data: {
    isNotLoggedIn: true,
    isUser: false,
    isManager: false,
    isAdmin: false
  },
  mounted(){
    this.getUser();
  },
  methods: {
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
              }
              else if (session.userRole === "admin"){
                this. isNotLoggedIn = false;
                this.isUser = false;
                this.isManager = false;
                this.isAdmin = true;
              }
              else if (session.userRole === "user"){
                this. isNotLoggedIn = false;
                this.isUser = true;
                this.isManager = false;
                this.isAdmin = false;
              }
              else {
                this. isNotLoggedIn = true;
                this.isUser = false;
                this.isManager = false;
                this.isAdmin = false;
              }
          }
      };
      xhttp.send();
    }
  }
});

