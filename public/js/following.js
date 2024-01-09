function following(artist){	
    //create object with artist name
    let remove = {"artist": artist};

    //put request to add or remove artist from following
	fetch(`http://localhost:3000/following`, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(remove)      
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("can't follow/unfollow artist");
        } else {
			location.href=`http://localhost:3000/artist/${artist}`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}