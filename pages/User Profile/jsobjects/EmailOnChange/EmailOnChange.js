export default {
	UpdateEmailonTextChanged () {
		//	write code here
		if (UpdateEmail.text.length > 0){
			EmailIsValid.run();
		}
	}
}