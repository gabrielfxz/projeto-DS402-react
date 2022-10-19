import React, { useState,useEffect } from "react";
import axios from "axios";





export default function Carometro() {

    const urlAPI = "http://localhost:5172/api/aluno";

    const initialState = {
        aluno: {id: 0, ra: '', nome: '', codCurso: 0},
        lista: []
    }
    const [aluno, setAluno] = useState(initialState.aluno)
    const [lista, setLista] = useState(initialState.lista)

    const dataFromAPI = async () => {
        return await axios(urlAPI)
            .then(resp => resp.data)
            .catch(err => err)
    }

    useEffect(() => {
        dataFromAPI().then(setLista).catch((error) => console.log(error))
    }, [aluno])

    


    function geraStringAleatoria(tamanho) {
        let stringAleatoria = '';
        let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAleatoria;
    }

    return (
        <div>
            <p className="m-4">CARÔMETRO</p>
            <div className="bg-[#f5f5f5] w-screen flex">
                <div className="p-10 flex gap-10 flex-wrap justify-center">
                    
                    {lista.map((aluno) => (
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