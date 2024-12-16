import React from 'react'
import "../Styles/Footer.scss"
import logo from "../assets/logobg.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__logo">
        <img src={logo} alt="Company Logo" />
        <p>Your go-to place for finding jobs and companies.</p>
      </div>

      <div className="footer__links">
        <h2>Useful Links</h2>
        <ul>
          <li><a href="/findjobs">Find a Job</a></li>
          <li><a href="/findcompanies">Companies</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/postjob">Post a Job</a></li>
          <li><a href="/testimonials">Testimonials</a></li>
        </ul>
      </div>

      <div className="footer__categories">
        <h2>Categories</h2>
        <ul>
          <li><a href="/categories/ui-designer">UI Designer</a></li>
          <li><a href="/categories/ux-designer">UX Designer</a></li>
          <li><a href="/categories/graphic-designer">Graphic Designer</a></li>
          <li><a href="/categories/web-developers">Web Developers</a></li>
          <li><a href="/categories/more">More</a></li>
        </ul>
      </div>

      <div className="footer__newsletter">
        <h2>Newsletter</h2>
        <form>
          <input type="email" placeholder="Your email" required />
          <button type="submit">Submit</button>
        </form>
        <div className="footer__socials">
          <h2>Follow Us</h2>
          <div className="links">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer