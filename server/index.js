const express = require("express")
const app = express();
const mysql2 = require("mysql2");
const porta = 8000;
const cors = require('cors')

//CONEXÃO MYSQL
const db = mysql2.createPool({
    host: "localhost",
    database: "cinema",
    user: "root",
    port: 3306
})

app.use(express.json());
app.use(cors())

//GET
app.get("/", (req, res) => {
    db.query("SELECT * FROM filmes", (err, results) => {
        if (err) { throw err }
        //console.log(results)
        res.status(200).send(results)
    })
})

//GET VENDAS TOTAIS
app.get("/total", (req, res) => {
     //console.log("Hello World!")

    db.query("SELECT sum(vendas) AS totalVendas FROM salas", (err, results) => {
        if (err) { throw err }
        //console.log(results)
        res.status(200).send(results)
    })
})

//GET POR SALA
app.get("/:sala", (req, res) => {
    const sala = parseInt(req.params.sala);

    db.query("select * from filmes inner join salas on filmes.id_sala = salas.idsala where salas.num_sala like '%?%'", [sala], (err, results) => {
        if (err) { throw err }
        //else{res.send(results)}
        //console.log(results)
        res.status(200).send(results)
    })
})

//GET POR SALA E HORARIO
app.get("/:sala/:horario", (req, res) => {
    const sala = parseInt(req.params.sala);
    const horario = parseInt(req.params.horario)

    db.query("select * from filmes inner join salas on filmes.id_sala = salas.idsala where salas.num_sala like '%?%' and salas.horario like '%?%'", [sala, horario], (err, results) => {
        if (err) { throw err }
        //console.log(results)
        res.status(200).send(results)
    })
})

//UPDATE POR SALA E HORARIO
app.put("/compra/:sala/:horario/:qtd", (req, res) => {
    const sala = req.params.sala;
    const horario = req.params.horario;
    const qtd = parseInt(req.params.qtd);

    db.query(`update salas set vendas = (select sum(vendas + ${qtd}) from salas where num_sala like "%${sala}%" and horario like "%${horario}%") where num_sala like "%${sala}%" and horario like "%${horario}%";`, (err, results) => {
        if (err) throw err
        res.status(200).send(results)
        db.query(`update salas set disponivel = (select sum(capacidade - vendas) from salas where num_sala like "%${sala}%" and horario like "%${horario}%") where num_sala like "%${sala}%" and horario like "%${horario}%";`, (err, results) => {
            if (err) throw err
            console.log("Banco de Dados atualizado com sucesso!")
        })
    })
})

//STATUS LISTEN
app.listen(porta, () => {
    console.log(`Rodando na porta ${porta}`);
})