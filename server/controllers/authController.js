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
        res.status(200).send(req.session)
    },
    login: async (req, res) => {
        const {email, password} = req.body
        const db = req.app.get('db')

        const existingUser = await db.get_user_by_email(email)

        if(!existingUser[0]) {
            return res.status(404).send('User does not exist')
        }

        //If they do exist, we need to authenticate them
        const authenticated = bcrypt.compareSync(password, existingUser[0].hash)

        if(!authenticated) {
            return res.status(403).send('Incorrect password')
        }

        delete existingUser[0].hash

        req.session.user = existingUser[0]

        res.status(200).send(req.session) //ypu can use req.session.user but since we have in middleware we don't need too
    },
    logout: (req, res) => {
        req.session.destroy()

        res.sendStatus(200)
    }

}