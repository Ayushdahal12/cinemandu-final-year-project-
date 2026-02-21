// import React from 'react'
// import Navbar from './assets/components/Navbar'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import Home from './assets/pages/Home'
// import Movies from './assets/pages/Movies';
// import MovieDetails from './assets/pages/MovieDetails';
// import SeatLayout from './assets/pages/SeatLayout';
// import MyBookings from './assets/pages/MyBookings';
// import Favorite from './assets/pages/Favorite';
// import { Toaster } from 'react-hot-toast';
// import Footer from './assets/components/Footer'
// import Dashboard from './assets/pages/admin/Dashboard';
// import Addshows from './assets/pages/admin/Addshows';
// import Listshows from './assets/pages/admin/Listshows';
// import ListBookings from './assets/pages/admin/ListBookings';
// import Layout from './assets/pages/admin/Layout';
// import { SignIn, useUser } from '@clerk/clerk-react';
// import PaymentSuccess from './assets/pages/PaymentSuccess'
// import PaymentPage from './assets/pages/PaymentPage'
// import AdminBookings from './assets/pages/admin/AdminBookings'
// import CancelledBookings from './assets/pages/admin/CancelledBookings'
// import AdminTheaters from './assets/pages/admin/AdminTheaters'
// import Theaters from './assets/pages/Theaters'
// import AdminUsers from './assets/pages/admin/AdminUsers'





// const App = () => {

//   const isAdminRoute = useLocation().pathname.startsWith('/admin')
//   const { user } = useUser()

//   return (
//     <>
//       <Toaster />
//       {!isAdminRoute && <Navbar />}
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/payment-success' element={<PaymentSuccess />} />
//         <Route path='/payment' element={<PaymentPage />} />


//         <Route path='/theaters' element={<Theaters />} />
//         <Route path='/movies' element={<Movies />} />
//         <Route path='/movies/:id' element={<MovieDetails />} />
//         <Route path='/movies/:id/:date' element={<SeatLayout />} />
//         <Route path='/my-bookings' element={<MyBookings />} />
//         <Route path='/favorite' element={<Favorite />} />
//         <Route path="/admin" element={user ? <Layout /> : (
//           <div className='min-h-screen flex justify-center items-center'>
//             <SignIn fallbackRedirectUrl={'/admin'} />
//           </div>
//         )}>
//           <Route index element={<Dashboard />} />
//           <Route path="add-shows" element={<Addshows />} />
//           <Route path="list-shows" element={<Listshows />} />
//           <Route path="list-bookings" element={<ListBookings />} />
//           <Route path="bookings" element={<AdminBookings />} />
//           <Route path="cancelled-bookings" element={<CancelledBookings />} />
//           <Route path="theaters" element={<AdminTheaters />} />
//           <Route path="users" element={<AdminUsers />} />
//         </Route>
//       </Routes>
//       {!isAdminRoute && <Footer />}
//     </>
//   )
// }

// export default App



import React from 'react'
import Navbar from './assets/components/Navbar'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { useUser, SignIn } from '@clerk/clerk-react'
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
import PaymentSuccess from './assets/pages/PaymentSuccess'
import PaymentPage from './assets/pages/PaymentPage'
import AdminBookings from './assets/pages/admin/AdminBookings'
import CancelledBookings from './assets/pages/admin/CancelledBookings'
import AdminTheaters from './assets/pages/admin/AdminTheaters'
import Theaters from './assets/pages/Theaters'
import AdminUsers from './assets/pages/admin/AdminUsers'

// PROTECTED ROUTE GUARD
const ProtectedRoute = ({ children }) => {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/" replace />
}

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const { user } = useUser()

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        {/* PUBLIC - Browse freely */}
        <Route path='/' element={<Home />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/theaters' element={<Theaters />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/favorite' element={<Favorite />} />

        {/* PROTECTED - Login required */}
        <Route path='/movies/:id/:date' element={
          <ProtectedRoute><SeatLayout /></ProtectedRoute>
        } />
        <Route path='/payment' element={
          <ProtectedRoute><PaymentPage /></ProtectedRoute>
        } />
        <Route path='/my-bookings' element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={user ? <Layout /> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<Addshows />} />
          <Route path="list-shows" element={<Listshows />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="cancelled-bookings" element={<CancelledBookings />} />
          <Route path="theaters" element={<AdminTheaters />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App

