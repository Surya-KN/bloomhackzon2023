const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const Event = require('../server/models/events')
require("dotenv").config(); 
 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.send("HI")
})
let session
app.post("/api/create-checkout-session", async (req, res) => { 
    const { product } = req.body; 
     session = await stripe.checkout.sessions.create({ 
      payment_method_types: ["card"], 
      line_items: [ 
        { 
          price_data: { 
            currency: "inr", 
            product_data: { 
              name: product.name, 
            }, 
            unit_amount: product.price * 100, 
          }, 
          quantity: product.quantity, 
        }, 
      ], 
      mode: "payment", 
      success_url: `http://localhost:3000/paymentredirect`, 
      cancel_url: "http://localhost:5173/payment/cancel", 
    }); 
    res.json({ id: session.id }); 
  }); 
app.get('/paymentredirect',(req,res)=>{
    res.redirect(`/addParticipant/${session.id}`)
})
app.get('/seed',async(req,res)=>{
    const initial1 = new Event()
    initial1.name = 'Dev Fest'
    initial1.participants = []
    await initial1.save()
    
    const initial2 = new Event()
    initial2.name = 'Women in ML Symposium 2022'
    initial2.participants = []
    await initial2.save()

    
    const initial3 = new Event()
    initial3.name = 'Flutter Forward'
    initial3.participants = []
    await initial3.save()

    const initial4 = new Event()
    initial4.name = 'Azure Adventure Day'
    initial4.participants = []
    await initial4.save()
    
    const initial5 = new Event()
    initial5.name = 'Microsoft Power Platform Training'
    initial5.participants = []
    await initial5.save()

    
    const initial6 = new Event()
    initial6.name = "Microsoft Virtual Briefing"
    initial6.participants = []
    await initial6.save()

    

    res.send("HI")
})

app.post('/addParticipant/:id',async(req,res)=>{
    const {eventName,participant} = req.body
    console.log(req.body.eventName)
    console.log(req.body.participant)
    req.body.participant.transactionID = req.params.id
    try {
        const foundEvent = await Event.findOne({name:eventName})
        console.log(foundEvent)
        let participants = foundEvent?.participants
        
        participants.push(participant)
        await Event.findOneAndUpdate({name:eventName},{participants:participants})

        return res.redirect('http://localhost:5173/success')
    } catch (e) {
        console.log(e.message)
        return res.sendStatus(400)
    }
})
app.get('/getParticipants/:id',async(req,res)=>{
    const {id} = req.params
    const eventNames = ["Dev Fest","Women in ML Symposium 2022","Flutter Forward","Azure Adventure Day","Microsoft Power Platform Training","Microsoft Virtual Briefing"]
  
    try{
        const participants = await Event.find({name:`${eventNames[id]}`}).select({participants:true})
   
       return  res.json({
            data:participants[0]?.participants
        })
    }catch(e){
        return res.json({
            error:e.message
        })
    }
})

app.get('/total',async(req,res)=>{
    let count =0
    const all = await Event.find({})
    all.forEach((i)=>{
        count += i.participants.length
    })
    console.log(count)
    return res.json({
        data:count
    })
})

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log("Database connected")
})
.catch((e)=>{
    console.log(e.message)
})
app.listen(3000,()=>{
    console.log("Listening at port 3000")
})