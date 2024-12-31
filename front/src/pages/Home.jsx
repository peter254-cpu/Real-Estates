import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem'
import axios from "axios"

const Home = () => {
  const [offerListings, setOfferListings] = useState([])
  const [saleListing, setSaleListing] = useState([])
  const [rentListing, setRentListing] = useState([])
  SwiperCore.use([Navigation]);

  console.log(saleListing)

  useEffect(() => {
    const fetchOfferListing = async () =>{
      try {
        const res = await fetch('https://realestates-apllication.onrender.com/api/listing/get?offer=true&limit=3');
        const data = await res.json()
        setOfferListings(data)
        fetchRentListing()
        console.log(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListing = async () => {
      try {
        const res = await fetch('https://realestates-apllication.onrender.com/api/listing/get?rent=true&limit=3');
        const data = await res.json()
        setRentListing(data)
        console.log("listing data", data)
      } catch (error) {
        console.log(error)
      }

    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('https://realestates-apllication.onrender.com/api/listing/get?sale=true&limit=3');
        const data = await res.json()
        setSaleListing(data)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListing()
  }, [])

  return (
    <div>
      {/* top */}
        <div className='flex flex-col gap-6 p-28 px-3 mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find Your Next <span className='text-slate-500'>Perfect</span><br /> Place With Ease</h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Reaslest Estate is the best place to find your next perfect place to live
            <br />
            We have a wide range of properties for you choose from
          </div>
          <Link to = {'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
            Get Started
          </Link>
        </div>

      {/* swiper  */}
      <Swiper navigation>
      {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover"}} className='h-[500px]' key={listing._id}>

            </div>
          </SwiperSlide>

        )) 
      }

      </Swiper>

      {/*Results for offer sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?offer=true'}>Show More Offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Rental Places</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?type=rent'}>Show More Rental Places</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                rentListing.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Sale</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?type=sale'}>Show More Places for Sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                saleListing.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
