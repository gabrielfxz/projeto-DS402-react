import React, { useState,useEffect } from "react";
import axios from "axios";

export default function Carometro() {

    const urlAPI = "http://localhost:5172/api/aluno";
    const urlAPIcurso = "http://localhost:5172/api/curso";

    const initialState = {
        aluno: {id: 0, ra: '', nome: '', codCurso: 0},
        curso: { id: 0, codCurso: "", nomeCurso: "", periodo: "" },
        listaAlunos: [],
        listaCursos: [],
    }
    

    const [aluno, setAluno] = useState(initialState.aluno)
    const [listaCursos, setListaCursos] = useState(initialState.listaCursos);
    const [listaAlunos, setListaAlunos] = useState(initialState.listaAlunos);
    const [curso, setCurso] = useState(initialState.curso);

    const dataFromAPIcurso = async () => {
        await axios(urlAPIcurso)
            .then((resp) => setListaCursos(resp.data))
            .catch((err) => {
                console.log(err);
            });

    }

    useEffect(() => {
        dataFromAPIcurso()
        console.log(listaCursos)
    },[])

    function geraStringAleatoria(tamanho) {
        let stringAleatoria = '';
        let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAleatoria;
    }

    const renderSelect = () => {
        return (
            <div className="select-container">
                <label> Curso: </label>
                <select className="selectCarometro" value={curso.codCurso}  onChange={e => { atualizarListaAlunos(e)}} required>
                    <option disabled={true} key="" value="">  -- Escolha um curso -- </option>
                    {listaCursos.map( (curso) =>
                            <option  key={curso.id} name="codCurso" value={curso.codCurso}>
                                { curso.codCurso } - { curso.nomeCurso } : { curso.periodo }
                            </option>
                    )}
                </select>
            </div>
        );
    };

    const getListaAlunosDoCurso = async (codCurso) => {
        return await axios(urlAPI)
        .then((resp) => {
            const listaDeAlunos = resp.data;
            return listaDeAlunos.filter(
                (aluno) => aluno.codCurso === codCurso
            );
        })
        .catch((err) => {
            console.log(err);

            //sendMultipleErrorPopUp(err);
        });
    }

    const atualizarListaAlunos = async (event) => {
        const codCurso = event.target.value;
        if (event.target.value === "") {
            setListaAlunos(initialState.listaAlunos);
            setCurso(initialState.curso);
            return
        }
        curso.codCurso = Number(codCurso)
        const listaDeAlunos = await getListaAlunosDoCurso(curso.codCurso)
        if(!Array.isArray(listaDeAlunos)) return

        setListaAlunos(listaDeAlunos)
        setCurso(curso)
    }

    return (
        <div>
            <p className="m-4">CARÔMETRO {renderSelect()}</p>
            
            <div className="bg-[#f5f5f5] w-screen flex">
                <div className="p-10 flex gap-10 flex-wrap justify-center">
                    
                    {listaAlunos.map((aluno) => (
                                <div className="rounded-[1.5rem] flex flex-col flex-wrap justify-center text-left h-[40vh] w-[25vh] shadow-2xl">
                                    <div className="w-11/12 items-center self-center place-items-center">
                                    <img src={`https://avatars.dicebear.com/api/personas/${geraStringAleatoria(8)}.svg`}></img>
                                    </div>
                                    <div className="flex flex-col flex-wrap justify-center text-left p-5">
                                    <span>nome: {aluno.nome}</span>
                                    <span>curso: {aluno.codCurso}</span>
                                    <span>RA: {aluno.ra}</span>
                                    </div>
                                </div>
                            ))}
            </div>
        </div>
        </div>
    )


}