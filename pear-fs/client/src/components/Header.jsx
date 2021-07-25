import Fruit from "./Fruit";
import "./Header.css";

const Header = () => {
  return (
    <header className="active">
      <div className="logo-wrapper">
        <Fruit name="green-pear" className="logo" />
        <p className="slogan">p2p file share</p>
      </div>
    </header>
  );
};

export default Header;
