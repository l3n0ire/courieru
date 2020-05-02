const Route = require('../models/Route');
const mongoose =require('mongoose');
// @desc Get all routes
// @route GET api/routes
// @access public
exports.getRoutes = async (req,res,next)=>{
    try{
        let routes
        if(req.query.courier!=null){
            routes = await Route.find({courier:req.query.courier});
        }
        else
            routes = await Route.find();
        if(req.query.courier!=null && routes.length==0){
        return res.status(400).json({
            success: true,
            msg:"route not found",
            count: routes.length,
            data: routes
        })
    }
        else{
            return res.status(200).json({
                success: true,
                count: routes.length,
                data: routes
            })

        }

    }catch(err){
        console.log(err);
        res.status(500).json({
            error:'server error'
        })

    }

}


// @desc Create a route
// @route POST api/routes
// @access public
exports.addRoute = async (req,res,next)=>{
    try{
        let route 
        if(req.query.id!=null){
            var id = mongoose.Types.ObjectId(req.query.id)
            console.log(id)
            route = await Route.find({_id:id})
            Route.updateOne({_id:id},{
                addresses:route[0].addresses,
                courier:route[0].courier,
                accepted:true
            },(err,num)=>{
                console.log(err)
                console.log(num)
            })
        }
        else
            route = await Route.create(req.body);
        return res.status(200).json({
            success: true,
            data: route
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