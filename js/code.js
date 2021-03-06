var urlBase = 'https://contacts.rruiz.dev/LAMPAPI';

var extension = 'php';


function validEmail(email){
	var emailRegex = /^[^.][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]{1,64}@{1}[a-zA-Z0-9-.]{1,255}[^.]\.{1}[a-z]+/;
	var result = email.match(emailRegex);
	if(email != result){
		return false;
	}
	else{
		return true;
	}
}

function doRegister()
{
	var email = document.getElementById("registerEmail").value;
	var password = document.getElementById("registerPassword").value;
	var hash = md5(password);
	var firstName = document.getElementById("registerFirstName").value;
	var lastName = document.getElementById("registerLastName").value;
	var reenterPassword = document.getElementById("reenterPassword").value;

    
	if(!isNaN(firstName) || !isNaN(lastName) || firstName.length == 0 || lastName.length == 0){
		document.getElementById("errorName").innerHTML = "<b style='color:red'>Please enter a valid name!</b>";
		return;
	}
	else
	{
		//removes the error
		document.getElementById("errorName").innerHTML = "";
	}
	  
	if(!validEmail(email)){
		document.getElementById("errorEmail").innerHTML = "<b style='color:red'>Please enter a valid email!</b>";
		return;
	}
	else
	{
		document.getElementById("errorEmail").innerHTML = "";
	}

	if(password.length == 0){
		document.getElementById("errorPassword").innerHTML = "<b style='color:red'>Please enter a password!</b>";
		return;
	}
	else
	{
		document.getElementById("errorPassword").innerHTML = "";
	}

	if(password != reenterPassword || reenterPassword.length == 0){
		document.getElementById("errorReenterPassword").innerHTML = "<b style='color:red'>The passwords do not match!</b>";
        return;
	}
	else
	{
	  document.getElementById("errorReenterPassword").innerHTML = "";
	}

  	var jsonPayload = JSON.stringify({fname: firstName, lname: lastName, email: email, password: hash}); 
  	var url = urlBase + '/register.' + extension; 

  	var xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("registrationResult").innerHTML = "<b>New Account Successfully Created. Navigating back to log in</b>";		

				setTimeout(function(){window.location.href = "https://contacts.rruiz.dev/index.html";},3000)
			}
			else if(this.readyState == 4 && this.status == 409)
			{
				document.getElementById("registrationResult").innerHTML = "User already exists!";
			}
			else{
				document.getElementById("registrationResult").innerHTML = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registrationResult").innerHTML = err.message;
	}
}
