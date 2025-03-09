export default {
	NewUsernameonTextChanged () {
		//	write code here
		if (NewUsername.text.length > 0){
			UsernameIsValid.run();
		}
	}
}