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


  new Vue({
    el: '.app1',
    data() {
        return {
            user: {
                email: '',
                password: ''
            }
        };
    },
    methods: {
        login() {
            let logindata = {
                email: this.user.email,
                password: this.user.password
            };
            let req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(req.readyState == 4 && req.status == 200){
                    alert('Logged In for this user successfully');
                    window.location.href = "/index.html";
                } else if(req.readyState == 4 && req.status == 401){
                    alert('Login FAILED');
                }
            };
            req.open('POST','/login');
            req.setRequestHeader('Content-Type','application/json');
            req.send(JSON.stringify(logindata));
        },
        directToSignup() {
            window.location.href = "../signup_login/middle.html";
        }
    }
});

function do_google_login(response){
    console.log(response);
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        // Handle response from our server
        if(req.readyState == 4 && req.status == 200){
            alert('Logged In with Google successfully');
            window.location.href = "/index.html";
        } else if(req.readyState == 4 && req.status == 401){
           alert('Login FAILED');
        }
    };
    // Open requst
    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    // Send the login token
    req.send(JSON.stringify(response));
}

