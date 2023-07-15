const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const instance = require("../razorPay/razorPay");
const { Campaign} = require("../models")

router.post("/:id/payment",async(req,res)=>{
   try{
    const amt= req.body.amount;
    const campaign= req.params.id;
    
   //  const campaignData = await Campaign.findById(
   //    campaign
   //  );

   //  if(campaignData.raised + amt > campaignData.required ){
   //    return res.status(200).json({
   //       success:false,
   //       message:"please enter the amount less than the goal"
   //    })
   //  }
    //console.log(campaignData);

    const options = {
        amount: amt*100,  // amount in the smallest currency unit
        currency: "INR",
       receipt:campaign,
      };
     const order= await instance.orders.create(options);
     console.log(order);
     res.status(200).json({
        success:true,
        order
     });
   }
   catch(err){
    res.status(400).json({
        success:false,
        message:"error in payment"
     });
   }
});

router.post("/paymentVerification",ctrl.testPay);
module.exports = router;

 