var chai = require('chai')
var assert = require('chai').assert
var expect    = require("chai").expect;
var chaiHttp = require('chai-http')
chai.use(chaiHttp)

var app= require('../index.js')

describe('delivery', function () {
  it('set customer delivery address',()=>{
    chai
       .request(app)
       .post("/uber-eats/api/deliveryAddress/customer/db72ca77-e6d2-4214-8fb9-f23b64400c8e")
       .send({ addressLine1: "The Alameda", 
       addressLine2:"1318", 
       city:"San Jose", 
       state:"CA", 
       country:"USA", 
       pincode:"95126", 
       addressName:"Home", 
       save:"True"})
       .end((err,res)=>{
           assert.equal(res.status,200)
     })
  })

  it('get restaurant dishes',()=>{
      chai
        .request(app)
        .post("/uber-eats/api/restaurant/dishes")
        .send({ dishId: "462dc010-54fe-404c-8c74-3fbb3126587c", 
          name: "Dish", 
          type: "Veg", 
          dishdesc: "Desc", 
          restaurantId: "3fc959ed-0981-4879-9d62-22a5bf818a19", 
          category: "Soup", 
          price: "8", 
          imageUrl: ""})
        .end((err,res)=>{
            assert.equal(res.status,200)
      })
  })

  it('check customer login',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/customer/login')
      .send({ email: "user1@gmail.com",
          password: "user1"
      })
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('object')
      })
  })


  it('check restaurant login',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/restaurant/login')
      .send({ email: "papa@gmail.com",
          password: "papa"
      })
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('object')
      })
  })

  it('get customer orders',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/orders/customer/a8087c3e-d5e4-4456-9419-a392c6a610be')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
      })
  })

  it('get restaurants orders',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/orders/restaurant/11bdb276-dfa8-4876-91f6-9d40f022e414')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('array')
      })
  })

  it('get restaurants',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/restaurant/11bdb276-dfa8-4876-91f6-9d40f022e414')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('object')
      })
  })
  
  it('get restaurant mode',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/restaurant/mode/11bdb276-dfa8-4876-91f6-9d40f022e414')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('object')
      })
  })

  it('get restaurant mode',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/restaurant/mode/11bdb276-dfa8-4876-91f6-9d40f022e414')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('object')
      })
  })

  it('get restaurants',()=>{
    chai
      .request(app)
      .get('/uber-eats/api/restaurants')
      .end(function (err, res) {
        assert.equal(res.status,200)
        assert.exists(res.body)
        expect(res.body).to.be.a('array')
      })
  })

  it('set personalization',()=>{
    chai
       .request(app)
       .post("/uber-eats/api/personalize/customer")
       .send({ customerId: "a8087c3e-d5e4-4456-9419-a392c6a610be", 
       restaurantId:"24fd3291-cbb8-41ea-92a5-24596f87137d"})
       .end((err,res)=>{
           assert.equal(res.status,200)
     })
  })

  it('get personalizations',()=>{
    chai
       .request(app)
       .get("/uber-eats/api/personalize/customer/a8087c3e-d5e4-4456-9419-a392c6a610be")
       .end((err,res)=>{
           assert.equal(res.status,200)
           expect(res.body).to.be.a('array')
     })
  })

});