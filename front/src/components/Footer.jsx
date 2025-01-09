import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


const Footer = () => {
    const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="bg-gray-800 text-gray-200 pr-16 pl-16 mt-8 pt-8 pb-8 flex justify-between">
        <div>
            <h2>RealestEstates</h2>
            <p>At RealestEstates we provide a pool to decent homes at your locality within your budget </p>
        </div>
        <div className="flex flex-col items-start ">
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
        <div>
            <h3>Subscribe to get updates of listings near you</h3>
        </div>
    </div>
  )
}

export default Footer