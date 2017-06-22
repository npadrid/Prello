var password = document.querySelector('#password');
var password_confirm = document.querySelector('#confirm_password');
var create_form = document.querySelector('.createContainer')

create_form.addEventListener('submit', function(e) {
	if(password.value !== confirm_password.value) {
    e.preventDefault();
		alert(`Passwords do not match`);
	}
});
