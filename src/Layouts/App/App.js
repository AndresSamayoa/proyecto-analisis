import './App.css';

import { Routes, Route } from 'react-router-dom';

import Header from '../../Components/Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import Customer from '../Customer/Customer';
import Product from '../Product/Product';
import Employee from '../Employee/Employee';
import Credit from '../Credit/Credit';
import CustomerContact from '../CustomerContact/CustomerContact';
import Sale from '../Sale/Sale';
import Payment from '../Payment/Payment';
import Document from '../Document/Document';

function App() {
  return (
    <>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/customer' element={<Customer />}/>
          <Route path='/product' element={<Product />}/>
          <Route path='/employee' element={<Employee />}/>
          <Route path='/credit' element={<Credit />}/>
          <Route path='/customercontact' element={<CustomerContact />}/>
          <Route path='/payment' element={<Payment />}/>
          <Route path='/sale' element={<Sale />}/>
          <Route path='/document' element={<Document />}/>
        </Routes>
    </>
  );
}

export default App;
