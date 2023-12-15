import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Home';
import { SocketProvider } from './Providers/Socket';




const App = () => {
  return (
    <BrowserRouter>
      <SocketProvider>
        
        <Routes>
          <Route path='/' element={<Homepage />} />
        </Routes>
      </SocketProvider>

    </BrowserRouter>
  );
}

export default App;
