const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const User = require('../models/user.model');

exports.signup = async (req, res) => {

    try {
        const {name, email,password ,role} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) { 
            return res.status(400).json({message: "User already exists"});
        }
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if(err){
                return res.status(500).json({message:"Error in hashing password", error: err});
            }
            const User = require('../models/user.model');
            const newUser = await User({
                name,
                email,
                password: hash,
                role
            });
            await newUser.save();
            res.status(201).json({message: "User created successfully", user: newUser});
});

    } catch (error) {
        res.status(500).json({message: "Error in creating user", error: error.message});
    }

}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error in logging in", error: error.message });
  }
};