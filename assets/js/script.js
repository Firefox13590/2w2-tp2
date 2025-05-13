/* VARIABLES */
const
btnNavQuiz = document.querySelector("button"),
quizDisplay = document.querySelector(".quiz-display"),
leaderboardDisplay = document.querySelector(".leaderboard");

let
numeroQuestion = 0,
nbBonnesReponses = 0,
nbQsTotales = questionnaire.length,
noTentative,
temps = 0,
setIID;

console.log(questionnaire, btnNavQuiz, quizDisplay, leaderboardDisplay);


/* ECOUTEURS D'EVENEMENTS */
btnNavQuiz.addEventListener("click", processNextAction);


/* FONCTIONS */
/**
 * Affiche le titre de la question ainsi que les choix
 */
function displayQuestion(){
    viderConteneur(quizDisplay);

    let
    titreQs = document.createElement("h2"),
    lstChoix = document.createElement("div");
    titreQs.textContent = numeroQuestion + 1 + " - " + questionnaire[numeroQuestion].titre;
    lstChoix.classList.add("conteneurChoix");

    for(let [index, value] of questionnaire[numeroQuestion].choix.entries()){
        let textOption = document.createElement("p");
        textOption.classList.add("choix");
        textOption.textContent = value;
        textOption.dataset.index = index;
        textOption.addEventListener("click", validationReponse);
        lstChoix.append(textOption);
    }

    quizDisplay.append(titreQs);
    quizDisplay.append(lstChoix);
}

/**
 * incremente le nb de questions et decide soit d'afficher la prochaine qs soit la fin du quiz
 */
function processNextAction(){
    if(numeroQuestion + 1 < nbQsTotales){
        numeroQuestion++;
        displayQuestion();
    }else{
        btnNavQuiz.removeEventListener("click", processNextAction);
        btnNavQuiz.textContent = "Recommencer le quiz";
        btnNavQuiz.addEventListener("click", restartQuiz);
        endScreen();
    }
}

/**
 * Check si la reponse cliquee est la bonne ou non
 * @param {MouseEvent} e Evenement click de l'interface MouseEvent
 */
function validationReponse(e){
    // console.log(e.target);

    if(Number(e.target.dataset.index) == questionnaire[numeroQuestion].reponse){
        console.log("bonne reponse");
        nbBonnesReponses++;
    }else{
        console.log("mauvaise reponse");
    }

    processNextAction();
}

/**
 * Affiche l'ecran de fin
 */
function endScreen(){
    clearInterval(setIID);
    quizDisplay.style.display = "none";
    leaderboardDisplay.style.display = "table";

    currentTentativeData = new LeaderboardData(noTentative, nbBonnesReponses, temps);
    leaderboard.push(currentTentativeData);

    while(leaderboard.length > 10){
        leaderboard.pop();
    }
    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    leaderboard.sort(triLeaderboardReussiteDescendant);
    console.log(leaderboard);

    viderConteneur(leaderboardDisplay);
    let head = leaderboardDisplay.createTHead();
    let body = leaderboardDisplay.createTBody();
    let foot = leaderboardDisplay.createTFoot();
    let row = head.insertRow();
    console.log(head, body, foot, row);
    massCreateTableData(row, true, ["# Tentative", "Nombre bonnes réponses", "% Taux réussite", "Temps (min : sec)"]);

    for(let stats of leaderboard){
        row = body.insertRow();
        massCreateTableData(row, false, Object.values(stats));
    }

    row = foot.insertRow();
    massCreateTableData(row, false, Object.values(currentTentativeData));
}

/**
 * Recommence le quiz
 */
function restartQuiz(){
    numeroQuestion = nbBonnesReponses = temps = 0;
    noTentative++;
    localStorage.setItem("nbTotalTentatives", noTentative);
    quizDisplay.style.display = "flex";
    leaderboardDisplay.style.display = "none";
    btnNavQuiz.removeEventListener("click", restartQuiz);
    btnNavQuiz.textContent = "Prochaine question";
    btnNavQuiz.addEventListener("click", processNextAction);
    setIID = setInterval(chronometre, 1000);
    displayQuestion();
}

/**
 * Fonction recursive pour vider tout le contenu(enfants) d'un element HTML
 * @param {Element} conteneur Conteneur HTML de type Element
 */
function viderConteneur(conteneur){
    if(conteneur.children.length > 0){
        conteneur.children[0].remove();
        viderConteneur(conteneur);
    }
}

/**
 * Insere plusieurs donnees en masse dans une table html
 * @param {Element} row La rangee ou ajouter les donnees
 * @param {Boolean} thTagInstead S'il faut utiliser le tag "th" au lieu de "td"
 * @param {Array} lstData Tableau contenant toutes les valeurs de donnees a ajouter
 */
function massCreateTableData(row, thTagInstead, lstData){
    let tag = thTagInstead ? "TH" : "TD";

    for(let data of lstData){
        let cell = document.createElement(tag);
        cell.textContent = data;
        row.append(cell);
    }
}

function chronometre(){
    temps++;
}


/* EXECUTION */
displayQuestion();
leaderboardDisplay.style.display = "none";
noTentative = localStorage.getItem("nbTotalTentatives");
// leaderboard = localStorage.getItem("leaderboard");
console.log(leaderboard, leaderboard[0]);
Object.assign(leaderboard, JSON.parse(localStorage.getItem("leaderboard")));
console.log(leaderboard, leaderboard[0], JSON.parse(localStorage.getItem("leaderboard")));

if(noTentative == null){
    noTentative = 1;
}else{
    noTentative = Number(noTentative) + 1;
}
// if(leaderboard == null){
//     leaderboard = [];
// }else{
//     leaderboard = JSON.parse(leaderboard);
// }

localStorage.setItem("nbTotalTentatives", noTentative);
setIID = setInterval(chronometre, 1000);


// localStorage.clear();

