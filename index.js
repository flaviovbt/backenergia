const express = require('express')
const bodyParser = require('body-parser')
const firestoreService = require("./src/firestore_service");
const cors = require('cors');
const app = express()

app.use(cors(), bodyParser.json());

app.post('/user/create', async (req, res) => {
    let email = req.query.email;
    let nome = req.query.nome;

    if(! await firestoreService.createUser(email, nome)){
        res.status(200).send({mensagem :'O email já é utilizado por outra conta.',
                            result: false});
    }else {
        res.status(200).send({mensagem :'Informações salvas no banco.',
                            result: true});
    }
})

app.post('/user/update', async (req, res) => { 
    let email = req.query.email;
    const jsonData = req.body;

    await firestoreService.updateUser(email, jsonData);
    res.status(200).send('Informações salvas no banco.');
})

app.get('/user/getAll', async (req, res) => {
    let users = await firestoreService.getUsers();
    res.status(200).send(users);
})

app.post('/user/get', async (req, res) => {
    let email = req.query.email;
    let users = await firestoreService.getUser(email);
    res.status(200).send(users);
})

app.post('/pergunta/create', async (req, res) => {
    const jsonData = req.body;

    await firestoreService.createPergunta(jsonData);

    res.status(200).send(jsonData);
})

app.get('/pergunta/getRandom', async (req, res) => {
    let users = await firestoreService.getPerguntasRandom();
    res.status(200).send(users);
})

app.post('/partida/create', async (req, res) => {
    const jsonData = req.body;
    let email = req.query.email;

    await firestoreService.createPartida(jsonData, email);

    res.status(200).send(jsonData);
})

app.get('/partida/getRanking', async (req, res) => {
    let partidas = await firestoreService.getRanking();
    res.status(200).send(partidas);
})

app.listen(3000)