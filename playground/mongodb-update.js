const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log(err);
    }
    db.collection('Users').findOneAndUpdate({
    _id : new ObjectID("5a3a663dc3c42b20d8cd5709")
    },{
        $set : {
            name : 'Jatin',
            location : 'New delhi'
        },
        $inc :{
            age : 1
        }
    },{
        returnOriginal : false
    }).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    },(err)=>{
        console.log(JSON.stringify(err,undefined,2));
    });
});