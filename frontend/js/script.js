document.getElementById("create_account").addEventListener("submit", async (event)=>{
    event.preventDefault(); //prevent the form from submitting
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("reenterPassword").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;

    if(password !== password2){
        alert("Passwords do not match");
        return;
    }

    try{
        const response = await fetch("/createAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password, email, age})
        });

        const data = await response.json();
        if(data.success){
            alert("Account created successfully");
            window.location.href = "/login";
        }else{
            alert(data.message);
        }
    }catch(err){
        console.log("Error: ",err);
    }
});