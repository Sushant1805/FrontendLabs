const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});


// JSON WEB TOKEN
userSchema.methods.generateToken = async function(){
    try {
      return JWT.sign({
        id: this._id,
        name : this.name,
        email : this.email,
        isAdmin : this.isAdmin
      },
      process.env.JWT_SECRET_KEY,{
        expiresIn:'1d'
      }
    )
    } catch (error) {
        console.error(error)
    }
}



module.exports = mongoose.model('User', userSchema);

