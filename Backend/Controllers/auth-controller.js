const { json } = require("express");
const User = require('../Models/user-model')



const home = async (req, res) => {
    try {
        res.status(200).send("From Controller");
    } catch (err) {
        console.log(err);
    }
}

const register = async (req, resp) => {
    try {
        // console.log(req.body);
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return resp.status(400).json({ msg: "Email already exist" });
        }

        // creating user
        const newUser = await User.create({ name, email, password })

        //getting response
        resp.status(201).json({
            msg: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password
            },
        })
    } catch (err) {
        console.log(err);
    }

}
module.exports = { home, register };