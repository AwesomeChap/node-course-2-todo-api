const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var users = [{
    _id : userOneId,
    email : 'jatin15011999@gmail.com',
    password : '!@#$%^&',
    tokens : [{
        access : 'auth',
        token : jwt.sign({_id : userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},
{
    _id : userTwoId,
    email : 'Tumtum@gmail.com',
    password : '!@#7%^&',
    tokens : [{
        access : 'auth',
        token : jwt.sign({_id : userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

var todos = [{
    _id : new ObjectID(),
    text : 'First test Todo',
    _creater : userOneId
},{
    _id : new ObjectID(),
    text : 'Second test todo',
    completed : true,
    completedAt : 333,
    _creater : userTwoId
}];


const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(()=>done());
};
module.exports = {todos, populateTodos, users, populateUsers};