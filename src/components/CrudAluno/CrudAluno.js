import React, { Component } from 'react';
import axios from 'axios';
import './CrudAluno.css';
import Main from '../template/Main';

const title = "Cadastro de Alunos";

const urlAPI = "http://localhost:5172/api/aluno";

const urlCurso = "http://localhost:5172/api/curso";

const initialState = {
    aluno: {id: 0, ra: '', nome: '', codCurso: 0},
    lista: []
}

const initialStateCurso = {
    curso: {id: 0, codCurso:0, nomeCurso:'', periodo:''},
    listas: []
}

export default class CrudAluno extends Component {
    state = {...initialState, ...initialStateCurso}

    componentDidMount() {
        axios(urlAPI).then(resp => {
            this.setState({lista:resp.data})
        })
        axios(urlCurso).then(resp => {
            this.setState({listas:resp.data})
        })
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }
    
    salvar() {
        const aluno = this.state.aluno;
        aluno.codCurso = Number(this.state.curso.codCurso);
        const metodo = aluno.id ? 'put' : 'post';
        const url = aluno.id ? `${urlAPI}/${aluno.id}` : urlAPI;
        axios[metodo](url, aluno).then(resp => {
        const lista = this.getListaAtualizada(resp.data)
        this.setState({ aluno: initialState.aluno, lista })
        })
    }

    getListaAtualizada(aluno, add=true) {
        const lista = this.state.lista.filter(a => a.id !== aluno.id);
        if(add)lista.unshift(aluno);
        return lista;
    }

    getCursoAtualizado(e){
        const curso = {...this.state.curso}
        curso[e.target.name] = e.target.value
        this.setState({curso})
    }

    atualizaCampo(event) {
        const aluno = { ...this.state.aluno };
        aluno[event.target.name] = event.target.value;
        this.setState({ aluno });
    }
        
    carregar(aluno) {
        this.setState({ aluno })
        const url = urlAPI + "/" + aluno.id;
        if (window.confirm("Confirma alteração do aluno: " + aluno.ra)) {
            console.log("entrou no confirm");
            axios['PUT'](url, aluno).then(resp => {
                const lista = this.getListaAtualizada(aluno, false)
                this.setState({ aluno: initialState.aluno, lista })
            })
        }
        this.atualizaCampo(aluno)
    }
    remover(aluno) {
        const url = urlAPI + "/" + aluno.id;
        if (window.confirm("Confirma remoção do aluno: " + aluno.ra)) {
            console.log("entrou no confirm");
            axios['delete'](url, aluno).then(resp => {
                const lista = this.getListaAtualizada(aluno, false)
                this.setState({ aluno: initialState.aluno, lista })
            })
        }
    }

    renderForm() {
        return (
            <div className="inclui-container">
                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input"
                    name="ra"  
                    value={this.state.aluno.ra}     
                    onChange={ e => this.atualizaCampo(e)}
                    maxLength={5}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do aluno"
                    className="form-input"
                    name="nome"         
                    value={this.state.aluno.nome}
                    onChange={ e => this.atualizaCampo(e)}
                    maxLength={30}
                />
                
                <label> Curso: </label>
                <select
                    name="codCurso"
                    onChange={(e) => {
                        this.getCursoAtualizado(e)
                    }}
                >
                    {this.state.listas.map( (curso) => (
                        <option key={curso.id} name="codCurso" value={curso.codCurso}>
                            {curso.nomeCurso}
                            -
                            {curso.periodo}
                        </option>
                        
                    ))}
                </select>
                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                    Salvar
                </button>
                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                    Cancelar
                </button>
            </div>
            )
    }



    renderTable() {
        return (
            <div className="listagem">
                <table className="listaAlunos" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloRa">Ra</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Curso</th>
                            <th className="tabTituloCurso">Alterar</th>
                            <th className="tabTituloCurso">Excluir</th>   
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lista.map(
                            (aluno) =>
                                <tr key={aluno.id}>
                                    <td>{aluno.ra}</td>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.codCurso}</td>
                                    <td>
                                        <button className='btnAltExc' onClick={() => this.carregar(aluno)}>
                                            altera
                                        </button>
                                    </td>
                                    <td>
                                        <button className='btnAltExc' onClick={() => this.remover(aluno)}>
                                            remove
                                        </button>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    render() {
        return (
            <Main title={title}>
                {this.renderTable()}
                {this.renderForm()}
            </Main>
        )
    }
}