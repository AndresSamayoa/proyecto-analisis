import './SaleForm.css';

import SearchInput from '../SearchInput/SearchInput';

function SaleForm (props) {
    const cancelForm = (e) => {
        e.preventDefault();
        props.setNumeroAutorizacion('');
        props.setCondicionPago('');
    }
    
    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    const changeNumeroAutorizacion = (e) =>{
        props.setNumeroAutorizacion(e.target.value);
    }

    const changeCondicionPago = (e) =>{
        props.setCondicionPago(e.target.value);
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
            <SearchInput
                label="Cliente (buscar por email o codigo)"
                value={props.valorBuscadorCliente}
                setValue={props.setValorBuscadorCliente}
                searchValueFunction={props.searchCliente}
                messageSearch={props.mensajeBusquedaCliente}
            />
            <SearchInput
                label="Empleado (buscar por email o codigo)"
                value={props.valorBuscadorEmpleado}
                setValue={props.setValorBuscadorEmpleado}
                searchValueFunction={props.searchEmpleado}
                messageSearch={props.mensajeBusquedaEmpleado}
            />
            <div className="inputContainer">
                <label>Numero autorizacion</label>
                <input type="text" id="txtNumeroAutorizacion" value={props.numeroAutorizacion} onChange={changeNumeroAutorizacion}/>
            </div>
            <div className="inputContainer">
                <label>Condicion de pago</label>
                <select id="cbTipo"  value={props.condicionPago} onChange={changeCondicionPago}>
                    <option>persona</option>
                    <option>juridico</option>
                </select>
            </div>
            <div className="inputContainer">
                <input type="submit" value={props.ventaId > 0 ? "Actualizar" : "Crear"} />
                <input type="submit" value="Cancelar" onClick={cancelForm}/>
            </div>
        </form>
    </div>
}

export default SaleForm;
