document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const age = document.getElementById('age').value;
    const message = document.getElementById('message');

    if (password !== password2) {
        message.innerText = 'Passwords do not match!';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/addUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, password2, age })
        });

        const data = await response.json();
        message.innerText = data.message || data.error;

        if (response.ok) {
            document.getElementById('registerForm').reset();
        }
    } catch (error) {
        message.innerText = 'An error occurred. Please try again.';
    }
});

//login page
document.getElementById('login-form').addEventListener('submit', async function (event){
    event.preventDefault(); //prevent default form submission

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try{
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        const data = await response.json();

        if(response.ok){
            alert('Login successful');
            window.location.href = 'home.html'; //redirect to the home page
        }else{
            alert(data.error);
        }
    }catch(err){
        console.error('Error: ', err);
        alert('an error occurred');

    }
});