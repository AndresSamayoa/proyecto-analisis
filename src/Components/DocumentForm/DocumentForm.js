import './DocumentForm.css';

import SearchInput from '../SearchInput/SearchInput';

function DocumentForm (props) {

    const changeNumeroEmision = (e) => {
        props.setNumeroEmision(e.target.value);
    };

    const changeSerie = (e) => {
        props.setSerie(e.target.value);
    };

    const changeNumeroDocumento = (e) => {
        props.setNumeroDocumento(e.target.value);
    };

    const changeValorTotal = (e) => {
        props.setUsarTotal(e.target.checked);

    }

    const changeTipoDocumento = (e) => {
        props.setTipoDocumenton(e.target.value);
    };

    const changeValor = (e) => {
        props.setValor(e.target.value);
    };

    const cancelForm = (e) => {
        e.preventDefault();
        props.clearForm()
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <SearchInput
            label="Venta (buscar por codigo de autorizacion o codigo)"
            value={props.valorBuscadorVenta}
            setValue={props.setValorBuscadorVenta}
            searchValueFunction={props.searchVenta}
            messageSearch={props.mensajeBusquedaVenta}
        />
        <SearchInput
            label="Documento asociado (buscar por codigo)"
            value={props.valorBuscadorDocumento}
            setValue={props.setValorBuscadorDocumento}
            searchValueFunction={props.searchDocumento}
            messageSearch={props.mensajeBusquedaDocumento}
        />
        <div className="inputContainer">
            <label>Valor</label>
            <input type="number" id="txtValor" value={props.valor} onChange={changeValor}/>
        </div>
        <div className="inputContainer">
            <label>Total venta</label>
            <input type="checkbox" id="txtValorTotal" value={props.usarTotal} onChange={changeValorTotal}/>
        </div>
        <div className="inputContainer">
            <label>Serie</label>
            <input type="text"  id="txtSerie" value={props.serie} onChange={changeSerie}/>
        </div>
        <div className="inputContainer">
            <label>Numero de documento</label>
            <input type="number"  id="txtNumeroDocumento" value={props.numeroDocumento} onChange={changeNumeroDocumento}/>
        </div>
        <div className="inputContainer">
            <label>Numero de emision</label>
            <input type="text" id="txtNumeroEmision" value={props.numeroEmision} onChange={changeNumeroEmision}/>
        </div>
        <div className="inputContainer">
            <label>Tipo de documento</label>
            <select id="cbTipo"  value={props.tipoDocumento} onChange={changeTipoDocumento}>
                <option value={'factura'}>Factura</option>
                <option value={'factura cambiaria'}>Factura cambiaria</option>
                <option value={'factura especial'}>Factura especial</option>
                <option value={'nota de credito'}>Nota de credito</option>
                <option value={'nota de abono'}>Nota de abono</option>
                <option value={'nota de debito'}>Nota de debito</option>
            </select>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.documentoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        <div className="submitMessage">
            {props.mensajeIngreso}
        </div>
        </form>
    </div>
}

export default DocumentForm;
