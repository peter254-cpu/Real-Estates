import { clientReviews } from "../../constants"

const ReviewComponent = () => {
  return (
    <div className="mt-8 flex flex-col items-center w-full gap-4">
       <div>
        <img src="/review1.png" alt="profile picture" />
       </div>
       <div className="text-2xl font-bold ">Mark Rogers</div>
       <div className="font-md text-xl">Founder of TechGear Shop</div>
       <div className="font-normal text-center">Realest estates is an amazing site..! I mean after alot of hustles to get a house it took me only a few clicks to get to the owner of the home of my dreams not even a broker the real owner.</div>
    </div>
  )
}

export default ReviewComponent