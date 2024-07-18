new Vue ({
    el: '#app',
    data: {
        branch: {
            branch_name: '',
            branch_location: '',
            branch_email: '',
            branch_contact: '',
            branch_description: ''
        }
    },

    mounted(){
        this.fetchBranchData();
    },
    methods: {
        fetchBranchData(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    var res = JSON.parse(xhttp.responseText);
                    this.branch.branch_name = res.branch_name;
                    this.branch.branch_location = res.branch_location;
                    this.branch.branch_email = res.branch_email;
                    this.branch.branch_contact = res.branch_phone_number;
                    this.branch_description = res.branch_description;
                }
            };
            xhttp.open('GET', '/get_branch_data', true);
            xhttp.send();
        },

        saveEdit() {
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/edit_branch', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    window.location.href = '../ManagerViewBranchInfo.html';
                } else if (xhttp.readyState == 4) {
                    alert('Failed to save changes');
                }
            };
            xhttp.send(JSON.stringify(this.branch));
        },

        toMyBranch(){
            window.location.href = '/ManagerViewBranchInfo.html';
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



function hideDropDown() {
console.log("This is passed");
var x = document.querySelector('.dropdown-menu');
    if (x.style.display === 'none') {
        x.style.display = 'flex';
    } else {
        x.style.display = 'none';
    }
}
