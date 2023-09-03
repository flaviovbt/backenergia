const express = require('express')
const bodyParser = require('body-parser')
const firestoreService = require("./src/firestore_service");
const cors = require('cors');
const app = express()

app.use(cors(), bodyParser.json());

app.post('/user/create', async (req, res) => {
    let email = req.query.email;
    let nome = req.query.nome;
    let vitorias = 0;

    if(! await firestoreService.createUser(email, nome, vitorias)){
        res.status(200).send({mensagem :'O email já é utilizado por outra conta.',
                            result: false});
    }else {
        res.status(200).send({mensagem :'Informações salvas no banco.',
                            result: true});
    }
})

app.post('/user/update', async (req, res) => { 
    let email = req.query.email;
    let nome = req.query.nome;
    let vitorias = req.query.vitorias ? req.query.vitorias : 0;

    await firestoreService.setUser(email, nome, vitorias);
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

    res.json({ message: 'Requisição POST recebida com sucesso', data: jsonData});
})

app.get('/pergunta/getRandom', async (req, res) => {
    let users = await firestoreService.getPerguntasRandom();
    res.status(200).send(users);
})

app.listen(3000)