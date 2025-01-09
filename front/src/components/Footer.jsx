import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


const Footer = () => {
    const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="bg-gray-800 text-gray-200 pr-16 pl-16 mt-8 pt-8 pb-8 flex justify-between">
        <div className="flex-1">
            <h2>RealestEstates</h2>
            <p>At RealestEstates we provide a pool to decent homes at your locality within your budget </p>
        </div>
        <div className="flex flex-col items-start flex-1">
            <h3>SiteMap</h3>
                <Link>
                    Home
                </Link>
                <Link>
                    About Us
                </Link>
            {currentUser && (
                <>
                    <Link>
                        Create Listing
                    </Link>
                    <Link>
                        Profile
                    </Link>
                </>
            )}
        </div>
        <div className="flex-1">
        <div class="flex items-center justify-center h-screen">
            <div class="w-full max-w-sm">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                    Sign up for Property Listings Updates
                    </label>
                    <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    />
                </div>
                <div class="flex items-center justify-between">
                    <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    >
                    Sign Up
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Footer