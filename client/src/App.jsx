import React from 'react'
import Navbar from './assets/components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './assets/pages/Home'
import Movies from './assets/pages/Movies';
import MovieDetails from './assets/pages/MovieDetails';
import SeatLayout from './assets/pages/SeatLayout';
import MyBookings from './assets/pages/MyBookings';
import Favorite from './assets/pages/Favorite';
import { Toaster } from 'react-hot-toast';
import Footer from './assets/components/Footer'
import Dashboard from './assets/pages/admin/Dashboard';
import Addshows from './assets/pages/admin/Addshows';
import Listshows from './assets/pages/admin/Listshows';
import ListBookings from './assets/pages/admin/ListBookings';
import Layout from './assets/pages/admin/Layout';
import { SignIn, useUser } from '@clerk/clerk-react';


const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  const { user } = useUser()
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path="/admin" element={user ? <Layout /> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
    <Route index element={<Dashboard />} /> 
    <Route path="add-shows" element={<Addshows />} />
    <Route path="list-shows" element={<Listshows />} />
    <Route path="list-bookings" element={<ListBookings />} />
  </Route>
      </Routes>
      { !isAdminRoute && <Footer />}
    </>
  )
}

export default App
