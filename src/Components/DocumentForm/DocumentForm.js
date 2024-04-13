import './DocumentForm.css';

import SearchInput from '../SearchInput/SearchInput';

function DocumentForm (props) {

    const changeSerieEmision = (e) => {
        props.setSerieEmision(e.target.value);
    };

    const changeNumeroEmision = (e) => {
        props.setNumeroEmision(e.target.value);
    };

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
            <label>Numero de emision</label>
            <input type="number"  id="txtNumeroEmision" value={props.numeroEmision} onChange={changeNumeroEmision}/>
        </div>
        <div className="inputContainer">
            <label>Serie de emision</label>
            <input type="number" id="txtSerieEmision" value={props.serieEmision} onChange={changeSerieEmision}/>
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
            <input type="submit" value={props.creditoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        </form>
    </div>
}

export default DocumentForm;
