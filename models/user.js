const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../utils/config');


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
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  passwordChangedAt: Date,
  },
    
 {timestamps: true,
  

 
  });

userSchema.pre('save', async function () {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return;

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, config.security.bcryptRounds);

    // Update changedPasswordAt property for the user
    // Only update if it's not a new document
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }

    
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;