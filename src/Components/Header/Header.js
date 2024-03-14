import "./Header.css";

import { Link } from 'react-router-dom' 

function Header() {
    return <div className="Header">
        <div className="Title">
            <Link to='/'>Cuentas por cobrar</Link>
        </div>
        <div className="Options">
            <Link to='/customer'>Clientes</Link>
            <Link to='/product'>Productos</Link>
            <Link to='/'>Link 3</Link>
        </div>
    </div>
}

export default Header;
