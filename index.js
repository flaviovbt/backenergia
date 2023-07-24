const express = require('express')
const firestoreService = require("./src/firestore_service");
const app = express()

app.get('/setuser', function (req, res) {
    let email = req.query.email;
    let nome = req.query.nome;
    let vitorias = req.query.vitorias ? req.query.vitorias : 0;

    firestoreService.setUser(email, nome, vitorias);
    res.status(200).send('Informações salvas no banco.');
})

app.get('/getusers', async (req, res) => {
    let users = await firestoreService.getUsers();
    res.status(200).send(users);
})

app.get('/getuser', async (req, res) => {
    let email = req.query.email;
    let users = await firestoreService.getUser(email);
    res.status(200).send(users);
})

app.listen(3000)