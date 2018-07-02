const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
var knex = require('knex')

const db= knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl : true,
  }
});
db.select('*').from('users');

const database = {
  users: [{
    
    name: 'shiv',
    email: 's@gmail.com',
    password:'123',
    img: ''

    
  }],
  admin: [{
    
    name: 'adminuser',
    email: 'admin@gmail.com',
    password:'admin123'

    
  }],
 
}


app.use(cors());

app.use(bodyParser.json()
  );

   app.get('/', (req, res) => res.send('Hello you s'))


  app.post('/dashbo', (req, res) => {db.select('image').from('users')
    .where('email','=',req.body.email)
    .then(user => {
            res.json(user)
          })}

  )

app.post('/signin', (req, res) => {


 db.select('email', 'password').from('users')
    .where('email', '=', req.body.email)
    .andWhere('password','=',req.body.password)
    .then(data => {
      
      if (data[0].password===req.body.password && data[0].password.length!==0) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json('success')
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})



app.get('/admindash', (req, res) => {
  const {email } = req.params;
  db.select('*').from('users')
    .then(user => {
      if (user.length) {
        res.json(user)
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.post('/dashboard', (req, res) => {


      db.select('email', 'password').from('users')
    .where('email', '=', req.body.email)
    .andWhere('password','=',req.body.password)
    .then(data => {
      
      if (req.body.password.length!==0) {
       db('users').update('password', req.body.password)
          .where('email', '=', req.body.email)

          .then(user => {
            res.json('success')
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong info'))


})

app.post('/delete', (req, res) => {


      db.select('email').from('users')
    .where('email', '=', req.body.email)
    .then(data => {
      
      if (req.body.email.length!==0) {
       db('users')
     .where('email','=', req.body.email)
       .del()
          
          .then(user => {
            res.json('success')
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))


})



app.post('/admin', (req, res) => {
  if (req.body.email === database.admin[0].email && 
  	req.body.password === database.admin[0].password) {
    res.json('successadmin');
  } else {
    res.json('accessadmin  denied');
  }
    
    
  })
  







app.post('/signup', (req, res) => {
  db('users').insert({
    email : req.body.email,
    name : req.body.name,
    password: req.body.password,
    image:req.body.img
  }).then( function (result) {
          res.json('yeah'); 
  
//{ success: true, message: 'ok' }
  //console.log(req.body.email)})
 // res.json(database.users[database.users.length - 1])
})
})





app.listen(process.env.PORT ||3001, () => console.log('Example app listening on port !'))
