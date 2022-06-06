const assert = require("assert");
const user = require("../model/users");
const InitiateMongoServer = require("../dbconfig");
InitiateMongoServer.InitiateMongoServer();

var newUser;

describe('user model testing',  () => {
    describe('Alex\'s test', ()=>{
        it('Creates a new user', (done)=>{
            newUser = new user({
                name: "Alex",
                username: "pleasework",
                password: "notpassword",
                email: "alexfisher0330@gmail.com",
                rank: "Admin"
            });

            //newUser.save(done());
            newUser.save((err, doc)=>{
                console.log(err);
                if(err){return done();}
                assert.fail("User should not save");
            });
        })
    })
    describe('testing with one user', ()=>{
        it('creates a new user', (done)=>{
            newUser = new user({
                name: "Testy McTestFace",
                username: "test",
                password: "password",
                email: "test@testing.com"
            });
    
            newUser.save(done());
        });
    
        it('should not create a user if name, username, password, or email are missing', (done)=>{
            newUser = new user({});
    
            newUser.save((err, doc)=>{
                if(err){return done();}
                assert.fail("User should not save");
            });
        });
    
        it('should not create a user if name is more than 50 characters', (done)=>{
            newUser = new user({
                name: "1234567890111213141516171819202122232425262712345678901112131415161718192021222324252627",
                username: "test",
                password: "password",
                email: "test@testing.com"
            });
    
            newUser.save((err, doc)=>{
                if(err){return done();}
                assert.fail("User should not save");
            });
        });
    });
    
    describe("testing with 2 users", ()=>{

        beforeEach(()=>{
            newUser = new user({
                name: "Testing",
                username: "test",
                password: "password",
                email: "test@testing.com"
            });
            newUser.save();
        });

        it('should not create user if username already exist', (done)=>{
            newUser2 = new user({
                name: "Testing2",
                username: "test",
                password: "password",
                email: "test@testing.com"
            });

            newUser.save((err,doc)=>{
                if(err){return done();}
                return assert.fail("Should not have inserted into db");
            });
        });
    });
});