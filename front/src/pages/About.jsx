import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { clientReviews } from '../../constants';

const About = () => {
  SwiperCore.use([Navigation]);

  return (
    <main className='py-20 px-4 max-w-6xl mx-auto w-full'>
      <section className='mt-4'>
        <h2 className='text-center  text-3xl font-bold text-slate-800 '>About Realest Estate</h2>
        <div className='flex xl:flex-row flex-col-reverse md:flex-row 2xl:flex-row  gap-4 items-center h-full mt-8'>
          <div className='flex-1'>
            <p className='mb-4 text-slate-700'>
              <span className='text-xl'>
                16 Years Of Delivering an active market with consistency  .
              </span>
                Realestestate brings buyers of properties and sellers together ensuring that it work for everyone.
                Weather You are looking for a place to stay or a place to set up your bussiness we've got you covered 
            </p>
            <p className='mb-4 text-slate-700'>
                Realestestate brings buyers of properties and sellers together ensuring that it work for everyone.
                Weather You are looking for a place to stay or a place to set up your bussiness we've got you covered
            </p>
          </div>
          <div className='flex-1'>
            <img src='/bed.jpg' className='rounded-md' />
          </div>
        </div>
      </section>
      <section className='mt-16 w-full h-full '>
        <h2 className='text-center  text-3xl font-bold text-slate-800 '>What Other Think About RealestEstates</h2>
        {/* swiper  */}
        <Swiper navigation>
          {
            clientReviews.map((review) => (
              <SwiperSlide>
                <div className="mt-8 flex flex-col items-center w-full gap-4">
                  <div>
                    <img src={review.img} alt="profile picture" />
                  </div>
                  <div className="text-2xl font-bold  text-slate-800 ">{review.name}</div>
                  <div className="font-md text-xl  text-slate-800">{review.position}</div>
                  <div className="font-normal text-center  text-slate-700">
                    {review.review}
                  </div>
                </div>
              </SwiperSlide>
            ))
          }

        </Swiper>
      </section>
    </main>
  )
}

export default About
