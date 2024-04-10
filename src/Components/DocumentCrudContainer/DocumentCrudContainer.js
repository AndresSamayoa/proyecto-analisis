import './DocumentCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import DocumentForm from '../DocumentForm/DocumentForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

const DocumentCrudContainer = () => {
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.documentoId,
        },
        {
            name: '',
            selector: row => {
                return <button onClick={() => {updateForm(row)}} >Actualizar</button>
            },
        },
        {
            name: '',
            selector: row => {
                return <button onClick={() => {deleteRow(row.documentoId)}} >Borrar</button>
            },
        },
        {
            name: '',
            selector: row => {
                return <button disabled={!row.fechaAnulacion} onClick={() => {cancelRow(row.documentoId)}} >Anular</button>
            },
        },
        {
            name: '',
            selector: row => {
                return <button disabled={!row.fechaEmision} onClick={() => {issueRow(row.documentoId)}} >Emitir</button>
            },
        },
        {
            name: 'Numero autorizacion venta',
            selector: row => row.numeroAutorizacion,
        },
        {
            name: 'Documento de referencia',
            selector: row => row.documentoReferenciaId,
        },
        {
            name: 'Valor',
            selector: row => row.valor,
        },
        {
            name: 'Numero Emision',
            selector: row => row.numeroEmision,
        },
        {
            name: 'Serie Emision',
            selector: row => row.serieEmision,
        },
        {
            name: 'Fecha emision',
            selector: row => row.fechaEmision,
        },
        {
            name: 'Fecha anulacion',
            selector: row => row.fechaAnulacion,
        },
        {
            name: 'Tipo de documento',
            selector: row => row.tipoDocumento,
        },
    ];

    const [documentoId, setDocumentoId] = useState(0);
    const [ventaId, setVentaId] = useState(0);
    const [buscadorVenta, setBuscadorVenta] = useState('');
    const [mensajeBuscadorVenta, setMensajeBuscadorVenta] = useState('');
    const [documentoReferenciaId, setDocumentoReferenciaId] = useState(0);
    const [buscadorDocumentoReferencia, setBuscadorDocumentoReferenciaId] = useState('');
    const [mensajeBuscadorDocumentoReferencia, setMensajeBuscadorDocumentoReferencia] = useState('');
    const [valor, setValor] = useState(0);
    const [numeroEmision, setNumeroEmision] = useState('');
    const [serieEmision, setSerieEmision] = useState('');
    const [fechaEmision, setFechaEmision] = useState('');
    const [fechaAnulacion, setFechaAnulacion] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('Factura');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ClientesMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        documentoId: item.children[0].value,
                        ventaId: item.children[1].value,
                        numeroAutorizacion: item.children[2].value,
                        documentoReferenciaId: item.children[3].value,
                        valor: item.children[4].value,
                        numeroEmision: item.children[5].value,
                        serieEmision: item.children[6].value,
                        fechaEmision: item.children[7].value,
                        fechaAnulacion: item.children[8].value,
                        tipoDocumento: item.children[9].value,
                    })
                }
                setTableData(tempData);
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    }

    const updateForm = (row) => {
        setDocumentoId(row.documentoId);
        setVentaId(row.ventaId);
        setBuscadorVenta(row.ventaId);
        setDocumentoReferenciaId(row.documentoReferenciaId);
        setBuscadorDocumentoReferenciaId(row.documentoReferenciaId);
        setValor(row.valor);
        setNumeroEmision(row.numeroEmision);
        setSerieEmision(row.serieEmision);
        setFechaEmision(row.fechaEmision);
        setFechaAnulacion(row.fechaAnulacion);
        setTipoDocumento(row.tipoDocumento);
        setMensajeBuscadorDocumentoReferencia('');
        setMensajeBuscadorVenta('');
    };

    const onSubmit = async () => {
        // Consumir api
        let url ;
        let method ;
        let data ;

        if (documentoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/DocumentosActualizar'
            method = 'POST';
            data = querystring.stringify({
                doc_documento: documentoId,
                doc_venta: ventaId,
                doc_documento_asociado: documentoReferenciaId,
                doc_valor: valor,
                doc_numero_emision: numeroEmision,
                doc_serie_emision: serieEmision,
                doc_tipo_documento: tipoDocumento,
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/DocumentosGuardar';
            method = 'POST';
            data = querystring.stringify({
                doc_venta: ventaId,
                doc_documento_asociado: documentoReferenciaId,
                doc_valor: valor,
                doc_numero_emision: numeroEmision,
                doc_serie_emision: serieEmision,
                doc_tipo_documento: tipoDocumento,
            });
        }

        try {
            const respuesta = await axios({
                method: method,
                url: url,
                data: data, 
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                getData();
                clearForm();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const deleteRow = async (documentId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/DocumentosEliminar',
                data: querystring.stringify({
                    doc_documento: documentId
                }),
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
               getData();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const issueRow = async (documentId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/DocumentosEmitir',
                data: querystring.stringify({
                    doc_documento: documentId
                }),
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
               getData();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const cancelRow = async (documentId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/DocumentosAnular',
                data: querystring.stringify({
                    doc_documento: documentId
                }),
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
               getData();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const clearForm = async () => {
        setDocumentoId(0);
        setVentaId(0);
        setBuscadorVenta('');
        setMensajeBuscadorVenta('');
        setDocumentoReferenciaId(0);
        setBuscadorDocumentoReferenciaId('');
        setMensajeBuscadorDocumentoReferencia('');
        setValor(0);
        setNumeroEmision('');
        setSerieEmision('');
        setFechaEmision('');
        setFechaAnulacion('');
        setTipoDocumento('Factura');
    };

    useEffect(() => {
        getData();
      }, []);

    return <>
        <div id="formSegment">
           <DocumentForm 
                onSubmit={onSubmit}
                
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default DocumentCrudContainer; 