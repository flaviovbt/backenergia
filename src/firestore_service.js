const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter, QuerySnapshot } = require('firebase-admin/firestore');
const perguntaProcessor = require("./pergunta_processor");

const serviceAccount = require('.././security/serviceAccountKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const userRef = db.collection('users');

const perguntasRef = db.collection('perguntas');

const partidasRef = db.collection('partidas');

async function setUser(email, nome, vitorias) {
    try {
        // Define os dados que serão salvos no documento
        const userData = {
            email: email,
            nome: nome,
            vitorias: vitorias
        };

        const create = userRef.doc(email);

        await create.set(userData);
        console.log('Dados salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function createUser(email, nome, vitorias) {
    if (await getUser(email) != null) return false;

    await setUser(email, nome, vitorias);
    return true;
}

async function getUsers() {
    try {
        let users = [];

        const snapshot = await userRef.get();
        snapshot.forEach((doc) => {
            users.push(doc.data());
        });

        console.log('Dados recuperados com sucesso do Firestore!');

        return users;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

async function getUser(email) {
    try {
        let user;

        let userRef = db.doc('/users/' + email);

        const userSnapshot = await userRef.get();
        user = userSnapshot.data();

        console.log('Dados recuperados com sucesso do Firestore!');

        return user;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return null;
    }
}

async function createPergunta(jsonArray) {
    try {
        let create;

        await jsonArray.forEach(pergunta => {
            create = perguntasRef.doc();
            create.set(pergunta);
        });

        console.log('Dados salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function getPerguntas() {
    try {
        let perguntas = [];

        const snapshot = await perguntasRef.get();
        snapshot.forEach((doc) => {
            perguntas.push(doc.data());
        });

        console.log('Dados recuperados com sucesso do Firestore!');

        return perguntas;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

async function getPerguntasRandom() {
    try {
        let perguntas = await getPerguntas();

        const perguntasFiltradas = await perguntaProcessor.selecionarAleatoriamente(perguntas);

        return perguntasFiltradas;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

async function createPartida(json) {
    try {

        let create = partidasRef.doc();
        await create.set(json);

        console.log('Dados salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

module.exports = {
    setUser,
    getUsers,
    getUser,
    createUser,
    createPergunta,
    getPerguntas,
    getPerguntasRandom,
    createPartida
};  