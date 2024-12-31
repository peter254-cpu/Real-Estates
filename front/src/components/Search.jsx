import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from './ListingItem'

const Search = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    console.log('Listings', listings)
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "created_at",
        order: "desc"
    })
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        if(
          urlParams ||
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||
          offerFromUrl ||
          sortFromUrl ||
          orderFromUrl 
        ) {
          setSideBarData({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true' ? true : false,
          furnished: furnishedFromUrl === 'true' ? true : false,
          offer: offerFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc'
          })
        }
        const fetchListings = async () => {
          setLoading(true)
          const searchQuery = urlParams.toString()
          const res = await fetch(`https://realestates-apllication.onrender.com/api/listing/get?${searchQuery}`)
          const data =  await res.json()
          setListings(data);
          setLoading(false)
        }
        fetchListings()
    }, [location.search])
    
   


    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent'){
            setSideBarData({...sideBarData, type: e.target.id})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished'){
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSideBarData({...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[0] || 'desc';
            setSideBarData({ ...sideBarData, sort, order })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams();
        urlParams.set('serchTerm', sideBarData.searchTerm)
        urlParams.set('type', sideBarData.type)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('furnished', sideBarData.furnished)
        urlParams.set('offer', sideBarData.offer)
        urlParams.set('sort', sideBarData.sort)
        urlParams.set('order', sideBarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)

    }


  return (
    <div className='flex flex-col  md:flex-row'>
      <div className='p-7 border-b-2 sm:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8' onClick={handleSubmit}>
            <div className='flex items-center gap-2'>
                 <label className="font-semiboldwhitespace-nowrap font-semibold"
                >Search Term</label>
                <input
                type='text'
                id='searchTerm'
                placeholder='Search'
                className='border rounded-lg p-3 w-full'
                onChange={handleChange}
                value={sideBarData.searchTerm}
                />
            </div>
            <div
                className='flex  gap-2 flex-wrap items-center'
            >
             <label className="font-semibold">Type:</label>
            <div className='flex gap-2'>
              <input
                    className='w-5'
                    type='checkbox'
                    id='all'
                    checked={sideBarData.type === 'all'}
                    onChange={handleChange}
                    />
                    <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                    className='w-5'
                    type='checkbox'
                    id='rent'
                    onChange={handleChange}
                    checked={sideBarData.type === 'rent'}
                    />
                    <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                    className='w-5'
                    type='checkbox'
                    id='sale'
                    onChange={handleChange}
                    checked = {sideBarData.type === "sale"}
                    />
                    <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                    className='w-5'
                    type='checkbox'
                    id='offer' 
                    onChange={handleChange}
                    checked= {sideBarData.offer}
                    />
                    <span>offer</span>
            </div>
            </div>

            <div
            className='flex  gap-2 flex-wrap items-center'
        >
         <label className="font-semibold">Amenities:</label>
        <div className='flex gap-2'>
          <input
                className='w-5'
                type='checkbox'
                id='parking'
                onChange={handleChange}
                checked={sideBarData.parking}
                />
                <span>Parking</span>
        </div>
        <div className='flex gap-2'>
          <input
                className='w-5'
                type='checkbox'
                id='furnished'
                onChange={handleChange}
                checked={sideBarData.furnished}
                />
                <span>Furnished</span>
        </div>
        </div>
        <div className='flex items-center gap-2'>
             <label className="font-semibold">Sort:</label>
            <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className=' rounded-lg p-3'
            >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
            </select>
        </div>
            <button className='bg-slate-700 p-3 text-white uppercase text-semibold'>Search</button>
        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border p-3 text-slate-700 mt-5'>Listing Results</h1>
        <div className='p-7 gap-4 flex flex-wrap'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No Listing Found!</p>
          )}
          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
