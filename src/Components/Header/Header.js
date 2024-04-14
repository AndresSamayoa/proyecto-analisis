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
            <Link to='/employee'>Empleados</Link>
            <Link to='/credit'>Creditos</Link>
            <Link to='/customercontact'>Contactos de cliente</Link>
            <Link to='/sale'>Ventas</Link>
            <Link to='/document'>Documentos</Link>
        </div>
    </div>
}

export default Header;
