function addUser(){
    var user = {
        name: document.getElementById("add-name").value,
        email: document.getElementById("add-email").value,
        password: document.getElementById("add-password").value,
        username: document.getElementById("add-username").value,
        phone: document.getElementById("add-phone").value,
        rank: document.getElementById("add-role").value
    };
    
    if(window.confirm(`Add user ${user.name}?`)){
        $.ajax({
            url: "/auth/create",
            method: "PUT",
            data: user,
            success: (response)=>{
                if(response.error){
                    console.log(response.error);
                    window.alert(response.error);
                }else if(response.message){
                    console.log(response.message);
                    window.alert(response.message);

                    document.getElementById("add-name").value = "";
                    document.getElementById("add-email").value = "";
                    document.getElementById("add-password").value = "";
                    document.getElementById("add-username").value = "";
                    document.getElementById("add-phone").value = "";
                    document.getElementById("add-role").value = "";
                    window.location.reload();
                }else{
                    window.alert("Session Expired. Login to continue.");
                    window.location.reload();
                }
            },
            error: (err)=>{
                console.log(err);
                window.alert(err.responseJSON.error || "Something went wrong creating user :(");
            }
        });
    }

}