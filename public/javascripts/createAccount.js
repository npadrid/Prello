$('#submit').click(function(e){
	var password = $(this).siblings('#password').val();
  var confirm_password = $(this).siblings('#confirm_password').val();
  if(password !== confirm_password) {
    e.preventDefault();
		alert(`Passwords do not match`);
  }
})
