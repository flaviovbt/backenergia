const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const perguntaProcessor = require("./Pergunta_processor");

const serviceAccount = require('.././security/serviceAccountKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const userRef = db.collection('users');

const perguntasRef = db.collection('perguntas');

const partidasRef = db.collection('partidas');

async function setUser(email, nome) {
    try {
        // Define os dados que serão salvos no documento
        const userData = {
            email: email,
            nome: nome
        };

        const create = userRef.doc(email);

        await create.set(userData);
        console.log('Dados do usuario salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function createUser(email, nome) {
    if (await getUser(email) != null) return false;

    await setUser(email, nome);

    await createColectionPartidas(email, nome);

    return true;
}

async function createColectionPartidas(email, nome) {
    try {

        let create = partidasRef.doc(email);

        let partidas = {
            numPartidas: 0,
            infos: [],
            maiorPontuacao: 0,
            maiorPontuacaoIndex: null,
            nome: nome
        };

        await create.set(partidas);

        console.log('Dados da partida salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function updateUser(email, jsonData) {
    try {
        let update = userRef.doc(email);

        await update.set(jsonData);
        console.log('Dados do usuario salvos com sucesso no Firestore!', jsonData);
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function getUsers() {
    try {
        let users = [];

        const snapshot = await userRef.get();
        snapshot.forEach((doc) => {
            users.push(doc.data());
        });

        console.log('Dados dos usuarios recuperados com sucesso do Firestore!');

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

        console.log('Dados do usuario recuperados com sucesso do Firestore!');

        return user;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return null;
    }
}

async function createPergunta(jsonArray) {
    try {
        let create;
        let facil = {};
        let dificil = {};
        dificil.perguntas = [];
        facil.perguntas = [];

        let perguntasFacilBanco = await getPerguntas("Fácil");
        let perguntasDificilBanco = await getPerguntas("Difícil");
        if(perguntasFacilBanco.perguntas.length > 0){
            facil = perguntasFacilBanco;
        }
        if(perguntasDificilBanco.perguntas.length > 0){
            dificil = perguntasDificilBanco;
        }

        await jsonArray.forEach(pergunta => {
            if(pergunta.dificuldade == "Fácil"){
                facil.perguntas.push(pergunta);
            }
            if(pergunta.dificuldade == "Difícil"){
                dificil.perguntas.push(pergunta);
            }
        });

        if(dificil.perguntas.length > 0){
            create = perguntasRef.doc("Difícil");
            create.set(dificil);
        }
        
        if(facil.perguntas.length > 0){
            create = perguntasRef.doc("Fácil");
            create.set(facil);
        }

        console.log('Dados salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function getPerguntas(dificuldade) {
    try {
        let perguntas;

        let perguntaRef = db.doc('/perguntas/' + dificuldade);
        const pSnapshot = await perguntaRef.get();

        perguntas = pSnapshot.data();

        console.log('Dados das perguntas recuperados com sucesso do Firestore!');

        return perguntas;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

async function getPerguntasRandom(dificuldade) {
    try {
        let data = await getPerguntas(dificuldade);

        const perguntasFiltradas = await perguntaProcessor.selecionarAleatoriamente(data.perguntas);

        return perguntasFiltradas;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

async function createPartida(json, email) {
    try {
        let partida = await getPartidas(email);

        partida.numPartidas++;
        partida.infos.push(json);

        if (json.pontuacao > partida.maiorPontuacao) {
            partida.maiorPontuacao = json.pontuacao;
            partida.maiorPontuacaoIndex = (partida.infos.length - 1);
        }

        let update = partidasRef.doc(email);
        await update.set(partida);

        console.log('Dados da partida salvos com sucesso no Firestore!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function getPartidas(email) {
    try {
        let partida;

        let partidaRef = db.doc('/partidas/' + email);

        const pSnapshot = await partidaRef.get();
        partida = pSnapshot.data();

        console.log('Dados do usuario recuperados com sucesso do Firestore!');

        return partida;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return null;
    }
}

async function getRanking() {
    try {
        let ranking = [];
        let partida = {};

        const snapshot = await partidasRef.get();
        snapshot.forEach((doc) => {
            let partidasUser = doc.data();

            if (partidasUser.infos.length > 0) {
                partida = {};

                partida.maior = partidasUser.maiorPontuacao;
                partida.nome = partidasUser.nome;

                let partidaAux = partidasUser.infos[partidasUser.maiorPontuacaoIndex];

                partida.dificuldade = partidaAux.dificuldade;

                ranking.push(partida);
            }
        });

        ranking.sort(function (a, b) {
            return b.maior - a.maior;
        });

        for (let index = 0; index < ranking.length; index++) {
            ranking[index].posicao = (index + 1);
        }

        console.log('Dados do ranking recuperados com sucesso do Firestore!');

        return ranking;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    createPergunta,
    getPerguntas,
    getPerguntasRandom,
    createPartida,
    updateUser,
    getRanking
};  