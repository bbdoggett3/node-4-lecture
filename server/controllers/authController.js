const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const {email, password} = req.body

        const db = req.app.get('db')

        // db.get_user_by_email(email).then(use => {

        // })
        //Check if user already exists
        const existingUser = await db.get_user_by_email(email)

        if(existingUser[0]) {
            return res.status(409).send('User already exists')
        }

        //If they do not exist
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        //create new user
        const newUser = await db.create_user([email, hash])

        //Send back on session
        req.session.user = newUser[0]
        //Send new user
        res.status(200).send(req.session.user)
    },
    login: (req, res) => {},
    logout: (req, res) => {}

}