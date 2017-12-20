// const MongoClient = require('mongodb').MongoClient;
//
// MongoClient.connect('mongodb://localhost:27017/TodoApp',function(err,db) {
//     if (err) {
//         return console.log(`Error found : ${err}`);
//     }
//     db.collection('Todos').insertOne({
//         text : 'Walk the frog',
//         completed : false
//     },(err,res)=>{
//         if(err){
//             return console.log(`Error found : ${err}`);
//         }
//         console.log(JSON.stringify(res.ops,undefined,2));
//     });
//     // db.collection('Users').insertOne({
//     //     name : 'jatin',
//     //     age : 18,
//     //     location : 'new delhi-110059'
//     // }, (err,res)=>{
//     //     if(err){
//     //         return console.log(`Error found : ${err}`);
//     //     }
//     //     console.log(JSON.stringify(res.ops,undefined,2));
//     // });
//     db.close();
// });

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log(err);
    }
    db.collection('Users').insertOne({
        name : 'Andrew',
        age : '25',
        location : 'PA'
    },(err,res)=>{
        if(err){
            return console.log(err);
        }
        console.log(JSON.stringify(res.ops,undefined,2));
    });
    //db.close();
});