function updatePassword(id){
    var password = document.getElementById('currentPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var message = document.getElementById('message');

    if(newPassword != confirmPassword){
        
        message.style.display = "block";
        message.innerHTML = "New passwords do not match";
    }else{
        $.ajax({
            url: `/update/password/${id}`,
            method: "PATCH",
            data: {
                password,
                newPassword,
                confirmPassword
            },
            success: (res)=>{
                if(res.success){
                    window.alert(`${res.message}. Please login with your new password.`);
                    window.location.replace("/auth/logout");
                }else{
                    message.style.display = "block";
                    message.innerHTML = res.message;
                }
            },
            error: (err)=>{
                message.style.display = "block";
                message.innerHTML = "Something went wrong.";
            }
        });
    }
}