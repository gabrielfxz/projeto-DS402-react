import React, { useState,useEffect } from "react";
import axios from "axios";

export default function Carometro() {

    const urlAPI = "http://localhost:5172/api/aluno";
    const urlAPIcurso = "http://localhost:5172/api/curso";

    const initialState = {
        curso: { id: 0, codCurso: "", nomeCurso: "", periodo: "" },
        listaCursos: [],
    }

    const initialStateAluno = {
        aluno: {id: 0, ra: '', nome: '', codCurso: 0},
        listaAlunos: [],
    }
    
    const [listaCursos, setListaCursos] = useState(initialState.listaCursos);
    const [listaAlunos, setListaAlunos] = useState(initialStateAluno.listaAlunos);
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

    function stringAleatoria(qtd) {
        let stringAlt = '';
        let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < qtd; i++) {
            stringAlt += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAlt;
    }

    const getLista = async (codCurso) => {
        return await axios(urlAPI)
        .then((resp) => {
            const listaDeAlunos = resp.data;
            return listaDeAlunos.filter(
                (aluno) => aluno.codCurso === codCurso
            );
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const atualizarLista = async (e) => {
        const codCurso = e.target.value;
        if (e.target.value === "") {
            setListaAlunos(initialState.listaAlunos);
            setCurso(initialState.curso);
            return
        }
        curso.codCurso = Number(codCurso)
        const listaDeAlunos = await getLista(curso.codCurso)
        if(!Array.isArray(listaDeAlunos)) return

        setListaAlunos(listaDeAlunos)
        setCurso(curso)
    }

    return (
        <div>
            <p className="m-4">CARÔMETRO</p>
            <div>
                <label> Curso: </label>
                <select value={curso.codCurso}  onChange={e => { atualizarLista(e)}}>
                    {listaCursos.map((curso) =>
                        <option name="codCurso" value={curso.codCurso}>
                            { curso.nomeCurso } - { curso.periodo } - { curso.codCurso }
                        </option>
                    )}
                </select>
            </div>
            
            <div className="bg-[#f5f5f5] w-screen flex">
                <div className="p-10 flex gap-10 flex-wrap justify-center">
                    
                    {listaAlunos.map((aluno) => (
                                <div className="rounded-[1.5rem] flex flex-col flex-wrap justify-center text-left h-[40vh] w-[25vh] shadow-2xl">
                                    <div className="w-11/12 items-center self-center place-items-center">
                                    <img src={`https://avatars.dicebear.com/api/personas/${stringAleatoria(8)}.svg`}></img>
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