export default {
	Log_InonClick () {
		//	write code 
		storeValue('loggedUser', Login_Username.text);
		Login_Username.setValue('');
		Login_Password.setValue('');
	}
}