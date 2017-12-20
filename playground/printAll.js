var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log(err);
    }
    db.collection('Users').find().toArray().then((res)=>{
        console.log(JSON.stringify(res,undefined,2));
    },(err)=>{
        console.log(err);
    });
});