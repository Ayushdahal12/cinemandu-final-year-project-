import React, { useEffect, useState } from 'react';
import Title from './Title';
import Loading from '../../components/Loading';

import { dummyBookingData } from '../../assets';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../../context/appcontext';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      // Corrected the endpoint to fetch bookings instead of shows
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      // Corrected the state setter to match your 'bookings' state
      // Assuming the API returns an object with a 'bookings' array
      setBookings(data.bookings); 
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      // Changed setLoading to setIsLoading to match your useState
      // Moved to finally so it stops loading even if the request fails
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings && bookings.length > 0 ? (
              bookings.map((item, index) => (
                <tr key={index} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                  <td className="p-2 min-w-45 pl-5">{item.user.name}</td>
                  <td className="p-2">{item.show.movie.title}</td>
                  <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
                  <td className="p-2">{Object.keys(item.bookedSeats).join(", ")}</td>
                  <td className="p-2">{currency} {item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-400">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />;
};

export default ListBookings;