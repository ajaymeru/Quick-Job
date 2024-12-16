import React from 'react'
import "../../Styles/CommonHome.scss"
import { FaSearch } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import microsoft from "../../assets/microsoft.png"
import google from "../../assets/google.png"
import amazon from "../../assets/amazon.png"
import dell from "../../assets/dell.png"
import suite from "../../assets/suite.png"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import testimonialsData from '../../Data/Testimonial.json';


const CommonHome = () => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }
    return (
        <div className='CommonHome'>
            <div className="circlerotaterandsform">
                <div className="content">
                    <div className="heading">
                        <p>We Have 208,000+ Live Jobs</p>
                        <p>Your <span>Dream</span> Job Is Waiting For You</p>
                    </div>
                    <div className="searchform">
                        <p>Type your keywork, then click search to find your perfect job.</p>
                        <div className="form">
                            <form action="">
                                <div className="formgroup">
                                    <FaSearch />
                                    <input type="text" placeholder='Job, Title, Keywords' />
                                </div>
                                <div className="formgroup">
                                    <MdMyLocation />
                                    <input type="text" placeholder='City' />
                                </div>
                                <div className="formgroup">
                                    <input type="submit" value="Find Job" />
                                </div>
                            </form>
                        </div>
                        <p>Popular Searches :
                            Designer, Senor, Architecture, IOS, Etc.</p>
                    </div>
                </div>
                <div className="circlerotater">
                    <div className="firstcircle">
                        <img src={microsoft} alt="" style={{ right: "15px" }} />
                        <img src={google} alt="" style={{ left: "15px" }} />
                    </div>
                    <div className="secondcircle">
                        <img src={amazon} alt="" style={{ top: "-10px" }} />
                        <img src={dell} alt="" style={{ bottom: "-10px" }} />
                    </div>
                    <div className="suite">
                        <img src={suite} alt="" />
                    </div>
                </div>
            </div>

            <div className="Testimonial">
                <div className="TestimonialsText">
                    <p>Clients Testimonials</p>
                    <h4>What People Are Saying About Us</h4>
                    <p>There are many variations of passages available, but most have suffered alteration in some form by injected humour or randomised words.</p>
                </div>
                <Slider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className='TestimonialCard'>
                            <div className="userimg">
                                <img src={testimonial.imagesrc} alt={testimonial.name} />
                            </div>
                            <div className="userinfo">
                                <h3>{testimonial.name}</h3>
                                <h5>With us for {testimonial.time_with_us}</h5>
                                <p>{testimonial.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

        </div>
    )
}

export default CommonHome