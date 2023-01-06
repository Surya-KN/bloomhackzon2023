import * as React from 'react';
import Registration from "./components/Registration"
import Home from './components/Home'
import ViewEvent from "./components/ViewEvent"
import Admin from './components/AdminLogin'
import AdminHome from './components/AdminHome';
import { Routes,Route } from 'react-router-dom';
import Payment from './components/Payment';
import Success from './components/Success';
import PaymentSuccess from './components/PaymentSuccess'
import PaymentFailure from './components/PaymentFailure'
import StripePayment from './components/StripePayment';
const App =()=>{
  return (<div>
    <Routes>
      <Route path='/' element={ <Home/>}/>
      <Route path='/register/:i' element={ <Registration/>}/>
      {/* <Route path='/payment/:i' element={ <Payment/>}/> */}
      <Route path='/success' element={ <Success/>}/>
      <Route path='/admin' element={ <AdminHome/>}/>
      <Route path='/payment/:eventname/:price' element={<StripePayment/>}/>
      <Route path='/payment/success' element={<PaymentSuccess/>}/>
      <Route path='/payment/cancel' element={<PaymentFailure/>}/>
    
    </Routes>

  </div>)
}

export default App