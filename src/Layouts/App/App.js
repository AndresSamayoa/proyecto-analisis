import './App.css';

import { Routes, Route } from 'react-router-dom';

import Header from '../../Components/Header/Header';
import Dashboard from '../Dashboard/Dashboard';

function App() {
  return (
    <>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />}/>
        </Routes>
    </>
  );
}

export default App;
