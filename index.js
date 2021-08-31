const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors=require('cors');
const header=require('header');
const pieRepo=require('./repos/pieRepo');
app.use(cors());
app.use(express.json());
const router=express.Router();
app.use('/',router);

router.get('/', (req, res,next) => {
pieRepo.get(function(data){
    res.status(200).json({
    "status":200,
    "statusText": "Ok",
    "message":"All files retrieved",
    "data":data
  });

},function(err){
  next(err)
});
});
router.get('/search',(req,res,next) =>{
   let searchObject={
    "id":req.query.id,
    "name":req.query.name
  }
   pieRepo.search(searchObject,function(data){
       
       res.status(200).json({
         "status":200,
         "statusText":"ok",
         "message":"All files retrieved",
         "data":data
       });
   
         
     
      },function(err){
        next(err);
      });

});

router.get('/:id', (req, res,next) => {
pieRepo.getById(req.params.id,function(data){
 if(data){
      res.status(200).json({
    "status":200,
    "statusText": "Ok",
    "message":"single file retrieved",
    "data":data
  });
 }
else{
     res.status(404).json({
    "status":404,
    "statusText": "not found",
    "message":"file with " +req.params.id + " could not be found ",
    "error":{
      "code":"Not found",
      "message":"file with id " +req.params.id + " could not be found "
    }
});
  }
},function(err){
  next(err)
});
});
router.post('/',(req,res,next)=>{
  
  pieRepo.insert(req.body,(data)=>{
    res.status(201).json({
      "status":201,
      "statusText":"ok",
      "message":"new pie added",
      "data":data
    });
  },
  (err)=>{
    next(err)
  });
  
});
router.put('/:id',(req,res,next)=>{
  pieRepo.getById(req.params.id,(data)=>{
    if(data){
      pieRepo.update(req.body,req.params.id,(data)=>{
        res.status.json({
          "status":200,
            "statusText":"ok",
          "message":"pie with " +req.params.id + " has been updated",
          "data":data
        });
      });
    }
    else {
      res.status(404).json({
        "status":404,
        "statusText":"Not found",
        "message":"file with "+req.params.id+" was not found",
      "error":{
        "code":"not found",
         "message":"file with "+req.params.id+" was not found"
      }
      });
    }
  },(err)=>{
    next(err)
  });
});
router.delete('/:id',(req,res,next)=>{
  pieRepo.getById(req.params.id,(data)=>{
    if(data){
      res.status(200).json({
    "status":200,
    "statusText": "Ok",
    "message":"file with " +req.params.id+ " deleted",
    "data":data
  });
 }
else{
     res.status(404).json({
    "status":404,
    "statusText": "not found",
    "message":"file with " +req.params.id + " could not be found ",
    "error":{
      "code":"Not found",
      "message":"file with id " +req.params.id + " could not be found "
    }
});
  }
 
  },(err)=>{
    next(err);
  });
});
router.patch('/:id',(req,res,next)=>{
    pieRepo.getById(req.params.id,(data)=>{
    if(data){
      pieRepo.update(req.body,req.params.id,(data)=>{
        res.status.json({
          "status":200,
            "statusText":"ok",
          "message":"pie with " +req.params.id + " has been updated",
          "data":data
        });
      });
    }
    else {
      res.status(404).json({
        "status":404,
        "statusText":"Not found",
        "message":"file with "+req.params.id+" was not found",
      "error":{
        "code":"not found",
         "message":"file with "+req.params.id+" was not found"
      }
      });
    }
  },(err)=>{
    next(err)
  });

});
function errorBuilder(err){
  return {
      "status":500,
        "statusText":"Server Error",
        "message":err.message,
        "error":{
          "errno":err.errno,
          "call":err.syscall,
        "code":"INTERNAL_SERVER_ERROR",
         "message":err.message
         }
      }
}
app.use((err,req,res,next)=>{
     console.log(errorBuilder(err))
next(err)
});
app.use((err,req,res,next)=>{
      res.status(500).json(errorBuilder(err));

});

let server=app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)}
);
