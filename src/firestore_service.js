const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter, QuerySnapshot } = require('firebase-admin/firestore');

const serviceAccount = require('.././security/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const colRef = db.collection('users');

async function setUser(email, nome, vitorias) {
    try {
      // Define os dados que serão salvos no documento
      const userData = {
        email: email,
        nome: nome,
        vitorias: vitorias
      };

      const create = colRef.doc(email);
  
      await create.set(userData);
      console.log('Dados salvos com sucesso no Firestore!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
}

async function getUsers(){
    try {
        let users = [];

        const snapshot = await colRef.get();
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

async function getUser(email){
    try {
        let user;

        const snapshot = await colRef.get();
        snapshot.forEach((doc) => {
            if(doc.id == email){
                user = doc.data();
            }
        });

        console.log('Dados recuperados com sucesso do Firestore!');

        return user;
    } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        return error;
    }
}

module.exports = {
    setUser,
    getUsers,
    getUser
};  