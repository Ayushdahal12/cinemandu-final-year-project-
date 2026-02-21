// import React from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { useAppContext } from '../../context/appcontext'
// import toast from 'react-hot-toast'
// import BlurCircle from '../components/BlurCircle'

// const PaymentPage = () => {
//     const { state } = useLocation()
//     const navigate = useNavigate()
//     const { axios, getToken } = useAppContext()

//     const { amount, bookingId } = state || {}

//     const handleEsewa = async () => {
//         try {
//             const token = await getToken()
//             const { data } = await axios.post('/api/booking/esewa-initiate', {
//                 amount,
//                 bookingId
//             }, { headers: { Authorization: `Bearer ${token}` } })

//             if (data.success) {
//                 const form = document.createElement('form')
//                 form.method = 'POST'
//                 form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

//                 const fields = {
//                     amount: data.amount,
//                     tax_amount: 0,
//                     total_amount: data.amount,
//                     transaction_uuid: data.transaction_uuid,
//                     product_code: data.product_code,
//                     product_service_charge: 0,
//                     product_delivery_charge: 0,
//                     success_url: `${window.location.origin}/payment-success`,
//                     failure_url: `${window.location.origin}/my-bookings`,
//                     signed_field_names: 'total_amount,transaction_uuid,product_code',
//                     signature: data.signature
//                 }

//                 Object.entries(fields).forEach(([key, value]) => {
//                     const input = document.createElement('input')
//                     input.type = 'hidden'
//                     input.name = key
//                     input.value = value
//                     form.appendChild(input)
//                 })
                

