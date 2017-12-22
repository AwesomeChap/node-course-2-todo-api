const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/users');
const {Todo} = require('./../server/models/todo')
var id = "5a3b85e0939f1029b464fc23";

// Todo.find({
//     _id : id
// }).then((todos)=>{
//     console.log(todos);
// },(err)=>{
//     console.log(err);
// });
//
// Todo.findOne({
//     _id : id
// }).then((todo)=>{
//     console.log(todo);
// },(err)=>{
//     console.log(err);
// });
//
// Todo.findById(id).then((todos)=>{
//     console.log(todos);
// },(err)=>{
//     console.log(err);
// });
Users.findById(id).then((res)=>{
    if(!res)
       return console.log('ID does not exist')
    console.log(res);
},(err)=>{
    console.log('User id Invalid');
}).catch((e)=>{
   console.log(e);
});