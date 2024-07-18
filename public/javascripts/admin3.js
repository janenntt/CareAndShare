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
    el: '.belowTable',
    data() {
        return {
            branchInfo: []
        };
    },
    mounted(){
      this.getBranchInfo();
    },
    methods: {
        directEditBranchPage(a){
            window.location.href=`/AdminViewBranchInfo.html?branchId=${a}`;
        },
        DeleteBranch(a){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 ) {
                    if (xhttp.status === 200) {
                        console.log("This has reached");
                        this.branchInfo = this.branchInfo.filter(branch => branch.branch_id !== a);
                        console.log(this.branchInfo);
                    }
                    // this.getBranchInfo();
                } else if (xhttp.readyState === 4 && xhttp.status === 401) {
                    alert("Unsuccessful");
                }
            };
            xhttp.open('POST', '/admin/adminDeleteBranch', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify({branchId:a}));
        },
        getBranchInfo(){
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/admin/getAllbranches', true);
            xhttp.onreadystatechange = () => {
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                    let res = JSON.parse(xhttp.response);
                    this.branchInfo = res;
                }
              };
            xhttp.send();
        }
    },
});



new Vue({
  el: '.Branches',
  methods: {
      AddNewBranch(){
        window.location.href=`/adminCreateNewBranch.html`;
      }
  },
});





