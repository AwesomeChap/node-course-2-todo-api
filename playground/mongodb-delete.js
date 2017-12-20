var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log(err);
    }
    db.collection('Users').findOneAndDelete({
        _id : new  ObjectID("5a3a662aadd17e2ac82b5cc7")
    }).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    });
    db.collection('Users').deleteMany({name : 'Jatin'}).then((res)=>{
        console.log(res);
    },(err)=>{
        console.log(err);
    });
});