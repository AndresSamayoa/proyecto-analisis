import './SaleDetailForm.css';

import SearchInput from '../SearchInput/SearchInput';

function SaleDetailForm (props) {
    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    const cancelForm = (e) => {
        e.preventDefault();
        props.setCantidad(0);
        props.setChangeDescuento(0);
        props.setSubtotal(0);
    }

    const changeCantidad = (e) =>{
        props.setCantidad(e.target.value);
    }

    const changeDescuento = (e) =>{
        props.setDescuento(e.target.value);
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
            <SearchInput
                label="Producto (buscar por codigo)"
                value={props.valorBuscadorProducto}
                setValue={props.setValorBuscadorProducto}
                searchValueFunction={props.searchProducto}
                messageSearch={props.mensajeBusquedaProducto}
            />
            <div className="inputContainer">
                <label>Cantidad</label>
                <input type="number" id="txtCantidad" value={props.cantidad} onChange={changeCantidad}/>
            </div>
            <div className="inputContainer">
                <label>Descuento</label>
                <input type="number" id="txtDescuento" value={props.descuento} onChange={changeDescuento}/>
            </div>
            <div className="inputContainer">
                <input type="submit" value={props.detalleVentaId > 0 ? "Actualizar" : "Crear"} />
                <input type="submit" value="Cancelar" onClick={cancelForm}/>
            </div>
        </form>
    </div>
}

export default  SaleDetailForm;
