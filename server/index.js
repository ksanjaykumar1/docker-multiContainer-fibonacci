const keys= require('./keys')

//express js client setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
app.use(cors())
//turn body of the post request into json value
app.use(bodyParser.json())



// postgress client setup

const {Pool} = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDataBase,
    password:keys.pgPassword,
    port:keys.pgPort

})
pgClient.on('error',()=> console.log('Lost PG connection'));
// tables name is values which stores number of type int
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err=>console.log(err))

//redis client setup
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=>1000
})

const redisPublisher = redisClient.duplicate();

// express route handler

app.get('/', (req,res)=>{
    res.send('Hi')
});

//return all the values ever submitted to postgress
app.get('/values/all', async(req,res)=>{

    const values = await pgClient.query('SELECT * from values');
    // values will contain other deatils such as how much time it took to run etc , so we select values.row to send just the values
    
    res.send(values.rows)
})

// retrive all the values that have been calculate and stored in redis
app.get('/values/current', async(req,res)=>{
    // values is the data structure which stores all fib values wagainst the index, we are telling redis to look for values data structure by passing hash of values and then return it 
    redisClient.hgetall('values',(err,values)=>{
        res.send(values)
    })
})

app.post('/values',async(req,res)=>{
    const index = req.body.index
    if(parseInt(index)>40){
        return res.status(422).send('Index too high');
    }
    //we set against the requested index in values
    redisClient.hset('values',index,'Nothing yet!')
    // it will publish a insert event , it will wake up worker process and asks it to calculate fib value
    redisPublisher.publish('insert',index);
    //inserting into table values and into the column $1 , this will store into postgress
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index])

    res.send({working:true})


})

app.listen(5000, err=>{
    console.log('Listening on 5000')
})


