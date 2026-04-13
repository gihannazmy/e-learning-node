const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false,
    minlength: 6
  },
    
    timestamps: true,
  
},
  {
    timestamps: true,
  });

userSchema.pre('save', async function () {
    if (!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);

    
});
userSchema.methods.correctPassword = async function () {
return await bcrypt.compare(candidatePassword, userPassword)    
};

const User = mongoose.model('User', userSchema1);

module.exports = User;