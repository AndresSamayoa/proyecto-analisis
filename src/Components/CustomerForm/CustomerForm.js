import './CustomerForm.css';

function CustomerForm (props) {

    const changeNit = (e) => {
        props.setNit(e.target.value);
    };
    
    const changeRazonSocial = (e) => {
        props.setRazonSocial(e.target.value);
    };

    const changeDireccionFiscal = (e) => {
        props.setDireccionFiscal(e.target.value);
    };
    
    const changeTipoCliente = (e) => {
        props.setTipoCliente(e.target.value);
    };

    const changeCorreoElectronico = (e) => {
        props.setCorreoElectronico(e.target.value);
    };

    const changeTelefono = (e) => {
        props.setTelefono(e.target.value);
    };

    const cancelForm = (e) => {
        e.preventDefault();
        console.log('limpio')
        props.setClienteId(0)
        props.setNit('')
        props.setRazonSocial('')
        props.setDireccionFiscal('')
        props.setTipoCliente('')
        props.setCorreoElectronico('')
        props.setTelefono('')
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
            <div className="inputContainer">
                <label>Nit</label>
                <input type="text" id="txtNit" value={props.nit} onChange={changeNit}/>
            </div>
            <div className="inputContainer">
                <label>Razon social</label>
                <input type="text" id="txtRazonSocial" value={props.razonSocial} onChange={changeRazonSocial}/>
            </div>
            <div className="inputContainer">
                <label>Direccion fiscal</label>
                <input type="text" id="txtDireccionFiscal" value={props.direccionFiscal} onChange={changeDireccionFiscal}/>
            </div>
            <div className="inputContainer">
                <label>Correo electronico</label>
                <input type="text" id="txtCorreoElectronico" value={props.correoElectronico} onChange={changeCorreoElectronico}/>
            </div>
            <div className="inputContainer">
                <label>Telefono</label>
                <input type="text" id="txtTelefono" value={props.telefono} onChange={changeTelefono}/>
            </div>
            <div className="inputContainer">
                <label>Tipo de cliente</label>
                <select id="cbTipo"  value={props.tipoCliente} onChange={changeTipoCliente}>
                    <option>persona</option>
                    <option>juridico</option>
                </select>
            </div>
            <div className="inputContainer">
                <input type="submit" value={props.clienteId > 0 ? "Actualizar" : "Crear"} />
                <input type="submit" value="Cancelar" onClick={cancelForm}/>
            </div>
            <div className="submitMessage">
                {props.mensajeIngreso}
            </div>
        </form>
    </div>
}

export default CustomerForm;
