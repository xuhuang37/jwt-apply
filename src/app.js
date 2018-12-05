let express = require('express')

let bodyParser = require('body-parser')
let jwt = require('jwt-simple')

let User = require('./user')
let {secret} = require('../config')

let app = express()


app.use(bodyParser.json())
app.use(function(res,req,next){
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,Delete,OPTIONS')
  if(req.method==='OPTIONS'){
    res.end()
  }else{
    next()
  }
})
 app.post('/reg',async function (req, res, next) {
  let user = req.body
  try {
    user = await User.create(user)
    res.json({
      code: 0,
      data: {
        user: {
          id: user._id,
          username: user.username
        }
      }
    })
  } catch (err) {
    res.json({
      code: 1,
      data: '注册失败'
    })
  }
})

app.post('/login',async function (req, res, next) {
  let user = req.body
  console.log(user);
    user = await User.findOne(user)
    console.log(user)
    try{
      if(user){
        let token = jwt.encode({
          id:user._id,
          username:user.username
        },secret)
        res.json({
          code:0,
          data:{
            token
          }
        })
      }else{
        res.json({
          code:1,
          data:'用户不存在'
        })
      }
    }catch(err){
      console.log(err)
    }
    
})

let auth = function(req,res,next){
  let authorization = req.headers['authorization']
  if(authorization){
    let token = authorization.split(' ')[1]
    try{
      let user = jwt.decode(token,secret)
      req.user = user
      next()
     }catch(e){
      res.status(401).send('Not Allowed')
    }
  }else{
    res.status(401).send('Not Allowed')
  }
}
app.get('/order',auth,function(req,res,next){
  res.json({
    code:0,
    data:{
      user:req.user
    }
  })
})

app.listen(3001)