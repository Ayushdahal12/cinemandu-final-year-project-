import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { assets } from '../assets';
import { Menu, Search, X, TicketPlus } from 'lucide-react';
import { useSignIn, useSignUp, useUser, useClerk } from '@clerk/clerk-react';
import { useAppContext } from '../../context/appcontext';
import { useSearchParams } from "react-router-dom";  



const CustomUserMenu = () => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className='relative' ref={ref}>
      <img
        src={user?.imageUrl}
        alt="avatar"
        className='w-9 h-9 rounded-full cursor-pointer border-2 border-primary'
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className='absolute right-0 mt-2 w-56 bg-gray-900 border border-primary/30 rounded-2xl shadow-lg overflow-hidden z-50'>
          {/* User Info */}
          <div className='px-4 py-3 border-b border-gray-700'>
            <p className='text-sm font-semibold text-white'>{user?.fullName}</p>
            <p className='text-xs text-gray-400'>{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          {/* Manage Account */}
          <button
            onClick={() => { openUserProfile(); setOpen(false) }}
            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition cursor-pointer'>
            ⚙️ Manage account
          </button>
          {/* My Bookings */}
          <button
            onClick={() => { navigate('/my-bookings'); setOpen(false) }}
            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition cursor-pointer'>
            🎟️ My Bookings
          </button>
          {/* Sign Out */}
          <button
            onClick={() => signOut(() => navigate('/'))}
            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-gray-800 transition cursor-pointer'>
            🚪 Sign out
          </button>
        </div>
      )}
    </div>
  )
}

const Navbar = () => {
  const [isopen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [code, setCode] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useUser()
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const navigate = useNavigate()
  const { favoriteMovies } = useAppContext()

  const resetModal = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setCode('')
    setError('')
    setLoading(false)
    setPendingVerification(false)
  }

  const handleLogin = async () => {
    if (!signInLoaded) return
    try {
      setLoading(true)
      setError('')
      const result = await signIn.create({
        identifier: email,
        password
      })
      if (result.status === 'complete') {
        setShowModal(false)
        resetModal()
        window.location.reload()
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    if (!signUpLoaded) return
    try {
      setLoading(true)
      setError('')
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Sign up failed')
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    if (!signUpLoaded) return
    try {
      setLoading(true)
      setError('')
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        setShowModal(false)
        resetModal()
        window.location.reload()
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Verification failed')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (!signInLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      })
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Google login failed')
    }
  }

  return (
    <>
      <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>

        <Link to='/' className='max-md:flex-1'>
          <img src={assets.logo} alt="logo" className='w-38 h-auto mt-1' />
        </Link>

        <div className={
          `max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
          max-md:text-lg z-50 flex flex-col md:flex-row items-center
          max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
          min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
          border-gray-300/20 overflow-hidden transition-[width] duration-300
          ${isopen ? 'max-md:w-full' : 'max-md:w-0'}`}
          style={{
            border: '1px solid #FFB300',
            boxShadow: window.innerWidth >= 768 ? '0 0 2px rgba(255,179,0,0.6), 0 0 30px rgba(255,179,0,0.4)' : 'none',
          }}>

          <X className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
            onClick={() => setIsOpen(!isopen)} />

          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/'>Home</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/movies'>Movies</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/theaters'>Theaters</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/'>Top Rated</Link>
          {favoriteMovies && favoriteMovies.length > 0 &&
            <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/favorite'>My Picks</Link>
          }
        </div>

        <div className='flex items-center justify-center gap-8'>
          <Search className='max-md:hidden w-6 h-6 cursor-pointer' />
          {!user ? (
            <button
              onClick={() => { setShowModal(true); setIsSignUp(false) }}
              className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
              Login
            </button>
          ) : (
            <CustomUserMenu />
          )}
        </div>

        <Menu className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
          onClick={() => setIsOpen(!isopen)} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm'>
          <div className='bg-gray-900 border border-primary/30 rounded-2xl p-8 w-full max-w-md mx-4 relative'>

            {/* Close Button */}
            <button
              onClick={() => { setShowModal(false); resetModal() }}
              className='absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer'>
              <X className='w-5 h-5' />
            </button>

            {/* Header */}
            <div className='text-center mb-6'>
              <img src={assets.logo} alt="logo" className='w-32 h-auto mx-auto mb-4' />
              {pendingVerification ? (
                <>
                  <h2 className='text-2xl font-bold'>Verify Email</h2>
                  <p className='text-gray-400 text-sm mt-1'>Enter the code sent to {email}</p>
                </>
              ) : isSignUp ? (
                <>
                  <h2 className='text-2xl font-bold'>Create Account</h2>
                  <p className='text-gray-400 text-sm mt-1'>Join Cinemandu today!</p>
                </>
              ) : (
                <>
                  <h2 className='text-2xl font-bold'>Welcome Back!</h2>
                  <p className='text-gray-400 text-sm mt-1'>Login to book your tickets</p>
                </>
              )}
            </div>

            {/* Verification Screen */}
            {pendingVerification ? (
              <>
                <input
                  type='text'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder='Enter verification code'
                  className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition mb-4 text-center tracking-widest text-lg'
                  onKeyDown={(e) => { if (e.key === 'Enter') handleVerify() }}
                />
                {error && <p className='text-red-400 text-sm mb-3 text-center'>{error}</p>}
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className='w-full bg-primary hover:bg-primary-dull transition py-2.5 rounded-xl font-medium cursor-pointer'>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </>
            ) : (
              <>
                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  className='w-full flex items-center justify-center gap-3 bg-white text-black px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition cursor-pointer mb-4'>
                  <img src="https://www.google.com/favicon.ico" alt="google" className='w-5 h-5' />
                  Continue with Google
                </button>

                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex-1 h-px bg-gray-700'></div>
                  <p className='text-gray-500 text-sm'>or</p>
                  <div className='flex-1 h-px bg-gray-700'></div>
                </div>

                {/* Sign Up Extra Fields */}
                {isSignUp && (
                  <div className='flex gap-3 mb-3'>
                    <div className='flex-1'>
                      <label className='text-sm text-gray-400 mb-1 block'>First Name</label>
                      <input
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder='First name'
                        className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
                      />
                    </div>
                    <div className='flex-1'>
                      <label className='text-sm text-gray-400 mb-1 block'>Last Name</label>
                      <input
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Last name'
                        className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className='mb-3'>
                  <label className='text-sm text-gray-400 mb-1 block'>Email</label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
                  />
                </div>

                {/* Password */}
                <div className='mb-4'>
                  <label className='text-sm text-gray-400 mb-1 block'>Password</label>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
                    onKeyDown={(e) => { if (e.key === 'Enter') isSignUp ? handleSignUp() : handleLogin() }}
                  />
                </div>

                {error && <p className='text-red-400 text-sm mb-3 text-center'>{error}</p>}

                {/* Submit Button */}
                <button
                  onClick={isSignUp ? handleSignUp : handleLogin}
                  disabled={loading}
                  className='w-full bg-primary hover:bg-primary-dull transition py-2.5 rounded-xl font-medium cursor-pointer mb-4'>
                  {loading ? (isSignUp ? 'Creating account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
                </button>

                {/* Switch between Login/Signup */}
                <p className='text-center text-sm text-gray-400'>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span
                    onClick={() => { setIsSignUp(!isSignUp); resetModal() }}
                    className='text-primary cursor-pointer hover:underline'>
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </span>
                </p>
              </>
            )}
            
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
