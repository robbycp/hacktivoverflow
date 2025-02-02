const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../app')
const { deleteUserTesting } = require('../helpers/delete-data')

chai.use(chaiHttp)

const expect = chai.expect;

after(function(){
  deleteUserTesting()
})

let sendUser = {
  full_name: 'testing',
  email: 'testing@mail.com',
  password: 'testing',
  username: 'testing',
  admin: false
}

describe('Customer Authentication', function() {
  describe('Create new user POST /register', function() {
    it('should have property id, full_name, email, username, No password. And 201 status', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .send(sendUser)
        .then((res) => {
          expect(res).to.have.status(201)
          expect(res.body).to.have.property('_id')
          expect(res.body).to.have.property('full_name')
          expect(res.body).to.have.property('email')
          expect(res.body).to.not.have.property('password')
          expect(res.body).to.have.property('username')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('should return message email already used if register with the same email', function(done) {
      let newUser = Object.assign({}, sendUser)
      newUser.username = 'different'
      chai
        .request(app)
        .post('/users/register')
        .send(newUser)
        .then((res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message', 'Email is already exist in database')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('should return message username already used if register with the same username', function(done) {
      let newUser = Object.assign({}, sendUser)
      newUser.email = 'different@mail.com'
      chai
        .request(app)
        .post('/users/register')
        .send(newUser)
        .then((res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message', 'Username is already exist in database')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('should return message not email if register with not email format', function(done) {
      let newUser = Object.assign({}, sendUser)
      newUser.email = 'testing'
      chai
        .request(app)
        .post('/users/register')
        .send(newUser)
        .then((res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message', 'Email is already exist in database')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
  });
  describe('Get token and token_type from user login POST /login', function() {
    it('should have property token_type dan token', function(done) {
      let sendUserLogin = {
        password: 'testing',
        username: 'testing',
      }
      chai
        .request(app)
        .post('/users/login')
        .send(sendUserLogin)
        .then((res) => {
          expect(res.body).to.have.property('token')
          expect(res.body).to.have.property('token_type', 'default')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('should send message username / password wrong and status 400 if sending wrong username', function(done) {
      let sendUserLogin = {
        password: 'testing',
        username: 'salah',
      }
      chai
        .request(app)
        .post('/users/login')
        .send(sendUserLogin)
        .then((res) => {
          expect(res.body).to.have.property('message', 'Username / password Invalid')
          expect(res).to.have.status(401)
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('should send message username / password wrong and status 400 if sending wrong password', function(done) {
      let sendUserLogin = {
        password: 'salah',
        username: 'testing',
      }
      chai
        .request(app)
        .post('/users/login')
        .send(sendUserLogin)
        .then((res) => {
          expect(res.body).to.have.property('message', 'Username / password Invalid')
          expect(res).to.have.status(401)
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
  });
  describe('Post token to the database to logout POST /logout', function() {
    it('should send successfully logout message', function(done) {
      chai
        .request(app)
        .post('/users/logout')
        .set('token', 'testing')
        .then((res) => {
          expect(res.body).to.have.property('message', 'Successfully log out')
          done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
  });
  // describe('Get basic profile login customer GET /myprofile', function() {
  //   it('should return basic profile data', function(done) {
  //     let sendUserLogin = {
  //       password: 'robbycp',
  //       username: 'robbycp',
  //     }
  //     let token
  //     chai
  //       .request(app)
  //       .post('/users/login')
  //       .send(sendUserLogin)
  //       .then((res) => {
  //         return chai
  //           .request(app)
  //           .get('/users/myprofile')
  //           .set('token', res.body.token)
  //       })
  //       .then((res) => {
  //         expect(res.body).to.have.property('full_name')
  //         expect(res.body).to.have.property('username')
  //         expect(res.body).to.have.property('email')
  //         expect(res.body).to.not.have.property('password')
  //         expect(res.body).to.have.property('admin')
  //         done()
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })

  //   })
  // });
})