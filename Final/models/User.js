const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmpassword: { type: String },

  
});





UserSchema.pre('save',async function (next) {
    const User=this;
    if(!User.isModified('password')) return next();
    try {
        //Hash the password
        const salt=await bcrypt.genSalt(10);

        // hash password 
        const hashedPassword=await bcrypt.hash(User.password,salt);

        User.password=hashedPassword;
        next();
        
    } catch (error) {
        return next(error);
    }
    
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch=await bcrypt.compare(candidatePassword,this.password)
        return isMatch;
        
    } catch (error) {
        throw error;
    }
}


module.exports = mongoose.model('User', UserSchema);
