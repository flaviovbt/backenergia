const express = require('express')
const firestoreService = require("./src/firestore_service");
const cors = require('cors');
const app = express()

app.use(cors());

app.post('/createuser', async (req, res) => {
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

app.post('/setuser', async (req, res) => { 
    let email = req.query.email;
    let nome = req.query.nome;
    let vitorias = req.query.vitorias ? req.query.vitorias : 0;

    await firestoreService.setUser(email, nome, vitorias);
    res.status(200).send('Informações salvas no banco.');
})

app.post('/getusers', async (req, res) => {
    let users = await firestoreService.getUsers();
    res.status(200).send(users);
})

app.post('/getuser', async (req, res) => {
    let email = req.query.email;
    let users = await firestoreService.getUser(email);
    res.status(200).send(users);
})

app.listen(3000)