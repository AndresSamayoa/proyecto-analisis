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

    const cancelForm = (e) => {
        e.preventDefault();
        props.setClienteId(0)
        props.setNit('')
        props.setRazonSocial('')
        props.setDireccionFiscal('')
        props.setTipoCliente('')
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
                <label>Tipo de cliente</label>
                <select id="cbTipo" defaultValue={props.tipoCliente} onChange={changeTipoCliente}>
                    <option>Place holder</option>
                    <option>Opcion 1</option>
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
