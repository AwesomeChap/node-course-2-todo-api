const expect = require('expect');
const request = require('supertest');

var {ObjectID} = require('mongodb');
var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [{
    _id : new ObjectID(),
    text : 'sun is rising'
},{
    _id : new ObjectID(),
    text : 'moon is disappearing',
    completed : true,
    completedAt : 333
}];
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{done()});
});

describe('POST /todos',()=>{
    it('should create a new Todo',(done)=>{
        var text = "WooooooooooooooW!";
        request(app)
            .post('/todos')
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
                    done();
                }).catch((e)=>done(e));
            });
    });
    it('should not create todo',(done)=>{
        request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe('GET /todos/:id',()=>{
   it ('Should return todo',(done)=>{
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .expect(200)
           .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
           }).end(done);
   });

   it('should return 404 if todo not found',(done)=>{
       request(app)
           .get(`/todos/${new ObjectID().toHexString()}`)
           .expect(404)
           .end(done);
   });

   it('should return 404 for non-object ids',(done)=>{
       request(app)
           .get('/todos/123acd')
           .expect(404)
           .end(done);
   });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
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

    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id does not exist',(done)=>{
        request(app)
            .delete('/todos/123abc')
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
          .send({
              text : utext,
              completed : true
          }).expect(200)
           .expect((res)=>{
            expect(res.body.todo.text).toBe(utext);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
           }).end(done);
   });

   it('should  clear completedAt when todo is not completed',(done)=>{
       var hexId = todos[1]._id.toHexString();
       var text = 'update text';
       request(app)
           .patch(`/todos/${hexId}`)
           . send({
               text,
               completed : false
           }).expect(200)
           .expect((res)=>{
           expect(res.body.todo.text).toBe(text);
           expect(res.body.todo.completed).toBe(false);
           expect(res.body.todo.completedAt).toNotExist();
           }).end(done);
   });
});