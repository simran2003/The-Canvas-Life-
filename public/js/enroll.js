//event listener for enroll button
window.addEventListener('load', () => { 

    document.getElementById("enroll").onclick = enroll;

});

function enroll(){
	//post request to enroll into artist workshop
	let req = new XMLHttpRequest()
	req.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			alert("you are enrolled");
		} 
	}
	
	req.open("POST", "/enroll");
	req.send();
}