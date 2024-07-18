new Vue({
    el: '#inner1',
    data() {
      return {
          event:{
            eventId:'',
            eventName:'',
            description:'',
            date:'',
            time:'',
            location:'',
            is_private:'',
            poster:'',
            branchId:''
          }
      };
    },
    mounted(){
      const eventId = new URLSearchParams(window.location.search).get('eventId');
      this.event.eventId = eventId;
      this.fetchEventInfo(eventId);
    },
    methods: {
        fetchEventInfo(eventId) {
          fetch(`/getEventInfo?eventId=${eventId}`)
            .then(response => response.json())
            .then(data => {
              this.event.branchId = data.branch_id;
              this.event.eventName = data.event_name;
              this.event.description = data.event_description;
              this.event.location = data.event_location;
              this.event.poster = data.poster;
              this.event.is_private = data.is_private;
              this.event.time = data.event_time;
              this.event.date = data.event_date;
            })
            .catch(error => console.error('Error:', error));
        },
        ManagerEditEvent() {
          const eventData = {
            eventId: this.event.eventId,
            eventName: this.event.eventName,
            eventDescription: this.event.description,
            eventDate: this.event.date,
            eventTime: this.event.time,
            eventLocation: this.event.location,
            isPrivate: this.event.is_private ,
            poster: this.event.poster,
          };
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                alert('Event updated successfully');
                console.log("Edit successfully");
                window.location.href = '/ManagerViewPostedevents.html';
            } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                alert("Unsuccessful");
            }
          };
         xhttp.open('POST', '/ManagerEditEvent', true);
          xhttp.setRequestHeader('Content-Type', 'application/json');
          xhttp.send(JSON.stringify(eventData));
        }
      }
  });


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
