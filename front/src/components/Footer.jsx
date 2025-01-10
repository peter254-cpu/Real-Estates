import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


const Footer = () => {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div className="bottom-0 items-center">
        <div className="bg-gray-800 text-gray-200 items-center pr-16 pl-16 mt-8 pt-8 pb-8 flex flex-col xl:flex-row justify-between">
            <div className="flex-1 flex items-center xl:items-start flex-col">
                <h2 className="text-2xl font-bold ">RealestEstates</h2>
                <p className="font-md">At RealestEstates we provide a pool to decent homes at your locality within your budget </p>
            </div>
            <div className="flex flex-col items-start flex-1 mt-6 mb-6 xl:ml-16">
                <h3 className="text-2xl font-bold">SiteMap</h3>
                <Link to={"/"}>
                    Home
                </Link>
                <Link to={"/about"}>
                    About Us
                </Link>
                {currentUser && (
                    <>
                        <Link to={"/"}>
                            Create Listing
                        </Link>
                        <Link to={'/profile'}>
                            Profile
                        </Link>
                    </>
                )}
            </div>
            <div className="flex-1">
                    <form>
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                Sign up for Property Listings Updates
                            </label>
                            <div className="flex gap-2 flex-col xl:flex-row xls:flex-row ">
                            <input
                                className="shadow appearance-none border rounded py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 w-1/2 items-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                        </div>
                    </form>
            </div>
        </div>
        </div>
    )
}

export default Footer