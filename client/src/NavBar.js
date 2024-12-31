import { Link } from "react-router-dom";
// Component renders navigation icons 
const NavBar = () => {
  return (
    <div>
      {/* Home icon */}
      <Link to="/">
        <div className="nav-icon home-icon">
          <img src="/iconsForCommonGround/home-icon.png" alt="Home" />
        </div>
      </Link>

      {/* About icon */}
      <Link to="/about">
        <div className="nav-icon about-icon">
          <img src="/iconsForCommonGround/info-icon.png" alt="About" />
          
        </div>
      </Link>
    </div>
  );
};

export default NavBar;