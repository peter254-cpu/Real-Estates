import { useEffect, useState } from 'react'
import ListingItem from '../components/ListingItem'

const RentListing = () => {
    const [rentListing, setRentListing] = useState([])
    useEffect(() => {
        const fetchSaleListings = async () => {
            try {
              const res = await fetch('https://realestates-apllication.onrender.com/api/listing/get?sale=true');
              const data = await res.json()
              setRentListing(data)
            } catch (error) {
              console.log(error)
            }
          }
          fetchSaleListings()
    }, [])
  return (
    <div className="max-w-full items-center flex justify-center ">
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10  items-center">
        {rentListing && rentListing.length > 0 && (
          <div className='flex items-center flex-wrap flex-col w-full'>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Looking to rent a place..?</h2>
            </div>
            <div className='flex w-full items-center flex-wrap gap-4'>
              {
                rentListing.map((listing) => (
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

export default RentListing