const instance = require("../razorPay/razorPay");
const { success } = require("./payment");
const db = require("../models");
const crypto= require("crypto");
const { Donation } = require("../models");
const { Campaign} = require("../models")
var mongoose  = require("mongoose");
 const frontendURL = "http://localhost:3000/"

//for creating order
const paymentVerification = async(req,res)=>{

  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const amt= req.body?.amount;
  const donationId= req.body?.donationId;
  if(!razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ) {
        return res.status(200).json({success:false, message:"Payment Failed"});
}
  try{
   
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");
  
    if(expectedSignature === razorpay_signature){
      // entry the payment in donation
    const obj = await PaymentEntry(amt, donationId,razorpay_payment_id);
     
     if(obj.url.length >0){
      console.log(obj.message,obj.url,obj.success);
      return res.status(200).json({
        success:true,
        url:obj.url,
      });
     }
   
     console.log("Payment Failed");
     return res.status(400).json({
      success:false,
      url: frontendURL + "donation/failure"
     });
    }
    else{
        console.log("Payment Failed");
        return res.status(400).json({
          success:false,
          url: frontendURL + "donation/failure"
         });
    }
  }
  catch(err){
    return res.status(200).json({success:"false", message: err.message});
  }     
}




const PaymentEntry = async(amt , campaignId,paymentId)=>{
//console.log(amt, campaignId,"successfull");

try{

  const donation=  await Donation.create({
    amount: amt,
    campaign: mongoose.Types.ObjectId(campaignId), 
    transactionComplete:true,
    transactionID:paymentId 
  });

  const donationId= donation._id;
  
  //console.log(" it is donation",donation);
  
  const campaign = await Campaign.findById(
    donation.campaign
  );
  
  //console.log(" it is campaign",campaign);
  if( campaign.required <= campaign.raised + donation.amount){
         campaign.isCompleted= true;
         campaign.isActivated= false;
  }

  var details = {
    transactionID: donation.transactionID,
    donationAmount: donation.amount,
  };
  
  campaign.donors.push(details);
                      campaign.donorsNum = campaign.donorsNum + 1;
                      campaign.raised = campaign.raised + donation.amount;
                      await campaign.save();
  
 //  console.log(" it is final campaign",campaign);   
   const req_url = "/donation/success/" + donationId;
   const obj ={
    success:true,
    message: "Payment is Completed",
    url:req_url,
  }
   return obj;
   
  }
  catch(err){
    const obj ={
      success:false,
      message: "error while making payment in  catch block",
      url:"",
    }
return obj;
}

}




module.exports= paymentVerification;