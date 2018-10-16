const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const redisClient = require('redis').createClient();
const PORT = 5000;
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/largedatabase');

//model
const Person =  require("./model/person.js");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
  }));


app.get("/", function(req, res){

        res.status(200).send({msg : "This is redis cache demonstration app"})

})


app.get("/personscount", function(req, res){

    Person.count()
    .then(function(count){
            console.log("-----count-----", count);
            res.status(200).send({count : count})
    })
    .catch(function(err){
        console.log(err);
        res.status(500).send(err);
    })
})

app.get("/withcache/persons/:birthYear", function(req, res){
    console.log("------in API-------");
    let birthYear = req.params.birthYear;
    // console.log(birthYear);
    redisClient.get(birthYear, function(err, obj){
        console.log("----err------", err);
        if(obj === null){
            Person.find({
                birthYear : birthYear
            })
            .then(function(data){
                redisClient.set(birthYear, JSON.stringify(data), function(err, response){
                        if(err){
                            console.log(err);
                        }
                        else
                        {
                            console.log("-- data cached --");
                        }
                })
                res.status(200).send(data);
            })
            .catch(function(err){
                res.status(500).send(err);
            })
        }
        else
        {
            console.log("---data already present in cache----");
            res.status(200).send(JSON.parse(obj));
        }
    })
    
})


app.get("/withoutcache/persons/:birthYear", function(req, res){

    let birthYear = req.params.birthYear;
    Person.find({
        birthYear : birthYear
    })
    .then(function(data){
        res.status(200).send(data);
    })
    .catch(function(err){
        res.status(500).send(err);
    })
})


app.listen(PORT, function(){
    console.log("server started on port "+PORT);
})

