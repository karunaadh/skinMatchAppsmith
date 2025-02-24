export default {
	defaultTab: 'Login',

	setDefaultTab: (newTab) => {
		this.defaultTab = newTab;
	},

	generatePasswordHash: async (password) => {
		return dcodeIO.bcrypt.hashSync(password, 10);
	},

	verifyHash: async (password, hash) => {
		return dcodeIO.bcrypt.compareSync(password, hash);
	},

	createToken: async (user) => {
		return jsonwebtoken.sign(user, appsmith.store.SECRET_KEY, { expiresIn: '1h' });
	},


	signIn: async () => {
		const password = Login_Password.text;

		const [user] = await findUserByEmail.run();

		if (user && this.verifyHash(password, user?.password_hash)) {
			storeValue('token', await this.createToken(user))
				.then(() => showAlert('Login Success', 'success'))
				.then(() => navigateTo('/Home Page'));
		} else {
			return showAlert('Invalid email/password combination', 'error');
		}
	},

	register: async () => {
		const passwordHash = await this.generatePasswordHash();
		const [user] = await createUser.run({passwordHash});
		if (user) {
			storeValue('token', await this.createToken(user))
			showAlert('Register Success', 'success')
				.then(() => navigateTo('/Home Page'));
		} else {
			return showAlert('Error creating new user', 'error');
		}
	},
};
