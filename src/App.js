import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from './Pages/Room';
import HomePage from './Pages/Home';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/room/:roomid' element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
