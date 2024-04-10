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

    const cancelForm = () => {
        props.setCreditoId(0)
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
            <label>Fecha de emision</label>
            <input type="date" disabled id="txtFechaEmision" value={props.fechaEmision}/>
        </div>
        <div className="inputContainer">
            <label>Fecha de anulacion</label>
            <input type="date" disabled id="txtFechaAnulacion" value={props.fechaAnulacion}/>
        </div>
        <div className="inputContainer">
            <label>Tipo de documento</label>
            <select id="cbTipo"  value={props.tipoDocumento} onChange={changeTipoDocumento}>
                <option>Factura</option>
                <option>Factura cambiaria</option>
                <option>Factura especial</option>
                <option>Nota de credito</option>
                <option>Nota de abono</option>
                <option>Nota de debito</option>
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
