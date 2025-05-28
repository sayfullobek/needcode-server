const CryptoJS = require('crypto-js')
const { Users } = require('../models')

exports.createCEO = async () => {
	const name = process.env.CEO_NAME
	const surname = process.env.CEO_SURNAME
	const email = process.env.CEO_EMAIL
	const password = process.env.CEO_PASSWORD
	try {
		const ceo = await Users.findOne({ email })
		if (ceo != null) {
			return true
		}
		const newCeo = new Users({
			firstName: name,
			lastName: surname,
			role: 'CEO',
			email: email,
			password: CryptoJS.AES.encrypt(
				password,
				process.env.PASSWORD_SECRET_KEY
			).toString(),
		})
		await newCeo.save()
		console.log('CEO yaratildi')
	} catch (err) {
		console.log(err)
		return false
	}
}
