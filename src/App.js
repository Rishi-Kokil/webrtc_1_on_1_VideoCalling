import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Home';
import Room from './Pages/Room';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/room/:roomid' element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
