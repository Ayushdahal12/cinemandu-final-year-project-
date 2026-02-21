import React, { useState, useEffect } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeformat'
import { dateFormat } from '../lib/Dateformat'
import { useAppContext } from '../../context/appcontext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, user, image_base_url } = useAppContext()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [swapData, setSwapData] = useState({ bookingId: null, oldSeat: null })

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleCancel = async (bookingId) => {
    try {
      const { data } = await axios.post('/api/booking/cancel', { bookingId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        getMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSwap = async (newSeat) => {
    try {
      if (!swapData.bookingId || !swapData.oldSeat) {
        return toast.error('Select a seat to swap first')
      }
      const { data } = await axios.post('/api/booking/swap-seat', {
        bookingId: swapData.bookingId,
        oldSeat: swapData.oldSeat,
        newSeat
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        setSwapData({ bookingId: null, oldSeat: null })
        getMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDownloadTicket = async (item) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 130]
      })

      doc.setFillColor(15, 15, 15)
      doc.rect(0, 0, 80, 130, 'F')

      doc.setFillColor(225, 29, 72)
      doc.rect(0, 0, 80, 14, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('CINEMANDU', 40, 9, { align: 'center' })

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(item.show.movie.title, 40, 22, { align: 'center' })

      doc.setDrawColor(55, 65, 81)
      doc.line(5, 27, 75, 27)

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')

      doc.setTextColor(156, 163, 175)
      doc.text('DATE & TIME', 8, 34)
      doc.setTextColor(255, 255, 255)
      doc.text(dateFormat(item.show.showDateTime), 8, 39)

      doc.setTextColor(156, 163, 175)
      doc.text('SEATS', 8, 47)
      doc.setTextColor(255, 255, 255)
      doc.text(item.bookedSeats.join(', '), 8, 52)

      doc.setTextColor(156, 163, 175)
      doc.text('TOTAL TICKETS', 8, 60)
      doc.setTextColor(255, 255, 255)
      doc.text(item.bookedSeats.length.toString(), 8, 65)

      doc.setTextColor(156, 163, 175)
      doc.text('AMOUNT PAID', 8, 73)
      doc.setTextColor(225, 29, 72)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`NPR ${item.amount}`, 8, 79)

      doc.setDrawColor(55, 65, 81)
      doc.setLineDashPattern([2, 2], 0)
      doc.line(5, 85, 75, 85)

      const qrData = `BookingID:${item._id}|Movie:${item.show.movie.title}|Seats:${item.bookedSeats.join(',')}|Amount:NPR${item.amount}`
      const qrDataUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 1 })
      doc.addImage(qrDataUrl, 'PNG', 25, 89, 30, 30)

      doc.setLineDashPattern([], 0)
      doc.setTextColor(156, 163, 175)
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.text('Scan QR code at cinema entrance', 40, 124, { align: 'center' })
      doc.text('Thank you for booking with Cinemandu!', 40, 128, { align: 'center' })

      doc.save(`Cinemandu-Ticket-${item.show.movie.title}.pdf`)
      toast.success('Ticket downloaded!')
    } catch (error) {
      toast.error('Failed to download ticket')
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      getMyBookings()
    }
  }, [user])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.length === 0 && (
        <p className='text-gray-400 text-center mt-20'>No bookings found!</p>
      )}

      {bookings
        .filter(item => item.show && item.show.movie)
        .map((item, index) => (
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>

          {/* Movie Info */}
          <div className='flex flex-col md:flex-row'>
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt=""
              className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
            />
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{item.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
            <div className='flex items-center gap-2 flex-wrap justify-end'>
              <p className='text-2xl font-semibold mb-3'>{currency} {item.amount}</p>

              {!item.isPaid && (
                <>
                  <button
                    onClick={() => navigate('/payment', { state: { amount: item.amount, bookingId: item._id } })}
                    className='bg-primary hover:bg-primary-dull px-4 py-1.5 mb-1 text-sm rounded-full font-medium cursor-pointer transition'>
                    Pay Now
                  </button>
                  <p className='w-full text-xs text-yellow-400 mb-2 text-right'>
                    ⚠️ Ticket expires in 10 minutes if not paid!
                  </p>
                </>
              )}

              {item.isPaid && (
                <>
                  <button
                    onClick={() => handleCancel(item._id)}
                    className='bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer hover:bg-red-500/30 transition'>
                    Cancel
                  </button>

                  <button
                    onClick={() => handleDownloadTicket(item)}
                    className='bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer hover:bg-green-500/30 transition'>
                    Download Ticket
                  </button>

                  <select
                    onChange={(e) => setSwapData({ bookingId: item._id, oldSeat: e.target.value })}
                    className='bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'
                    defaultValue="">
                    <option value="" disabled>Select seat to swap</option>
                    {item.bookedSeats.map(seat => (
                      <option key={seat} value={seat}>{seat}</option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
              <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(', ')}</p>
              <p>
                <span className='text-gray-400'>Status: </span>
                <span className={item.isPaid ? 'text-green-400' : 'text-yellow-400'}>
                  {item.isPaid ? '✅ Paid' : '⏳ Pending'}
                </span>
              </p>
            </div>

            {/* Swap Input Box */}
            {swapData.bookingId === item._id && (
              <div className='mt-3 text-left'>
                <p className='text-xs text-gray-400 mb-2'>Enter new seat to swap to:</p>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='e.g. A1, B3'
                    className='bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm outline-none w-24'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSwap(e.target.value.toUpperCase())
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousSibling
                      handleSwap(input.value.toUpperCase())
                    }}
                    className='bg-blue-500 px-3 py-1 text-sm rounded font-medium cursor-pointer'>
                    Swap
                  </button>
                  <button
                    onClick={() => setSwapData({ bookingId: null, oldSeat: null })}
                    className='bg-gray-700 px-3 py-1 text-sm rounded font-medium cursor-pointer'>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : <Loading />
}

export default MyBookings