//event listener to change artist type button
window.addEventListener('load', () => { 

    document.getElementById("artist").onclick = switchArtistType;

});

function switchArtistType(){	
	//put request to change artist tpe
    fetch(`http://localhost:3000/user`, {
        method: 'PUT'        
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("can't switch artist type");
        } else {
			location.href=`http://localhost:3000/user`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}