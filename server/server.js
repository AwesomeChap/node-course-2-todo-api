// console.time('handler name');

var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose}  = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
//var {Users} = require('./models/users');

//console.log(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/TodoApp');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{

    //console.log(req.body);

    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((result)=>{
        res.send(result);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
       res.status(400).send(err);
    });
});


app.get('/todos/:id',(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send(' ');
        }
        res.status(200).send({todo});
    }).catch((e)=>{
        res.status(400).send('Bad Request');
    })
});

app.delete('/todos/:id',(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(todo) {
            return res.send(todo);
        }
        res.status(404).send('Todo not found');
    }).catch((e)=>{
        res.status(404).send('Bad Request');
    });
});

app.listen(port,()=>{
    console.log('On Port :',port);
})
//console.timeEnd('handler name');
module.exports = {app};