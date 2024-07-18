//admin4.js

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


new Vue({
  el: '.Information-branch',
  data() {
    return {
        branch:{
          branchId: '',
          branchName: '',
          email: '',
          location: '',
          phone: '',
          description: ''
        },
        members: [],
    };
  },
  mounted(){
    const branchId = new URLSearchParams(window.location.search).get('branchId');
    this.branch.branchId = branchId;
    this.fetchBranchInfo(branchId);
  },
  methods: {
      fetchBranchInfo(branchId) {
        fetch(`/admin/getBranchInfo?branchId=${branchId}`)
          .then(response => response.json())
          .then(data => {
            this.branch.branchName = data.branch.branch_name;
            this.branch.email = data.branch.branch_email;
            this.branch.description = data.branch.branch_description;
            this.branch.location = data.branch.branch_location;
            this.branch.phone = data.branch.branch_phone_number;
            this.members = data.members;
          })
          .catch(error => console.error('Error:', error));
      },
      AdminEditBranch() {
        const branchData = {
          name: this.branch.branchName,
          email: this.branch.email,
          location: this.branch.location,
          phone: this.branch.phone,
          description: this.branch.description,
          branchId: this.branch.branchId
        };
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
              alert('Branch updated successfully');
              console.log("Edit successfully");
              window.location.href = '/SystemAdminViewBranches.html';
          } else if (xhttp.readyState === 4 && xhttp.status === 401) {
              alert("Unsuccessful");
          }
        };
        xhttp.open('POST', '/admin/adminEditBranch', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(branchData));
      },
      RedirectToUsers(){
        const branchId = this.branch.branchId;
        window.location.href = `/MembersForBranch.html?branchId=${branchId}`;
      }
    }
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
    DirectToBranch(){
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', '/getSession', true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let session = JSON.parse(xhttp.response);
            window.location.href=`/AdminViewBranchInfo.html?branchId=${session.branchID}`;
          }
        };
      xhttp.send();
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
    },

  }
});