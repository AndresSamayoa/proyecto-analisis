import "./Header.css";

import { Link } from 'react-router-dom' 

function Header() {
    return <div className="Header">
        <div className="Title">
            <Link to='/'>Cuentas por cobrar</Link>
        </div>
        <div className="Options">
            <Link to='/'>Link 1</Link>
            <Link to='/'>Link 2</Link>
            <Link to='/'>Link 3</Link>
        </div>
    </div>
}

export default Header;
