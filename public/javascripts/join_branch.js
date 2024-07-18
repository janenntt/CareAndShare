

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
    el: '.both',
    data() {
        return {
            branch_id:'',
            users:'',
            usersJoined:'',
            adminOrManagers:'',
            guestUsers:'',
            branchInfo: []
        };
    },
    mounted(){
      this.getBranchID(this.getBranchInfo);
      this.getJoinButton(this.branch_id);
    },
    methods:{
      getBranchID(callback){
        this.branch_id = new URLSearchParams(window.location.search).get('branchId');
        console.log(this.branch_id);
        if (typeof callback === 'function') {
          callback();
        } else {
          console.error('Callback is not a function');
        }
      },
      getBranchInfo(){
        const branchID = this.branch_id;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            let res = JSON.parse(xhttp.responseText);
            this.branchInfo = res[0];
            console.log(this.branchInfo);
          }
        };
        xhttp.open('POST', '/getBranchInfo', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({ branchID }));
      },

      getJoinButton(branch_id){
          fetch(`/getJoinButton/${branch_id}`)
              .then(response => response.json())
              .then(data => {
                  this.branch_id = branch_id;
                  const buttonType = data.button;
                  if(buttonType === "adminOrManagers"){
                      this.users = false;
                      this.usersJoined = false;
                      this.adminOrManagers = true;
                      this.guestUsers = false;
                  }else if(buttonType === "usersJoined"){
                      this.users = false;
                      this.usersJoined = true;
                      this.adminOrManagers = false;
                      this.guestUsers = false;
                  }else if(buttonType === "users"){
                      this.users = true;
                      this.usersJoined = false;
                      this.adminOrManagers = false;
                      this.guestUsers = false;
                  }else{
                      this.users = false;
                      this.usersJoined = false;
                      this.adminOrManagers = false;
                      this.guestUsers = true;
                  }
              })
              .catch(error => console.error('Error:', error));
      },
      JoinBranch(){
          const branchId = this.branch_id;
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = () => {
              if (xhttp.readyState === 4 ) {
                  this.getJoinButton(branchId);
              } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                  alert("Unsuccessful");
              }
            };
          xhttp.open('POST', '/JoinBranch', true);
          xhttp.setRequestHeader('Content-Type', 'application/json');
          xhttp.send(JSON.stringify({branchId}));
      },
      LeaveBranch(){
        const branchId = this.branch_id;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4) {
              if (xhttp.status === 200) {
                this.getJoinButton(branchId);
              } else if (xhttp.status !== 200) {
                  alert("Unsuccessful");
              }
          }
        };
        xhttp.open('POST', '/users/LeaveBranch', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({ branchId}));
      }
  }
});