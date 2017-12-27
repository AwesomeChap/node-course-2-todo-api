const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');
var todos = [{
    _id : new ObjectID(),
    text : 'sun is rising'
},{
    _id : new ObjectID(),
    text : 'moon is disappearing',
    completed : true,
    completedAt : 333
}];

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var users = [{
    _id : userOneId,
    email : 'jatin15011999@gmail.com',
    password : '!@#$%^&',
    tokens : [{
        access : 'auth',
        token : jwt.sign({_id : userOneId, access: 'auth'}, 'abc123').toString()
    }]
},
{
    _id : userTwoId,
    email : 'Tumtum@gmail.com',
    password : '!@#7%^&',
}];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{done()});
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(()=>{done()});
};
module.exports = {todos, populateTodos, users, populateUsers};