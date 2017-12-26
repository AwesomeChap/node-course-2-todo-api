const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');//MD5 hashing is not immune to rainbow tables that's why we use SHA256 for hashing in most cases
const bcrypt = require('bcryptjs'); //bcryptjs has salting built in

var password = 'qwerty';
var hashedPassword;

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password , salt , (err, hash)=>{
        console.log(hash);
    });
});

hashedPassword = '$2a$10$z8sDCTuWD38.DG.PswdrN.q4Rvao5qLelxgSerzmx6x1mfBomqxSS';
bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
})


// var data = {
//     id : 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded = ',decoded);
// var message = 'Awesome';
// var hash = SHA256(message).toString();
//
// console.log(`${message} --- encrypted to ---> ${hash}`);
//
// var data = {
//     id : 4
// }
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'seceretText').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'seceretText').toString();
//
// if(resultHash === token.hash){
//     console.log('Data not changed');
// }
// else{
//     console.log('Data Changed. Do not trust');
// }