import './CreditForm.css';

import SearchInput from '../SearchInput/SearchInput';

function CreditForm (props) {

    const changeCredito = (e) => {
        props.setCredito(e.target.value);
    };

    const changePlazo = (e) => {
        props.setPlazo(e.target.value);
    };

    const cancelForm = () => {
        props.setValorBuscadorCliente('');
        props.setClienteId(0)
        props.setPlazo(0);
        props.setCredito(0);
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <SearchInput
            value={props.valorBuscadorCliente}
            setValue={props.setValorBuscadorCliente}
            searchValueFunction={props.searchCliente}
            messageSearch={props.mensajeBusqueda}
        />
        <div className="inputContainer">
            <label>Credito</label>
            <input type="number" id="txtCredito" value={props.credito} onChange={changeCredito}/>
        </div>
        <div className="inputContainer">
            <label>Plazo</label>
            <input type="number" id="txtPlazo" value={props.plazo} onChange={changePlazo}/>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.creditoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        </form>
    </div>
}

export default CreditForm;
