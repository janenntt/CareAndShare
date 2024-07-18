document.addEventListener("DOMContentLoaded",function(){
    let query = new URLSearchParams(window.location.search);
    let branch_id = query.get("branch");

    // Load profile
    sendAJAX("GET", `/branches/${branch_id}`, null, function(err,res){
        if (err) return;
        res = JSON.parse(res);
    });

    var app = new Vue({
        el: "#app",
        data(){
            return {
                branch_id: res.branch_id,
                branch_name: res.branch_name,
                branch_description: res.branch_description,
                branch_phone_number: res.branch_phone_number,
                branch_location: res.branch_location,
                branch_email: res.branch_email,
                image_url: res.image_url,
            };
        },

    });
});