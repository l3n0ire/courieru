const Item = require('../models/Item');
// @desc Get all items
// @item GET api/items
// @access public
exports.getItems = async (req,res,next)=>{
    try{
        let items
        if(req.query.item!=null){
            items = await Item.find({item:req.query.item});
        }
        else
            items = await Item.find();
        if(req.query.item!=null && items.length==0){
        return res.status(400).json({
            success: true,
            msg:"item not found",
            count: items.length,
            data: items
        })
    }
        else{
            return res.status(200).json({
                success: true,
                count: items.length,
                data: items
            })

        }
    


    }catch(err){
        console.log(err);
        res.status(500).json({
            error:'server error'
        })

    }

}


// @desc Create a item
// @item POST api/items
// @access public
exports.addItem = async (req,res,next)=>{
    try{
        let item
        let length
        item = await Item.find({item:req.body.item})
        length= item.length
        console.log(req.body.item)
        console.log(length)
        if(length==0)
        {
            item = await Item.create({
                item:req.body.item,
                requests:req.body.quantity,
                donations:0

            });
        }
        else{
            var existingRequests =  item[0].requests
            Item.updateOne({item:req.body.item},{
                requests:existingRequests+parseInt(req.body.quantity)
            },(err,num)=>{
                console.log(err)
                console.log(num)
            })  
        }
        return res.status(200).json({
            success: true,
            
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