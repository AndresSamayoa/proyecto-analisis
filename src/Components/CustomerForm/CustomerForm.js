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
                <input type="text" id="txtNit" defaultValue={props.nit} onChange={changeNit}/>
            </div>
            <div className="inputContainer">
                <label>Razon social</label>
                <input type="text" id="txtRazonSocial" defaultValue={props.razonSocial} onChange={changeRazonSocial}/>
            </div>
            <div className="inputContainer">
                <label>Direccion fiscal</label>
                <input type="text" id="txtDireccionFiscal" defaultValue={props.direccionFiscal} onChange={changeDireccionFiscal}/>
            </div>
            <div className="inputContainer">
                <label>Correo electronico</label>
                <input type="text" id="txtCorreoElectronico" defaultValue={props.correoElectronico} onChange={changeCorreoElectronico}/>
            </div>
            <div className="inputContainer">
                <label>Telefono</label>
                <input type="text" id="txtTelefono" defaultValue={props.telefono} onChange={changeTelefono}/>
            </div>
            <div className="inputContainer">
                <label>Tipo de cliente</label>
                <select id="cbTipo"  value={props.tipoCliente} onChange={changeTipoCliente}>
                    <option>Persona</option>
                    <option>Juridico</option>
                </select>
            </div>
            <div className="inputContainer">
                <input type="submit" value="Crear" />
                <input type="submit" value="Cancelar" onClick={cancelForm}/>
            </div>
        </form>
    </div>
}

export default CustomerForm;
