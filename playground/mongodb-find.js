// const {MongoClient, ObjectID} = require('mongodb');
//
// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
//     if(err){
//         return console.log(err);
//     }
//     db.collection('Todos').find({completed : true}).count().then((data)=>{
//         console.log(JSON.stringify(data,undefined,2));
//     },(err)=>{
//         console.log(err);
//     });
//     db.collection('Todos').find({completed : true}).toArray().then((data)=>{
//         console.log(JSON.stringify(data,undefined,2));
//     },(err)=>{
//         console.log(err);
//     });
// });
 var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log(err);
    }

    db.collection('Users').find({name : 'Jatin'}).count().then((count)=>{
        console.log(`Result : ${count}`);
    },(err)=>{
        console.log(err);
    });

    db.collection('Users').find({name : 'Jatin'}).toArray().then((res)=>{
       console.log(JSON.stringify(res,undefined,2));
    },(err)=>{
        console.log(err);
    });
});