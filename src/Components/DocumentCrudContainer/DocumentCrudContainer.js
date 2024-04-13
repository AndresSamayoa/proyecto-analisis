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
                return <button disabled={!row.fechaEmision} onClick={() => {cancelRow(row.documentoId)}} >Anular</button>
            },
        },
        {
            name: '',
            selector: row => {
                return <button disabled={row.fechaEmision && !row.fechaAnulacion} onClick={() => {issueRow(row.documentoId)}} >Emitir</button>
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
                url: net_base_url+'/CXC_Documento.asmx/DocumentosMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        documentoId: item.children.find(obj => obj.name === 'DOC_DOCUMENTO') ? item.children.find(obj => obj.name === 'DOC_DOCUMENTO').value : null,
                        ventaId: item.children.find(obj => obj.name === 'DOC_VENTA') ? item.children.find(obj => obj.name === 'DOC_VENTA').value : null,
                        numeroAutorizacion: item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION') ? item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION').value : null,
                        documentoReferenciaId: item.children.find(obj => obj.name === 'DOC_DOCUMENTO_ASOCIADO') ? item.children.find(obj => obj.name === 'DOC_DOCUMENTO_ASOCIADO').value : null,
                        valor: item.children.find(obj => obj.name === 'DOC_VALOR') ? item.children.find(obj => obj.name === 'DOC_VALOR').value : null,
                        numeroEmision: item.children.find(obj => obj.name === 'DOC_NO_DOCUMENTO') ? item.children.find(obj => obj.name === 'DOC_NO_DOCUMENTO').value : null,
                        serieEmision: item.children.find(obj => obj.name === 'DOC_NO_EMISION') ? item.children.find(obj => obj.name === 'DOC_NO_EMISION').value : null,
                        fechaEmision: item.children.find(obj => obj.name === 'DOC_FECHA_EMISION') ? item.children.find(obj => obj.name === 'DOC_FECHA_EMISION').value : null,
                        fechaAnulacion: item.children.find(obj => obj.name === 'DOC_FECHA_ANULACION') ? item.children.find(obj => obj.name === 'DOC_FECHA_ANULACION').value : null,
                        tipoDocumento: item.children.find(obj => obj.name === 'DOC_TIPO_DOCUMENTO') ? item.children.find(obj => obj.name === 'DOC_TIPO_DOCUMENTO').value : null,
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
            url = net_base_url+'/CXC_Documento.asmx/Documentoactualizar'
            method = 'POST';
            data = querystring.stringify({
                p_documento: documentoId,
                pDoc_venta: ventaId,
                pDoc_documento_asociado: documentoReferenciaId,
                pDoc_valor: valor,
                pDoc_no_documento: numeroEmision,
                pDoc_no_emision: serieEmision,
                pDoc_tipo_documento: tipoDocumento,
            });
        } else {
            url = net_base_url+'/CXC_Documento.asmx/Documentoguardar';
            method = 'POST';
            data = querystring.stringify({
                pDoc_venta: ventaId,
                pDoc_documento_asociado: documentoReferenciaId,
                pDoc_valor: valor,
                pDoc_no_documento: numeroEmision || null,
                pDoc_no_emision: serieEmision ||  null,
                pDoc_tipo_documento: tipoDocumento,
                pDoc_valor_total: 0
            });
        }

        console.log(url, method)

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
                url: net_base_url+'/CXC_Documento.asmx/ClientesEliminar',
                data: querystring.stringify({
                    p_documento: documentId
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
        setDocumentoReferenciaId(null);
        setBuscadorDocumentoReferenciaId('');
        setMensajeBuscadorDocumentoReferencia('');
        setValor(0);
        setNumeroEmision('');
        setSerieEmision('');
        setFechaEmision('');
        setFechaAnulacion('');
        setTipoDocumento('Factura');
    };

    const buscarVenta = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Venta.asmx/VentaBuscar',
                data: querystring.stringify({
                    Venta_ID: buscadorVenta,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                console.log(data.children[1].children[0].children[0])
                if (data.children[1].children[0].children[0]) {
                    setVentaId(data.children[1].children[0].children[0].children.find(obj => obj.name === 'VEN_VENTA').value);
                    setMensajeBuscadorVenta('Venta encontrada');
                } else {
                    setMensajeBuscadorVenta('Venta no encontrada');
                }
            } else {
                setMensajeBuscadorVenta('Venta no encontrada');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorVenta('Venta no encontrada');
            console.log('Error: ' + error.message)
        }
    }

    const buscarDocumentoReferencia = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Documento.asmx/DocumentoBuscar',
                data: querystring.stringify({
                    p_documento: buscadorDocumentoReferencia,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                if (data.children[1].children[0].children[0]) {
                    setDocumentoReferenciaId(data.children[1].children[0].children[0].children.find(obj => obj.name === 'DOC_DOCUMENTO').value);
                    setMensajeBuscadorDocumentoReferencia('Documento encontrado');
                } else {
                    setMensajeBuscadorDocumentoReferencia('Documento no encontrado');
                }
            } else {
                setMensajeBuscadorDocumentoReferencia('Documento no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorDocumentoReferencia('Documento no encontrado');
            console.log('Error: ' + error.message)
        }
    }

    useEffect(() => {
        getData();
      }, []);

    return <>
        <div id="formSegment">
           <DocumentForm 
                onSubmit={onSubmit}
                clearForm={clearForm}
                searchVenta={buscarVenta}
                searchDocumento={buscarDocumentoReferencia}
                setValorBuscadorVenta={setBuscadorVenta}
                setValorBuscadorDocumento={setBuscadorDocumentoReferenciaId}
                setValor={setValor}
                setNumeroEmision={setNumeroEmision}
                setSerieEmision={setSerieEmision}
                setTipoDocumenton={setTipoDocumento}
                valorBuscadorVenta={buscadorVenta}
                mensajeBusquedaVenta={mensajeBuscadorVenta}
                valorBuscadorDocumento={buscadorDocumentoReferencia}
                mensajeBusquedaDocumento={mensajeBuscadorDocumentoReferencia}
                valor={valor}
                numeroEmision={numeroEmision}
                serieEmision={serieEmision}
                fechaEmision={fechaEmision}
                fechaAnulacion={fechaAnulacion}
                tipoDocumento={tipoDocumento}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default DocumentCrudContainer; 