const User = require('../models/User')

// @desc Get all stores 
// @route GET api/stores
// @access public
exports.getUsers = async (req,res,next)=>{
    try{
        let users;
        if(req.query.name!=null && req.query.password!=null){
            console.log(req.query.name)
            users = await User.find({username:req.query.name, password:req.query.password});
        }
        else
            users = await User.find();

        if(users.length==0){
            console.log("oof")
            return res.status(400).json({
                success: false,
                count: users.length,
                data: users

            })

        }
        else{
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })
    }

    }catch(err){
        console.log(err);
        res.status(500).json({
            error:'server error'
        })

    }

}

// @desc Create a store
// @route POST api/stores
// @access public
exports.addUser = async (req,res,next)=>{
    try{
        let user
        if(req.query.username!=null && req.query.password!=null){
            const myUser = await User.find({username:req.query.username, password:req.query.password})
            const arr = await myUser[0].requests
            arr.push({
            item:req.body.item,
            quantity:req.body.quantity,
            status:'not delivered'})
            User.updateOne({username:req.query.username, password:req.query.password},{
                requests:arr   
            },(err,num)=>{
                console.log(err)
                console.log(num)
            })  
        }
        else if(req.query.username!=null && req.query.status!=null){
            console.log('delivered')
            const myUser = await User.find({username:req.query.username})
            const arr = await myUser[0].requests
            
            arr.forEach(request => {
                request.status=req.query.status
            });
            console.log(arr)
            User.updateOne({username:req.query.username},{
                requests:arr   
            },(err,num)=>{
                console.log(err)
                console.log(num)
            }) 


        }
        else
            user = await User.create(req.body);
        return res.status(200).json({
            success: true,
            data: user
        });

    }catch(err){
        console.log(err);
        if(err.code===11000){
            return res.status(400).json({
                error:"Duplicate entry"
            })

        }
        res.status(500).json({
            error:'server error'
        })

    }

};