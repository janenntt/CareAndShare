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
  el: ".profile",
  data() {
      return {
          user: {
            first_name: '',
            given_name: '',
            location: '',
            email: '',
            contact: '',
            avatar: ''
          },
          branches:[]
      };
  },
  mounted(){
      this.getUserData();
  },
  methods: {
    getUserData(){
      fetch(`/users/getData`)
          .then(response => response.json())
          .then(data => {
            this.user.first_name = data.user.first_name;
            this.user.given_name = data.user.last_name;
            this.user.location = data.user.location;
            this.user.email = data.user.email_address;
            this.user.contact = data.user.phone_number;
            this.user.avatar = data.user.avatar;
            this.branches = data.branches;
          })
          .catch(error => console.error('Error:', error));
      },
    goToMyAccount(){
      window.location.href = "/MyAccount.html";
    }
  }
});



function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
    const output = document.getElementById('avatar-display');
    output.src = reader.result;
    output.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

