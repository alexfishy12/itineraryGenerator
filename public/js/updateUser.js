function showModel(name, username, email, phone, id, role){
    
    // Unescapes characters and sets null values to empty strings.
    name = ifNull(name);
    username = ifNull(username);
    email = ifNull(email);
    phone = ifNull(phone);
    id = ifNull(id);
    role = ifNull(role);
    
    // Grabs model elements from front end
    var nameElement = document.getElementById("modelName");
    var usernameElement = document.getElementById("modelUsername");
    var emailElement = document.getElementById("modelEmail");
    var phoneElement = document.getElementById("modelPhone");
    var idElement = document.getElementById("modelID");
    var roleElement = document.getElementById("modelRole");
    var passwordElement = document.getElementById("modelPassword");

    // Sets input box values to users information
    document.getElementById('labelName').innerHTML = name;
    nameElement.value = name;
    usernameElement.value = username;
    emailElement.value = email;
    phoneElement.value = phone;
    idElement.value = id;
    roleElement.value = role;
    passwordElement.value = "";

}

function ifNull(string){
    if(string === "null"){
        return "";
    }else{
        return unescape(string);
    }
}

function saveChanges(){

    var id = document.getElementById("modelID").value;
    var name = document.getElementById("modelName").value;
    var username = document.getElementById("modelUsername").value;
    var email = document.getElementById("modelEmail").value;
    var phone = document.getElementById("modelPhone").value;
    var role = document.getElementById("modelRole").value;

    console.log("id and name: "+id+name);
   $.ajax({
       url: `/update/user/${id}`,
       method: "PATCH",
       data: {
           name,
           username,
           email,
           phone,
           role
       },
       success: (res)=>{
           if(res.success){
                    window.alert(`${res.message}`);
                    window.location.replace("/admin");
                }else{
                    window.alert(`${res.message}`);
                    window.location.replace("/admin");
                }
       },
       error: (err)=>{
           console.log(err);
           window.alert("Could not update user :(");
       }
   });
}

function deleteUser(){

    // Grabs model elements from front end
    var name = document.getElementById("modelName").value;
    var id = document.getElementById("modelID").value;

    if(window.confirm(`Delete user ${name}`)){
        $.ajax({
            url: `/update/${id}`,
            method: "DELETE",
            data: {
                name,
                id
            },
            success: (res)=>{
                if(res.success){
                         window.alert(`${res.message}`);
                         window.location.replace("/admin");
                     }else{
                         window.alert(`${res.message}`);
                         window.location.replace("/admin");
                     }
            },
            error: (err)=>{
                console.log(err);
                window.alert("Could not delete user :(");
            }
        });
    }
}

function resetPassword(){
    var id = document.getElementById("modelID").value;
    var password = document.getElementById("modelPassword").value;

    console.log(password);
   $.ajax({
       url: `/update/admin/password/${id}`,
       method: "PATCH",
       data: {
        password
       },
       success: (res)=>{
           if(res.success){
                    window.alert(`${res.message}`);
                    window.location.reload();
                }else{
                    window.alert(`${res.message}`);
                    window.location.reload();
                }
       },
       error: (err)=>{
           console.log(err);
           window.alert("Could not update password :(");
       }
   });

}