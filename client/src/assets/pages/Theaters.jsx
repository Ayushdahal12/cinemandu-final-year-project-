// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAppContext } from '../../context/appcontext'
// import BlurCircle from '../components/BlurCircle'
// import { MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react'
// import { useClerk } from '@clerk/clerk-react'
// import toast from 'react-hot-toast'

// const Theaters = () => {
//     const { axios, user } = useAppContext()
//     const { openSignIn } = useClerk()
//     const navigate = useNavigate()
//     const [theaters, setTheaters] = useState([])

//     const fetchTheaters = async () => {
//         try {
//             const { data } = await axios.get('/api/theater/all')
//             if (data.success) {
//                 setTheaters(data.theaters)
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleSelectTheater = () => {
//         if (!user) {
//             toast.error('Please login to book tickets')
//             return openSignIn()
//         }
//         navigate('/movies')
//     }

//     useEffect(() => {
//         fetchTheaters()
//     }, [])

//     return (
//         <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-screen'>
//             <BlurCircle top="100px" left="0px" />
//             <BlurCircle top="400px" right="0px" />

//             <h1 className='text-3xl font-bold mb-2'>Our Theaters</h1>
//             <p className='text-gray-400 mb-10'>Select a theater to view and book shows</p>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 {theaters.map((theater, index) => (
//                     <div key={index} className='bg-black/40 border border-gray-700 rounded-2xl p-6 hover:border-primary/50 hover:bg-primary/5 transition'>
//                         <h2 className='text-xl font-semibold mb-4'>{theater.name}</h2>

//                         <div className='flex flex-col gap-3 text-sm text-gray-400'>
//                             <div className='flex items-center gap-2'>
//                                 <MapPinIcon className='w-4 h-4 text-primary' />
//                                 <p>{theater.address}, {theater.city}</p>
//                             </div>
//                             <div className='flex items-center gap-2'>
//                                 <PhoneIcon className='w-4 h-4 text-primary' />
//                                 <p>{theater.phone}</p>
//                             </div>
//                             <div className='flex items-center gap-2'>
//                                 <ClockIcon className='w-4 h-4 text-primary' />
//                                 <p>{theater.openingTime} - {theater.closingTime}</p>
//                             </div>
//                         </div>

//                         <div className='mt-4 flex items-center justify-between'>
//                             <div className='text-xs bg-primary/20 text-primary px-3 py-1 rounded-full'>
//                                 {theater.screenName} • {theater.totalSeats} Seats
//                             </div>
//                             <button
//                                 onClick={handleSelectTheater}
//                                 className='text-sm bg-primary hover:bg-primary-dull px-4 py-1.5 rounded-full font-medium transition cursor-pointer'>
//                                 {user ? 'View Shows →' : 'Login to Book'}
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//                 {theaters.length === 0 && (
//                     <p className='text-gray-400'>No theaters available</p>
//                 )}
//             </div>
//         </div>
        
//     )
// }

// export default Theaters





import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'  // 👈 NEW: Replace useClerk
import { useAppContext } from '../../context/appcontext'
import BlurCircle from '../components/BlurCircle'
import { MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const Theaters = () => {
    const { axios, user: appUser } = useAppContext()  // 👈 Keep for API
    const { user } = useUser()  // 👈 NEW: Clerk user for auth
    const navigate = useNavigate()
    const [theaters, setTheaters] = useState([])

    const fetchTheaters = async () => {
        try {
            const { data } = await axios.get('/api/theater/all')
            if (data.success) {
                setTheaters(data.theaters)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 👈 NEW: Custom handler for Navbar modal
    const handleSelectTheater = () => {
        if (!user) {
            // Trigger Navbar custom modal
            const redirectUrl = '/movies'  // Go to movies after login
            window.location.href = `/?redirect=${encodeURIComponent(redirectUrl)}`
            return
        }
        navigate('/movies')
    }

    useEffect(() => {
        fetchTheaters()
    }, [])

    return (
        <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-screen'>
            <BlurCircle top="100px" left="0px" />
            <BlurCircle top="400px" right="0px" />

            <h1 className='text-3xl font-bold mb-2'>Our Theaters</h1>
            <p className='text-gray-400 mb-10'>Select a theater to view and book shows</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {theaters.map((theater, index) => (
                    <div key={index} className='bg-black/40 border border-gray-700 rounded-2xl p-6 hover:border-primary/50 hover:bg-primary/5 transition'>
                        <h2 className='text-xl font-semibold mb-4'>{theater.name}</h2>

                        <div className='flex flex-col gap-3 text-sm text-gray-400'>
                            <div className='flex items-center gap-2'>
                                <MapPinIcon className='w-4 h-4 text-primary' />
                                <p>{theater.address}, {theater.city}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <PhoneIcon className='w-4 h-4 text-primary' />
                                <p>{theater.phone}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <ClockIcon className='w-4 h-4 text-primary' />
                                <p>{theater.openingTime} - {theater.closingTime}</p>
                            </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                            <div className='text-xs bg-primary/20 text-primary px-3 py-1 rounded-full'>
                                {theater.screenName} • {theater.totalSeats} Seats
                            </div>
                            <button
                                onClick={handleSelectTheater}
                                className='text-sm bg-primary hover:bg-primary-dull px-4 py-1.5 rounded-full font-medium transition cursor-pointer'
                            >
                                {user ? 'View Shows →' : 'Login to Book'}
                            </button>
                        </div>
                    </div>
                ))}

                {theaters.length === 0 && (
                    <p className='text-gray-400'>No theaters available</p>
                )}
            </div>
        </div>
    )
}

export default Theaters
