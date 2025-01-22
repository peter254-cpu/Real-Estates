import { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch('https://realestates-apllication.onrender.com/api/auth/google', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
         },
         body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");

    } catch (error) {
      console.log('Could not sign in with Google', error);
      setError('Could not sign in with Google. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleClick}
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Continue With Google'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
