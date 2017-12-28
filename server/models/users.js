const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique :true,
        validate : {
            validator : validator.isEmail,
            message : 'Email = {VALUE} is Invalid!'
        }
    },
    password :{
        type : String,
        required : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){//it generate token and add it to user object as a property then returns token
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(),access},'abc123').toString();

    user.tokens = user.tokens.concat([{access,token}]);
    //instead of user.tokens.push({access,token}); it uses $pushAll and above one uses $set
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {//sends data back after searching from DB
    var User = this;
    var decoded ;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch (e){
        return Promise.reject();
        // return new Promise((resolve, reject)=>{
        //     reject();
        // })
    }

    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email , password){
    var User = this;

    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject)=>{
           bcrypt.compare(password, user.password , (err,res)=>{
               if(res){
                   resolve(user);
               }
               else {
                   reject();
               }
           });
        });
        // bcrypt.compare(password,user.password,(err,res)=>{
        //     if(err){
        //         return Promise.reject();
        //     }
        //     return Promise.resolve(user);
        // });
    });
};

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,function(err, salt){
           bcrypt.hash(user.password,salt,(err,hash)=>{
             user.password = hash;
             next();
           });
        });
    }else{
        next();
    }
});

UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull : {
            tokens : {
                token : token
            }
        }
    });
};

var User = mongoose.model('User',UserSchema);

module.exports = {
  User
};