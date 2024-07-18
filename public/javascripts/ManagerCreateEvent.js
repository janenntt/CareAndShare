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
            window.location.href=`/ManagerViewBranchInfo.html?branchId=${session.branchID}`
          }
        }
      xhttp.send();
    },
    logout(){
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', '/logout', true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          window.location.href="/index.html";
          }
        }
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


// The Vue object for creating new events

new Vue({
  el: '.app',
  data() {
    return {
      eventName: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      eventDescription: '',
      isPrivate: false,
      branchID: '',
      branchName: '',
      picture: null,
      form: {
        branchEmail: []
      }
    };
  },
  mounted() {
    this.getBranchID(this.getAllEmailOfABranch);
  },
  methods: {
    getBranchID(callback) {
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', '/getSession', true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          let session = JSON.parse(xhttp.response);
          if (session.userRole === "manager") {
            this.branchID = session.branchID;
            callback();
          }
        }
      };
      xhttp.send();
    },
    getAllEmailOfABranch() {
      let branchID = this.branchID;
      var xhttp = new XMLHttpRequest();
      xhttp.open('POST', '/getAllEmailOfUsersOfBranch', true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          console.log(xhttp.response);
          let res = JSON.parse(xhttp.response);
          this.form.branchEmail = res;
        }
      }
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({ branchID }));
    },
    sendMailToUser(mailArgument) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.status === 200 && xhttp.readyState === 4) {
          alert("Sent mail successfully");
        } else if (xhttp.readyState === 4 && xhttp.status === 401) {
          alert("Sent mail unsuccessfully");
        }
      };
      xhttp.open('POST', '/sendEmail', true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      console.log("Will send to server with this" + JSON.stringify(mailArgument))
      xhttp.send(JSON.stringify(mailArgument));
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.picture = URL.createObjectURL(file); // Preview image
        this.form.picture = file; // Store file object
      } else {
        this.picture = null;
      }
    },
    async submitForm() {
      const formData = new FormData();
      formData.append('picture', this.form.picture);
      formData.append('eventName', this.eventName);
      formData.append('eventDate', this.eventDate);
      formData.append('eventTime', this.eventTime);
      formData.append('eventLocation', this.eventLocation);
      formData.append('eventDescription', this.eventDescription);
      formData.append('isPrivate', this.isPrivate);
      formData.append('branchID', this.branchID);

      try {
        const response = await fetch('/createEvent', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert("Create event successfully");
          const emailAddresses = this.form.branchEmail.map(item => item.email_address).join(',').split(',');
          const mailArgument = {
            heading: this.eventName,
            description: this.eventDescription,
            branchEmail: emailAddresses
          };
          console.log("Sending mail with:", mailArgument);
          this.sendMailToUser(mailArgument);
          window.location.href = "/EventList.html";
        } else {
          alert("Create event unsuccessfully");
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form.');
      }
    }
  }
});