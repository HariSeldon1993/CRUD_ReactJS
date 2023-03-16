import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Axios from 'axios';
import './style.css';

import json from "../../../dados.json"

// Modal.setAppElement();

function Home() {
    const [dados, setDados] = useState([])
    const [input, setInput] = useState(0)
    const [modalIsOpen, setIsOpen] = React.useState(false);

    async function Teste(valor) {

        // console.log(valor.target.value) //Teste para verificar se o 'VALUE' do 'button 1' é passado
        // alert(valor.target.value);

        await Axios.get(`http://localhost:8000/${valor.target.value}`)
            .then((results) =>
                //console.log(results)
                setDados(results.data) //Para uso com MySQL + XAMPP    
                //setDados(results.data.rows) //Para uso com Postgresql + Heroku
            )
            .catch((err) => console.log(err))

        openModal(); //Abrir Modal!!!
    }
    async function TotalVendas() {
        console.log(`${json.json}`)

        await Axios.get('http://localhost:8000/total')
            .then((results) =>
                // console.log(results.data.rows[0].totalvendas)
                //console.log(results.data[0].totalVendas) // Para uso com MySQL + XAMPP
                //console.log(results)
                //alert(`Total de ingressos vendidos: ${results.data.rows[0].totalvendas} \nTotal arrecadado: R$${(results.data.rows[0].totalvendas * 30)}`) //Para uso com Postgresql + Heroku

                alert(`Total de ingressos vendidos: ${results.data[0].totalVendas} \nTotal arrecadado: R$${(results.data[0].totalVendas * 30)}`)
                
            )
            .catch((err) =>
                console.log(err)
            )
        //alert()
    }
    function openModal() {
        setIsOpen(true);
    }
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //subtitle.style.color = '#f00';
    }
    function closeModal() {
        setIsOpen(false);
    }
    function Comprar(sala, hora, qtd) {
        console.log(sala, hora, qtd)
        Axios.put(`http://localhost:8000/compra/${sala}/${hora}/${qtd}`)
            .then((results) => {
                console.log(results)
            })
            .catch((err) => {
                alert(err)
            })
        //alert(valor)
    }
    function Verificar(vDisp, vNumSala, vHorario, vInput) {
        if (vInput > vDisp) {
            alert("Quantidade Indisponível!")
            // window.confirm("Finalizar compra?")
        } else {
            if (window.confirm("Finalizar compra?")) {
                Comprar(vNumSala.replace(/\s/g, ''), vHorario, vInput)
                alert(`Compra de ${vInput} ingresso(s) realizada com sucesso!`)
                closeModal()
            }

        }
    }
    function Disponibilidade(vDisp) {
        if (vDisp === 0) {
            return ("ESGOTADO")
        } else {
            return vDisp
        }
    }

    return (
        <div className='container'>
            <div className='main'>
                <div className='fileira1'>
                    <div className='sala'>
                        <h1 >Sala 1</h1>
                        {/* <h2>{dados.map(getHorario)}</h2> */}
                        <button
                            value={1}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                    <div className='sala'>
                        <h1>Sala 2</h1>
                        <button
                            value={2}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                    <div className='sala'>
                        <h1>Sala 3</h1>
                        <button
                            value={3}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                    <div className='sala'>
                        <h1>Sala 4</h1>
                        <button
                            value={4}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                </div>

                <div className='fileira2'>
                    <div className='sala'>
                        <h1>Sala 5</h1>
                        <button
                            value={5}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                    <div className='sala'>
                        <h1>Sala 6</h1>
                        <button
                            value={6}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                    <div className='sala'>
                        <h1>Sala 7</h1>
                        <button
                            value={7}
                            onClick={(value) => Teste(value)}>Ver</button>
                    </div>
                </div>
                <button
                    style={{ width: '100px', margin: "10px" }}
                    onClick={() => TotalVendas()}>Vendas Totais</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                ariaHideApp={false} //Para evitar erro do Modal.setAppElement().
                className='Modal'

            >
                <div className='ModalBox'>
                    <button
                        style={{ width: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'self-end' }}
                        onClick={closeModal}>X</button>
                    {/* <h1>Horário:</h1> */}
                    <div>
                        {
                            dados.map((item, index) => {
                                return (
                                    <div className='cardFilme'
                                        style={{}}>
                                        {/* <h1>{index}</h1> */}
                                        <h2>{item.titulo}</h2>

                                        <button
                                            style={{ width: 150, }}
                                            onClick={() => { alert(item.sinopse) }}>Sinopse</button>
                                        <h3>Horário: {item.horario}</h3>
                                        <h4>Capacidade: {item.capacidade}</h4>
                                        <h4>Vendidos: {item.vendas}</h4>
                                        {/* <h4>Disponíveis: {item.disponivel}</h4> */}
                                        <h4>Disponíveis: {Disponibilidade(item.disponivel)}</h4>
                                        <div>
                                            <text>Ingressos: </text>
                                            <input
                                                type='number'

                                                style={{ width: 50, height: 25, }}
                                                defaultValue={0}
                                                max={item.disponivel}
                                                onChange={(value) => setInput(value.target.value)}
                                            ></input>
                                            <button
                                                style={{ width: 80, height: 30, margin: 1 }}
                                                // onClick={() => Comprar(item.num_sala, item.horario, input)}>Comprar</button>
                                                onClick={() => Verificar(item.disponivel, item.num_sala.replace(/\s/g, ''), item.horario, input)}>Comprar</button>
                                            {/* () => Comprar(item.num_sala.replace(/\s/g, ''), item.horario, input) */}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* <h3>{dados.map(getDados)}</h3> */}
                    {/* <h3>{getDados}</h3> */}
                    <h3>{ }</h3>
                </div>


            </Modal >


        </div >
    )
}
export default Home;