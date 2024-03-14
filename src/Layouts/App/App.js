import './App.css';

import { Routes, Route } from 'react-router-dom';

import Header from '../../Components/Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import Customer from '../Customer/Customer';
import Product from '../Product/Product';

function App() {
  return (
    <>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/customer' element={<Customer />}/>
          <Route path='/product' element={<Product />}/>
        </Routes>
    </>
  );
}

export default App;
