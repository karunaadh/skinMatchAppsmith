export default {
	SignUp_EmailonTextChanged () {
		//	write code here
		if (SignUp_Email.text.length > 0){
			RegistrationEmailIsValid.run();
		}
	}
}