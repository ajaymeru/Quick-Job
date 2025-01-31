import React, { useEffect, useState } from 'react'
import "../../Styles/CommonHome.scss"
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
import axios from 'axios';
import { FaUserPlus, FaSearch, FaFileUpload, FaHandshake } from 'react-icons/fa';


const CommonHome = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [employerImages, setEmployerImages] = useState([])
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchEmployerImages = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}api/employee/employer-images`, {
                    params: { page }
                });
                if (response.data.images.length === 0) {
                    setHasMore(false); 
                } else {
                    setEmployerImages(prevImages => [...prevImages, ...response.data.images]);
                }
                console.log("Valid employer images fetched:", response.data.images);
            } catch (error) {
                console.error("Error fetching employer images:", error);
            }
        };
        if (hasMore) {
            fetchEmployerImages();
        }
        const interval = hasMore ? setInterval(() => {
            setPage(prevPage => prevPage + 1);
        }, 5000) : null;

        return () => interval && clearInterval(interval);
    }, [page, hasMore]);

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
    const companiesImages = {
        infinite: true,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 750,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,

                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
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
                        <p>Your <span>Dream</span> Job Is <br /> Waiting For You</p>
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

            <div className="PopularCompanies">
                <div className="scrolling-wrapper">
                    <Slider {...companiesImages}>
                        {employerImages.map((employerImage, index) => (
                            <img key={index} src={employerImage.profileImage} alt="" />
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="steps-to-follow">
                <p>How It Works</p>
                <h4>Follow Easy 4 Steps</h4>
                <div className="steps">
                    <div className="step">
                        <div className="icon-box">
                            <FaUserPlus className="step-icon" />
                            <div className="step-number">1</div>
                        </div>
                        <h5>Register</h5>
                        <p>Register your account online</p>
                    </div>
                    <div className="step">
                        <div className="icon-box">
                            <FaSearch className="step-icon" />
                            <div className="step-number">2</div>
                        </div>
                        <h5>Search</h5>
                        <p>Search for jobs that suits you</p>
                    </div>
                    <div className="step">
                        <div className="icon-box">
                            <FaFileUpload className="step-icon" />
                            <div className="step-number">3</div>
                        </div>
                        <h5>Apply</h5>
                        <p>Apply for your job, and wait for the employer</p>
                    </div>
                    <div className="step">
                        <div className="icon-box">
                            <FaHandshake className="step-icon" />
                            <div className="step-number">4</div>
                        </div>
                        <h5>Get Hired</h5>
                        <p>Get hired by the employer</p>
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