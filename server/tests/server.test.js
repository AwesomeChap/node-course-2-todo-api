const expect = require('expect');
const request = require('supertest');

var {ObjectID} = require('mongodb');
var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/users');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos',()=>{
    it('should create a new Todo',(done)=>{
        var text = "WooooooooooooooW!";
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res)=>{
               expect(res.body.text).toBe(text);
            }).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    return done();
                }).catch((e)=>done(e));
            });
    });
    it('should not create todo',(done)=>{
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>done(e));
            });
    });
});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(1);
            }).end(done);
    });
});

describe('GET /todos/:id',()=>{
   it ('Should return todo',(done)=>{
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .set('x-auth',users[0].tokens[0].token)
           .expect(200)
           .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
           }).end(done);
   });

   it ('Should not return todo created by other user',(done)=>{
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

   it('should return 404 if todo not found',(done)=>{
       request(app)
           .get(`/todos/${new ObjectID().toHexString()}`)
           .set('x-auth',users[0].tokens[0].token)
           .expect(404)
           .end(done);
   });

   it('should return 404 for non-object ids',(done)=>{
       request(app)
           .get('/todos/123acd')
           .expect(401)
           .end(done);
   });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            }).end((err, res)=>{
                if(err) {
                   return done(err);
                }
                Todo.findById(hexId).then((res)=>{
                    expect(res).toNotExist();
                    done();
                },(err)=>{
                    done(err);
                }).catch((e)=>done());
            });
    });

    it('should not remove a todo of other creator',(done)=>{
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toExist();
                    done(err);
                }).catch((e)=>done(e));
            });
    });

    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id does not exist',(done)=>{
        request(app)
            .delete('/todos/123abc')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
   it('should update the todo',(done)=>{
       var hexId = todos[0]._id.toHexString();
       var utext = "Testing Update";
       request(app)
          .patch(`/todos/${hexId}`)
          .set('x-auth',users[0].tokens[0].token)
          .send({
              text : utext,
              completed : true
          })
          .expect(200)
          .expect((res)=>{
              expect(res.body.todo.text).toBe(utext);
              expect(res.body.todo.completed).toBe(true);
              expect(res.body.todo.completedAt).toBeA('number');
           }).end(done);
   });

   /*it('should not update todo by other creator',(done)=>{
       var hexId = todos[0]._id.toHexString();
       var text = 'updates';

       request(app)
           .patch(`/todos/${hexId}`)
           .set('x-auth',users[1].tokens[0].token)
           .send({
               text,
               completed : true
           })
           .expect(404)
           .end(done);
   });*/

   it('should  clear completedAt when todo is not completed',(done)=>{
       var hexId = todos[1]._id.toHexString();
       var text = 'update text';
       request(app)
           .patch(`/todos/${hexId}`)
           .set('x-auth', users[1].tokens[0].token)
           . send({
               completed : false,
               text
           })
           .expect(200)
           .expect((res)=>{
               expect(res.body.todo.text).toBe(text);
               expect(res.body.todo.completed).toBe(false);
               expect(res.body.todo.completedAt).toNotExist();
           }).end(done);
   });
});

describe('GET /Usres/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it('should return 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth','')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);

    });
});

describe('POST /users',()=>{
   it('should create a user',(done)=>{
       var email = 'ohyeah@coolchap.com';
       var password ='!@#$%^&*';
       request(app)
            .post('/users')
            .send({email,password})
           .expect(200)
           .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toExist();
           }).end((err)=>{
           if(err){
               return done(err);
           }

           User.findOne({email}).then((user)=>{
               //expect(user.email).toBe(email);
               expect(user).toExist();
               expect(user.password).toNotEqual(password);
               done();
           }).catch((e)=>{done(e)});
       });
   });

    it('should return validation errors if request invlid',(done)=>{
        var email = "!8#$$";
        var password ='';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .expect((res)=>{
                expect(res.header['x-auth']).toNotExist();//not needed
            }).end(done);
    });

    it('should not create user if email in use',(done)=>{
        var email = 'Tumtum@gmail.com';
        var password = 'same-hai';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                //expect(res.body).toNotExist();
            }).end(done);

    });
});

describe('POST /users/login',()=>{
    it('should return x-auth token and login user',(done)=>{
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            }).end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>{done(e)});
                });
        });

    it('should reject login',(done)=>{
        var email = users[1].email;
        var password = users[1].password + '1';

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
            }).end((err, res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e)=>done(e));
            });
    });
});


describe('DELETE /users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
           .delete('/users/me/token')
           .set('x-auth',users[0].tokens[0].token)
           .expect(200)
           .end((err, res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user)=>{
                  expect(user.tokens.length).toBe(0);
                  done();
               }).catch((e)=>done(e));
           });
    });
});