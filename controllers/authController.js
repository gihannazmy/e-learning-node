const bcrypt = require('bcrypt');
const User = require('../models/user');
const AppError = require('../utils/AppError.js');
const { signToken } = require('../utils/jwt')

const signup = async (req, res, next) =>{
    try{
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return next(new AppError('Insufficient info', 400))
        }
        const existingUser = await User.findOne({email});
        if (existingUser){
            return next (new AppError('Cannot use this email try a different one', 409));
        }



    const userCreated = await User.create({
      email,
      password,
      name,
      ...(req.body.role ? { role: req.body.role } : {})
    });
    const token = signToken(userCreated._id);

    userCreated.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userCreated},
    });

  } catch (err) {
    next(err);
  }
};


// for testing only
  const getAllusers = async (req, res, next) => {
    try{
      const users = await User.find()
      res.status(200).json({
        status: 'success',
        users
      })
    }
    
    catch (err) {
    next(err);
  }
    }
const login = async(req,res, next) => {
      try{
    const { email, password } = req.body;
    if (!email || !password) {
      return next (new AppError('Insufficient info', 400));
    }
    const user = await User.findOne({email}).select('+password');
      if (!user){
      return next (new AppError('incorrect email or password',401));
    }
    const isMatch = await user.correctPassword(password,user.password);

    if(!isMatch){

     return next (new AppError('incorrect email or password',401));
    }
    user.password = undefined;
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      },
    });

  }
     catch (err) {
    next(err);
  }

}


const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const { name, email, password, role } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Cannot use this email, try a different one', 409));
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'User deleted'
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  signup,
  getAllusers,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser
};

