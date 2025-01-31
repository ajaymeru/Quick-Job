import React from 'react';
import "../../Styles/PreHome.scss";
import { Link } from 'react-router-dom';
import CommonHome from '../CommonHome/CommonHome';

const PreHome = () => {
  return (
    <div className="prehome">
      <div className="prehome-container">
        <CommonHome />
      </div>
    </div>
  );
};

export default PreHome;
