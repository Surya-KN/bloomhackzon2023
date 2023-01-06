import React,{useState} from "react"
import { loadStripe } from "@stripe/stripe-js"; 
import { useParams } from "react-router-dom";
import { Button, Typography,Container } from "@mui/material";

function StripePayment() {
    const params = useParams() 
    const [product, setProduct] = useState({ 
      name: params.eventname, 
      price: params.price, 
      productOwner: "bloom", 
      quantity: 1, 
    }); 

    const makePayment = async () => { 
        const stripe = await loadStripe("pk_test_51MDC71SBrgUsb0rjmHRanyj695uheaRzhEoDkZzdk2efZqiNiyQIeT5xe8xztuUXPOzMfmun5297vYRY1NdWHOoj00Uvulfula"); 
        const body = { product }; 
        const headers = { 
          "Content-Type": "application/json", 
        }; 
     
        const response = await fetch( 
          "http://localhost:3000/api/create-checkout-session", 
          { 
            method: "POST", 
            headers: headers, 
            body: JSON.stringify(body), 
          } 
        ); 
     
        const session = await response.json(); 
     
        const result = stripe.redirectToCheckout({ 
          sessionId: session.id, 
        }); 
     
        if (result.error) { 
          console.log(result.error); 
        } 
      }; 

      return ( 
        <Container > 
         <Typography variant="h1" component="h1" sx={{textAlign:'center'}}>{params.eventname}</Typography>
           

            <Button sx={{mx:'45%',minWidth:'7rem',marginTop:'2rem'}}  variant="contained" onClick={makePayment}> 
              Pay {product.price} 
            </Button> 
           
        </Container> 
      ); 
  } 
  export default StripePayment; 