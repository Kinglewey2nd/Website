import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PackOpen from './pages/PackOpen'
import Login from './pages/Login'
import MainMenu from './pages/MainMenu'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainMenu />} />
        <Route path='/login' element={<Login />} />
        <Route path='/pack/open' element={<PackOpen />} />
      </Routes>
    </Router>
  )
}