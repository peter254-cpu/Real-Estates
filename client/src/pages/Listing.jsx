import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'
import { FaMapMarkedAlt, FaShare, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa'


const Listing = () => {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState(false)
    const [contact, setContact] = useState(false)
    const {currentUser} = useSelector((state) => state.user)
    console.log(listing)


    useEffect(() => {
        try {
            setLoading(true)
            const fetchListing = async () => {
                const res = await fetch(`https://realestates-apllication.onrender.com/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success === false){
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            }
            fetchListing()
        
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    }, [params.ListingId])
  return <main>
    {loading && <p className='text-center my-7'>Loading...</p>}
    {error && <p className='text-center my-7'>Something went wrong</p>}
    {listing && !loading && !error && (
        <Fragment>
            <Swiper navigation >
                {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[550px]'
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover'
                        }}></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare 
                    className="text-slate-500"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true)
                        setTimeout(() => {
                            setCopied(false)
                        }, 2000)
                    }}
                />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 -2'>
                        Link Copied
                    </p>
                )}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                    {listing.name} -${''}
                    {listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-Us')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                <p className='flex items-center mt-6 gap-2 text-slate-600 my-2'>
                    <FaMapMarkedAlt className='text-green-700' />
                    {listing.address}
                </p>
                <div className='flex gap-4'>
                    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </p>
                    {
                        listing.offer && (
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>${listing.regularPrice - listing.discountPrice}
                            <span className='font-bold'> Off</span></p>
                        )
                    }
                    </div>
                <p className='text-slate-800'>
                <span className='font-semibold text-black'>
                Description - {listing.description}
                </span>
                </p>
                <ul className='flex items-center gap-4 sm:gap-6'>
                    <li className='flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm'>
                        <FaBed className='text-lg ' />
                            {listing.bedrooms > 1 ? `${listing.bedrooms}beds` : `${listing.bedrooms} bed`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm flex-wrap'>
                        <FaBath className='text-lg ' />
                            {listing.bathrooms > 1 ? `${listing.bathrooms}baths` : `${listing.bedrooms} bath`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm'>
                        <FaParking className='text-lg ' />
                           {listing.parking ? 'Parking'  : 'No Parking'}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap text-green-900 font-semibold text-sm'>
                        <FaChair className='text-lg ' />
                           {listing.furnished ? 'Furnished' : 'UnFurnished'}
                    </li>
                </ul>
                {currentUser && listing.userRef !== currentUser._id  && !contact &&(
                    <button onClick={() => setContact(true)} className='bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95%'>Contact Landlord</button>
                )}
                {contact && <Contact listing = {listing}/>}
                </div>
        </Fragment>
    )}
  </main>
}

export default Listing
