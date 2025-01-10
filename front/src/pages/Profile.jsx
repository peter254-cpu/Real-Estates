import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable }  from 'firebase/storage'
import { app } from '../../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice"
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from "axios"


const Profile = () => {
  const fileRef = useRef()
  const { currentUser } = useSelector((state) => state.user);
  console.log("current user", currentUser)
  const { error, loading } = useSelector((state) =>  state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUplaodError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowLitingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()

  const handleDeleteUser = async () => {
    try {
      deleteUserStart()
      const res = await fetch(`https://realestates-apllication.onrender.com/api/user/delete/${currentUser._id}}`, {
        method: "DELETE",
        credentials: "include",
        headers:{
          "Content-Type": "application/json"
        }
      })
      
      const data = await res.json();
      if(data.success === false){
       dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      deleteUserFailure(error.message)

    }
  }
  const handleSignOut =  async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('https://realestates-apllication.onrender.com/api/auth/logout',
        {
          credentials: "include",
        }
      );
      const data = await res.json()
      if (data.success === false){
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

      /*firebase storage
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')*/
      useEffect(() => {
        if(file){
          handleFileUpload(file)
        }
      }, [file])

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value})
      }

      const handleShowListing = async () => {
        try {
          setFileUplaodError(false)
          const res = await fetch(`https://realestates-apllication.onrender.com/api/user/listings/${currentUser._id}`,
            {
              credentials: "include",
            }
          )
          const data = await res.json();
          if(data.success === false){
            setShowLitingsError(true)
            return
          }
          setUserListings(data)
        } catch (error) {
          setShowLitingsError(true);
        }
      }
   
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          dispatch(updateUserStart())
          const res = await fetch(`https://realestates-apllication.onrender.com/api/user/update/${currentUser._id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          })
          const data = await res.json();
          if (data.success === false){
              dispatch(updateUserFailure(data.message))
              return
          }
          dispatch(updateUserSuccess(data))
          setUpdateSuccess(true)
        } catch (error) {
          dispatch(updateUserFailure(error.message))
        }
      }

      const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const filename = new Date().getTime() + file.name;
        const storageRef = ref(storage, filename)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred /
              snapshot.totalBytes) * 100;
              setFilePerc(Math.round(progress))
        },
        (error) => {
          setFileUplaodError(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, avatar: downloadUrl })
          })
        }
        )
      
}
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`https://realestates-apllication.onrender.com/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json()
      if(data.success === false){
        console.log(data.message)
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
   <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center  my-7'>Profile</h1>
    <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>
      <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          
      />
      <img 
      onClick={() => fileRef.current.click()} 
      src= { formData.avatar || currentUser.avatar } alt='profile'
      className='self-center mt-2 rounded-full h-24 w-24 0bject-cover cursor-pointer'
      
      />
      <p className='text-sm self-center'>
        {fileUploadError ? (
          <span className='text-red-700'>error image upload(image must be less than 2 mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>
                {`Uploading ${filePerc}%`}
            </span> ) :
            filePerc === 100 ?(
              <span className='text-green-700'>Image SuccessFully Uploaded</span>
              ) : (
                ''
              )
        }
      </p>

      <input defaultValue = {currentUser.username} type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
      <input defaultValue = {currentUser.email} type='text' placeholder='email' className='border p-3 rounded-lg' id='email'  onChange={handleChange} />
      <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      <Link to='/create-listing' className = 'bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Success' : ''}</p>
      <button onClick={handleShowListing} className='text-green-700 w-full '>Show Listing</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listing': ''}</p>
      {userListings && userListings.length > 0  &&
       <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-3xl'>Your Listings</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='flex gap-3 justify-between border rounded-lg p-3  items-center'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain '/>
            </Link>
              <Link className='text-slate-700 font-semibold hover:underline truncate flex1' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
        ))}
       </div>}

   </div>
  )
}

export default Profile

