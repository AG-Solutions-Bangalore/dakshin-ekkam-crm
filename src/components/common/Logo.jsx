import React from "react";
import logoImg from "../../assets/img/logo.png";

const Logo = () => {
  return (
    <div className="flex justify-center">
      <img src={logoImg} alt="Dakshin Ekkam Logo" className="w-auto" />
    </div>
  );
};

export default Logo;