//                 document.body.appendChild(form)
//                 form.submit()
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     const handleDummy = () => {
//         toast("This payment method is not available yet!")
//     }

//     return (
//         <div className='min-h-screen flex items-center justify-center px-6 py-40'>
//          <BlurCircle top="150px" left="0px" />
//          <BlurCircle bottom="-230px" right="250px" />
//             <div className='bg-black/40 border border-gray-700 rounded-2xl p-10 w-full max-w-lg'>

//                 {/* Header */}
//                 <h1 className='text-3xl font-bold mb-2 text-center'>Complete Payment</h1>
//                 <p className='text-gray-400 text-center mb-8'>Choose your preferred payment method</p>
                

//                 {/* Amount Box */}
//                 <div className='bg-primary/10 border border-primary/20 rounded-xl p-6 mb-10 text-center'>
//                     <p className='text-gray-400 text-sm mb-1'>Total Amount</p>
//                     <p className='text-4xl font-bold text-primary mt-1'>NPR {amount}</p>
//                     <p className='text-gray-500 text-xs mt-2'>Inclusive of all taxes</p>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className='flex flex-col gap-4 mb-10'>

//                     {/* eSewa - Active */}
//                     <button
//                         onClick={handleEsewa}
//                         className='flex items-center gap-4 p-5 bg-green-600/10 border border-green-500/40 rounded-xl hover:bg-green-600/20 hover:border-green-500/70 transition cursor-pointer group'
//                     >
//                         <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>e</div>
//                         <div className='text-left flex-1'>
//                             <p className='font-semibold text-base'>eSewa</p>
//                             <p className='text-xs text-gray-400'>Pay securely with eSewa digital wallet</p>
//                         </div>
//                         <span className='text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium'>Pay Now →</span>
//                     </button>

//                     {/* Khalti - Dummy */}
//                     <button
//                         onClick={handleDummy}
//                         className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
//                     >
//                         <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>K</div>
//                         <div className='text-left flex-1'>
//                             <p className='font-semibold text-base'>Khalti</p>
//                             <p className='text-xs text-gray-400'>Pay with Khalti digital wallet</p>
//                         </div>
//                     </button>

//                     {/* Mobile Banking - Dummy */}
//                     <button
//                         onClick={handleDummy}
//                         className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
//                     >
//                         <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>M</div>
//                         <div className='text-left flex-1'>
//                             <p className='font-semibold text-base'>Mobile Banking</p>
//                             <p className='text-xs text-gray-400'>Pay directly from your bank account</p>
//                         </div>
//                     </button>

//                     {/* Cash - Dummy */}
//                     <button
//                         onClick={handleDummy}
//                         className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
//                     >
//                         <div className='w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>₨</div>
//                         <div className='text-left flex-1'>
//                             <p className='font-semibold text-base'>Cash</p>
//                             <p className='text-xs text-gray-400'>Pay at the counter before the show</p>
//                         </div>
//                     </button>
//                 </div>

//                 {/* Go Back */}
//                 <button
//                     onClick={() => navigate(-1)}
//                     className='w-full py-3 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition'
//                 >
//                     ← Go Back
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default PaymentPage




import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appcontext'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'

const PaymentPage = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { axios, getToken } = useAppContext()

    const { amount, bookingId } = state || {}

    const handleEsewa = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/booking/esewa-initiate', {
                amount,
                bookingId
            }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                const form = document.createElement('form')
                form.method = 'POST'
                form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

                const fields = {
                    amount: data.amount,
                    tax_amount: 0,
                    total_amount: data.amount,
                    transaction_uuid: data.transaction_uuid,
                    product_code: data.product_code,
                    product_service_charge: 0,
                    product_delivery_charge: 0,
                    success_url: `${window.location.origin}/payment-success`,
                    failure_url: `${window.location.origin}/my-bookings`,
                    signed_field_names: 'total_amount,transaction_uuid,product_code',
                    signature: data.signature
                }

                Object.entries(fields).forEach(([key, value]) => {
                    const input = document.createElement('input')
                    input.type = 'hidden'
                    input.name = key
                    input.value = value
                    form.appendChild(input)
                })

                document.body.appendChild(form)
                form.submit()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDummy = () => {
        toast("This payment method is not available yet!")
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-6 py-40'>
         <BlurCircle top="150px" left="0px" />
         <BlurCircle bottom="-230px" right="250px" />
            <div className='bg-black/40 border border-gray-700 rounded-2xl p-10 w-full max-w-lg'>

                {/* Header */}
                <h1 className='text-3xl font-bold mb-2 text-center'>Complete Payment</h1>
                <p className='text-gray-400 text-center mb-8'>Choose your preferred payment method</p>

                {/* Amount Box */}
                <div className='bg-primary/10 border border-primary/20 rounded-xl p-6 mb-10 text-center'>
                    <p className='text-gray-400 text-sm mb-1'>Payment to</p>
                    <p className='text-white font-bold text-lg mb-3'>🎬 Cinemandu Pvt. Ltd.</p>
                    <p className='text-gray-400 text-sm mb-1'>Total Amount</p>
                    <p className='text-4xl font-bold text-primary mt-1'>NPR {amount}</p>
                    <p className='text-gray-500 text-xs mt-2'>Inclusive of all taxes</p>
                </div>

                {/* Payment Methods */}
                <div className='flex flex-col gap-4 mb-10'>

                    {/* eSewa - Active */}
                    <button
                        onClick={handleEsewa}
                        className='flex items-center gap-4 p-5 bg-green-600/10 border border-green-500/40 rounded-xl hover:bg-green-600/20 hover:border-green-500/70 transition cursor-pointer group'
                    >
                        <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>e</div>
                        <div className='text-left flex-1'>
                            <p className='font-semibold text-base'>eSewa</p>
                            <p className='text-xs text-gray-400'>Pay securely with eSewa digital wallet</p>
                        </div>
                        <span className='text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium'>Pay Now →</span>
                    </button>

                    {/* Khalti - Dummy */}
                    <button
                        onClick={handleDummy}
                        className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
                    >
                        <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>K</div>
                        <div className='text-left flex-1'>
                            <p className='font-semibold text-base'>Khalti</p>
                            <p className='text-xs text-gray-400'>Pay with Khalti digital wallet</p>
                        </div>
                    </button>

                    {/* Mobile Banking - Dummy */}
                    <button
                        onClick={handleDummy}
                        className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
                    >
                        <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>M</div>
                        <div className='text-left flex-1'>
                            <p className='font-semibold text-base'>Mobile Banking</p>
                            <p className='text-xs text-gray-400'>Pay directly from your bank account</p>
                        </div>
                    </button>

                    {/* Cash - Dummy */}
                    <button
                        onClick={handleDummy}
                        className='flex items-center gap-4 p-5 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800/60 transition cursor-pointer opacity-50'
                    >
                        <div className='w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white text-lg'>₨</div>
                        <div className='text-left flex-1'>
                            <p className='font-semibold text-base'>Cash</p>
                            <p className='text-xs text-gray-400'>Pay at the counter before the show</p>
                        </div>
                    </button>
                </div>

                {/* Go Back */}
                <button
                    onClick={() => navigate(-1)}
                    className='w-full py-3 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition'
                >
                    ← Go Back
                </button>
            </div>
        </div>
    )
}

export default PaymentPage