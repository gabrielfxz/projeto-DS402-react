import React, { useState, useEffect } from "react";
import Main from "../template/Main";
import './Cursos.css';
import '../template/Main.css';
import axios from "axios";



export default function Cursos() {
    const title = "Cadastro de Cursos"
    const urlAPI = "http://localhost:5172/api/curso"
    const initialState = {
        curso: {codCurso:0, id:0, nomeCurso:'', periodo:''},
        lista:[],
    }
    const [curso, setCurso] = useState(initialState.curso)
    const [lista, setLista] = useState(initialState.lista)

    const dataFromAPI = async () => {
        return await axios(urlAPI)
            .then(resp => resp.data)
            .catch(err => err)
    }

    useEffect(() => {
        dataFromAPI().then(setLista).catch((error) => console.log(error))
    }, [curso])

    const dadosDosInputs = e => {
        const {name,value} = e.target
        setCurso({
            ...curso,
            [name]: value,
        })
    }

    function listaAtualizada(curso, add = true){
        const lista1 = lista.filter(a => a.id !== curso.id)
        if(add) lista1.unshift(curso)
        return lista1
    }

    const adicionarCurso = async () => {
        const cursos = curso
        curso.codCurso = Number(curso.codCurso)
        const metodo = curso.id ? 'put' : 'post'
        const url = curso.id ? `${urlAPI}/${cursos.id}` : urlAPI

        axios[metodo](url, cursos)
        .then(resp => {
            let lista = listaAtualizada(resp.data)
            setCurso(initialState.curso)
            setLista(lista)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const alterarCurso = async (curso) => {
        setCurso(curso)
    }


    const deletarCurso = async (curso) => {
        const url = urlAPI + "/" + curso.id
        if(window.confirm("Deseja deletar o Curso: " + curso.codCurso)){
            await axios['delete'](url,curso).then(resp => {
                let lista = listaAtualizada(resp.data)
                setCurso(initialState.curso)
                setLista(lista)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    const limpar = async () => {
        setCurso(initialState.curso)
    }


    
    const renderForm = () => {
    return (
            <div className="inclui-container">
                <label> Codigo do Curso: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="Codigo"
                    className="form-input"
                    name="codCurso"  
                    value={curso.codCurso}     
                    onChange={dadosDosInputs}
                />
                <label> Curso: </label>
                <input
                    type="text"
                    id="nomeCurso"
                    placeholder="curso"
                    className="form-input"
                    name="nomeCurso"
                    
                    value={curso.nomeCurso}     
                    onChange={dadosDosInputs}
                />

                <label> Periodo: </label>
                <input
                    type="text"
                    id="periodo"
                    placeholder="Periodo"
                    className="form-input"
                    name="periodo"
                    
                    value={curso.periodo}     
                    onChange={dadosDosInputs}
                />
                
                <button className="btnSalvar"
                    onClick={adicionarCurso} >
                    Salvar
                </button>
                <button className="btnCancelar"
                    onClick={e => limpar(e)} >
                    Cancelar
                </button>
            </div>
)}

    const renderTable = () => {
        return(
            <div className="listagem">
                <table className="listaAlunos" id="tblListaAlunos">
                    <thead className='cabecTabela'>
                        <tr className="cabecTabela">
                            <th className='tabTituloRa'>Codigo </th>
                            <th className='tabTituloNome'>Curso</th>
                            <th className='tabTituloCurso'>Periodo</th>
                            <th>Alterar</th>
                            <th>Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((curso) => (
                            <tr key={curso.id}>
                                <td className="val-center">{curso.codCurso}</td>
                                <td>{curso.nomeCurso}</td>
                                <td className="val-center">{curso.periodo}</td>
                                <td>
                                    <button className='btn-alterar'
                                    onClick={() => alterarCurso(curso)} 
                                    >
                                        Alterar
                                    </button>
                                </td>
                                <td>
                                    <button className='btn-remover'
                                    onClick={() => deletarCurso(curso)}>
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    )}
    return (
    <Main title={title}>
        {renderForm()}
        {renderTable()}
    </Main>
    )

}

