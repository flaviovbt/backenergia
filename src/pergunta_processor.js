async function selecionarAleatoriamente(array) {

    let quantidade = 10;
    let perguntasFiltradas = [];
    let pergunta;
    let randomIndex;
    const copiaArray = [...array];

    while (quantidade > 0) {
        randomIndex = Math.floor(Math.random() * array.length);

        if (array[randomIndex] != undefined) {
            pergunta = copiaArray[randomIndex];
            await shuffleArray(pergunta.alternativas)
            perguntasFiltradas.push(pergunta);
            delete array[randomIndex];
            quantidade--;
        } 
    }

    await shuffleArray(perguntasFiltradas);

    console.log(perguntasFiltradas);

    return perguntasFiltradas;
}

async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Gere um índice aleatório entre 0 e i
      // Troque os elementos de posição
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

module.exports = {
    selecionarAleatoriamente
};  