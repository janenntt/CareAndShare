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
  el: '.profile',
  data() {
    return {
        user:{
          userID: '',
          userFirstName: '',
          userGivenName: '',
          userLocation: '',
          userPhone: '',
          userEmail:''
        },
        branches:[],
    };
  },
  mounted(){
    const userID = this.getURLParameter('UserId');
    this.user.userID = userID;
    this.fetchUser(userID);
  },
  methods:{
    getURLParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },
    fetchUser(userID){
      fetch(`/admin/getUserInfo?userId=${userID}`)
      .then(response => response.json())
      .then(data=> {
        this.user.userFirstName = data.user.first_name;
        this.user.userGivenName = data.user.last_name;
        this.user.userLocation = data.user.location;
        this.user.userPhone = data.user.phone_number;
        this.user.userEmail = data.user.email_address;
        this.branches = data.branches;
      })
      .catch(error => console.error('Error:', error));
    },
    RemoveBranch(branchName, userId){
      const branch = branchName;
      const user = userId;
      const deleteData = {
          branch: branch,
          user: user
      };
       var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = () => {
           if (xhttp.status === 200 && xhttp.readyState === 4) {
              this.branches = this.branches.filter(branch => branch.name !== branchName);
           } else if (xhttp.readyState === 4 && xhttp.status === 401) {
               alert("Unsuccessful");
           }
       };
       xhttp.open('POST', '/admin/adminRemoveBranch', true);
       xhttp.setRequestHeader('Content-Type', 'application/json');
       xhttp.send(JSON.stringify(deleteData));
    },
    AdminEditUser(){
      const firstNameInput = this.user.userFirstName;
      const givenNameInput = this.user.userGivenName;
      const locationInput = this.user.userLocation;
      const phoneInput = this.user.userPhone;
      const emailInput = this.user.userEmail;
      const userId = this.user.userID;
      const userData = {
          emailAddress : emailInput,
          firstName: firstNameInput,
          givenName: givenNameInput,
          location: locationInput,
          phoneNumber: phoneInput,
          userId: userId
      };
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
          if (xhttp.status === 200 && xhttp.readyState === 4) {
              alert('Edited this user succesful');
              window.location.href = '/UserSystemAdmin.html';
          } else if (xhttp.readyState === 4 && xhttp.status === 401) {
              alert("Unsuccessful");
          }
      };
      xhttp.open('POST', '/admin/adminEditUser', true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify(userData));
    }
}
});

// function getURLParameter(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }

// const userId = getURLParameter('userId');
// document.querySelector('input[name = "userId"]').value = userId;
// document.addEventListener('DOMContentLoaded', (event) => {
//     fetch(`/admin/getUserInfo?userId=${userId}`)
//     .then(response => response.json())
//     .then(data=> {
//         document.getElementById("first-name").value = data.user.first_name;
//         document.getElementById('email').value = data.user.email_address;
//         document.getElementById('given-name').value = data.user.last_name;
//         document.getElementById('location').value = data.user.location;
//         document.getElementById('phone').value = data.user.phone_number;
//         const branchList = data.branches.map(branch => `<a href="#">${branch}
//                                                             <button class = "close-icons" onclick = "RemoveBranch('${branch}','${userId}'); event.preventDefault();">
//                                                             x
//                                                             </button>
//                                                         </a>`).join('');
//         const dropdownContent = document.querySelector('.dropdown-content');
//         dropdownContent.innerHTML = branchList;
//     });
// });

// function RemoveBranch(branchName, userId){
//    const branch = branchName;
//    const user = userId;
//    const deleteData = {
//         branch: branch,
//         user: user
//    }
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.status === 200 && this.readyState === 4) {
//             window.location.href = `/AdminViewMemberInfo.html?userId=${user}`;
//         } else if (xhttp.readyState === 4 && xhttp.status === 401) {
//             alert("Unsuccessful");
//         }
//     };
//     xhttp.open('POST', '/admin/adminRemoveBranch', true);
//     xhttp.setRequestHeader('Content-Type', 'application/json');
//     xhttp.send(JSON.stringify(deleteData));
// }

// function AdminEditUser(){
//     const firstNameInput = document.querySelector('input[name = "firstName"]').value;
//     const givenNameInput = document.querySelector('input[name = "givenName"]').value;
//     const locationInput = document.querySelector('input[name = "location"]').value;
//     const phoneInput = document.querySelector('input[name = "phone"]').value;
//     const emailInput = document.querySelector('input[name = "email"]').value;
//     const userId = document.querySelector('input[name = "userId"]').value;
//     const userData = {
//         emailAddress : emailInput,
//         firstName: firstNameInput,
//         givenName: givenNameInput,
//         location: locationInput,
//         phoneNumber: phoneInput,
//         userId: userId
//     }
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (xhttp.status === 200 && xhttp.readyState === 4) {
//             alert('Edited this user succesful');
//             window.location.href = '/UserSystemAdmin.html';
//         } else if (xhttp.readyState === 4 && xhttp.status === 401) {
//             alert("Unsuccessful");
//         }
//     };
//     xhttp.open('POST', '/admin/adminEditUser', true);
//     xhttp.setRequestHeader('Content-Type', 'application/json');
//     xhttp.send(JSON.stringify(userData));
// }