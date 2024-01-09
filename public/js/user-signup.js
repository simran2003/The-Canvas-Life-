//event listener for signup button
window.addEventListener('load', () => { 

    document.getElementById("signup").onclick = saveUser;

});

function saveUser(){
	let name = document.getElementById("name").value;
	let pass = document.getElementById("pass").value;
	let newUser = { username: name, password: pass, artistType: false};

    document.getElementById("error").innerHTML = "";
	
    //post request to add user into the database
	fetch(`http://localhost:3000/signup`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			document.getElementById("name").value = '';
			document.getElementById("pass").value = '';
			document.getElementById("error").innerHTML = "That username is taken. Please use a different username.";
        } else {
			location.href=`http://localhost:3000/home`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}