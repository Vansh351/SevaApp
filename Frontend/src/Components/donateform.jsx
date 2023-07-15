import React from "react";
import config from "../config.js";
import styles from "./styles/donateform.module.css";
import { useState } from "react";
import axios from 'axios';
import {useHistory } from 'react-router-dom'









const DonateForm = (props) => {

  

  const send_to = config.donateTo(props.id);
   const[val,setVal]= useState();
   const history =useHistory();

   //console.log(props);
   const Paymenthandler=async()=>{
     
    const {data:{key}}= await axios.get("http://localhost:4000/api/getkey");
    const {data:{order}}= await axios.post(send_to,{
      amount:props.amount
    })
  // console.log(key);
   //console.log(order.amount);
   //console.log( order.id);
    
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, 
      currency: "INR",
       name: "Funding App",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, 
     // callback_url: "http://localhost:4000/api/testpay/paymentVerification",
      handler: async function (response){
        const obj= await verifyPayment(response,(order.amount)/100,order.receipt);
       
        history.push(obj.url);
        console.log(" payment check karee yara ki");
    },
  // vpa : "gauravkumar@exampleupi",
    // prefill: {
    //       name: "Gaurav Kumar",
    //       email: "gaurav.kumar@example.com",
    //       contact: 9999999999,
    //   },
      notes: {
          address: "Razorpay Corporate Office"
      },
      theme: {
          color: "#3399cc"
      }
  };
  const rzp1 = new window.Razorpay(options);
      rzp1.open();
 
  }
 

  return (
    <React.Fragment>
      <form className="row" onSubmit={Paymenthandler}>
        <div className="form-group col-7">
          <span className={styles.rupeeInput}>
            <i className="fa fa-inr" aria-hidden="true"></i>{" "}
            <input
              className={styles.input}
              name="amount"
              placeholder="Enter Amount"
              disabled={!props.isActivated || Number(props.amount) + props.fundRaised >props.fundRequired }
              required={true}
              value={val}
              onChange={(event)=>{
                props.onAmountChange(event);
                setVal(event.target.value);
              }}
            />
          </span>
        </div>
        <div className={`col-5 ${styles.submit}`}>
          <button
            type="button"
            onClick={()=>{ Paymenthandler()}}
            disabled={!props.isActivated || Number(props.amount) + props.fundRaised >props.fundRequired}
            className={`btn  col-12 ${styles.btn} ${
              props.isActivated === false
                ? `btn-secondary ${styles.disabled}`
                : `btn-success ${styles.active}`
            }`}
          >
            Donate Now <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

const verifyPayment = async(resp,amount,donationId)=>{
  
  const body= {...resp,amount,donationId};
  console.log(body);
   
  const url = config.verifyPayment();
  const {data} = await axios.post(url,body);

  //console.log(data);
  return data;
//   if(!response.data.success) {
//     throw new Error(response.data.message);
//  }
   
}



export default DonateForm;
