import './CustomerContactForm.css';

import SearchInput from '../SearchInput/SearchInput';

function CustomerContactForm (props) {

    const changeNombres = (e) => {
        props.setNombres(e.target.value);
    };

    const changeEmail = (e) => {
        props.setEmail(e.target.value);
    };

    const changeTelefono1 = (e) => {
        props.setTelefono1(e.target.value);
    };

    const changeTelefono2 = (e) => {
        props.setTelefono2(e.target.value);
    };

    const changeTelefono3 = (e) => {
        props.setTelefono3(e.target.value);
    };

    const cancelForm = () => {
        props.clearForm();
        
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <SearchInput
            label="Cliente (buscar por email o codigo)"
            value={props.valorBuscadorCliente}
            setValue={props.setValorBuscadorCliente}
            searchValueFunction={props.searchCliente}
            messageSearch={props.mensajeBusqueda}
        />
        <div className="inputContainer">
            <label>Nombres</label>
            <input type="text" id="txtNombres" value={props.nombres} onChange={changeNombres}/>
        </div>
        <div className="inputContainer">
            <label>Email</label>
            <input type="text" id="txtEmail" value={props.email} onChange={changeEmail}/>
        </div>
        <div className="inputContainer">
            <label>Telefono 1</label>
            <input type="number" id="txtTelefono1" value={props.telefono1} onChange={changeTelefono1}/>
        </div>
        <div className="inputContainer">
            <label>Telefono 2</label>
            <input type="number" id="txtTelefono2" value={props.telefono2} onChange={changeTelefono2}/>
        </div>
        <div className="inputContainer">
            <label>Telefono 3</label>
            <input type="number" id="txtTelefono3" value={props.telefono3} onChange={changeTelefono3}/>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.contactoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        <div className="submitMessage">
                {props.mensajeIngreso}
            </div>
        </form>
    </div>
}

export default CustomerContactForm;
