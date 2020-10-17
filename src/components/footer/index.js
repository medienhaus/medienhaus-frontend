import React from 'react';
import udk from '../../assets/img/udk-berlin.svg'; // with import
/*
import style from './style.css';
*/

const Footer = () => (
  <footer>
    <p className="copyright">&#x1f12f; 2020 <a href="mailto:info@medienhaus.udk-berlin.de?subject=medienhaus/" rel="nofollow noopener noreferrer"><strong>medienhaus/</strong></a></p>
    <img src={udk} alt="Berlin University of the Arts" />
  </footer>
);

export default Footer;
