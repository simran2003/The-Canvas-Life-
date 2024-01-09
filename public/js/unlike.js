function unlike(name){	
    //create object with artwork name
    let remove = {"name": name};
   
    //put request to remove artwork from likes
	fetch(`http://localhost:3000/unlike`, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(remove)      
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("can't unlike post");
        } else {
			location.href=`http://localhost:3000/reviews`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}