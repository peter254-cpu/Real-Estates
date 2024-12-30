import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({listing}) => {
    const [landLord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')
    const onChange = (e) => {
      setMessage(e.target.value)
    }
    
    useEffect(() => {
      const fetchLandLord = async () => {
        try {
          const res = await fetch(`https://realestates-apllication.onrender.com/api/user/${listing.userRef}`,{
            credentials: "include",
          })
          const data = await res.json();
          setLandLord(data)
        } catch (error) {
          console.log(error)
        }

      }
      fetchLandLord()
    }, [listing.userRef])
  return (
   <Fragment>
     {landLord && (
      <div className='flex flex-col gap-2'>
        <p>Contact <span className='font-semibold'>{landLord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
        <textarea 
            name='message' 
            id='message' 
            rows="2"  
            value={message} 
            onChange={onChange} 
            placeholder='Enter your Message Here' 
            className='w-full border p-3 rounded-lg mt-2'
        ></textarea>
        <Link to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90'>
          Send Message
        </Link>
      </div>
     )}
   </Fragment>
  )
}

export default Contact
