export default {
	// Function to validate the username and email
	validateUserAndEmail: () => {
		const validUsername = RegistrationUserIsValid.data;
		const validEmail = RegistrationEmailIsValid.data;

		// Check if the username is not unique
		if (!validUsername) {
			showAlert("User is not unique", "error");
		}

		// Check if the email is not unique
		if (!validEmail) {
			showAlert("Email is not unique", "error");
		}

		// If both are unique, return true to proceed further
		if (validUsername && validEmail) {
			return true;
		}
		return false;  // If either is not unique, return false
	},
};
