export default {
	SignUp_UsernameonTextChanged () {
		//	write code here
		if (SignUp_Username.text.length > 0){
			RegistrationUserIsValid.run();
		}
	}
}