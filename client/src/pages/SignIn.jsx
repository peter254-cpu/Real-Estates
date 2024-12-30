import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import OAuth from '../components/OAuth';


const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({});
 const { error, loading } = useSelector((state) =>  state.user);
  const dispatch = useDispatch()
  const handlehange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      dispatch(signInStart())
      const res = await fetch("https://realestates-apllication.onrender.com/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
       dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/")
  }catch(error){
   dispatch(signInFailure(error.message))
  }
}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email'      onChange={handlehange}  />
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handlehange}  />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:80'>
          {loading ? 'Logging in...': 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'><p>Dont have an account..?</p><Link to={"/sign-up"}><span className='text-blue-700'>Sign up</span></Link> </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignIn
