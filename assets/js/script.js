/* REFERENCES */
/*
Copie de node: https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
Boucle forEach: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
Shorthand if: https://www.w3schools.com/c/c_conditions_short_hand.php
Node parent: https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
Methodes prototype des arrays: https://www.w3schools.com/js/js_object_methods.asp
Obtenir le nom d'un constructeur: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
*/


/* VARIABLES */
const
btnNavQuiz = document.querySelector(".navQuiz"),
btnClearStorage = document.querySelector(".clearStorage"),
quizDisplay = document.querySelector(".quiz-display"),
leaderboardDisplay = document.querySelector(".leaderboard"),
// copie en profondeur (avec enfants) d'un element DOM
refBtnTri = document.querySelector(".test").cloneNode(true);

let
numeroQuestion = 0,
nbBonnesReponses = 0,
nbQsTotales = questionnaire.length,
noTentative,
temps = 0,
// id setInterval
setIID,
// liste de tous les btn pour le tri
lstBtnTri,
newData = true,

// config de tri
// ordre de tri
configOrdre = "d",
// propriete a trier
configPropriete = "tentative",
sortConfig = [configOrdre, configPropriete];

console.log(questionnaire, btnNavQuiz, btnClearStorage, quizDisplay, leaderboardDisplay, refBtnTri);


/* ECOUTEURS D'EVENEMENTS */
btnNavQuiz.addEventListener("click", processNextAction);
btnClearStorage.addEventListener("click", function(){
    localStorage.clear();
});


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

    if(newData){
        currentTentativeData = new LeaderboardData(noTentative, nbBonnesReponses, temps);
        leaderboard.push(currentTentativeData);
        newData = false;
    }

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    // leaderboard.sort(triLeaderboardReussiteDescendant);
    leaderboard.sort(triLeaderboardReussiteDescendant(sortConfig[0], sortConfig[1]));
    // console.log(leaderboard);

    while(leaderboard.length > 10){
        leaderboard.pop();
    }

    viderConteneur(leaderboardDisplay);
    let head = leaderboardDisplay.createTHead();
    let body = leaderboardDisplay.createTBody();
    let foot = leaderboardDisplay.createTFoot();
    let row = head.insertRow();
    // console.log(head, body, foot, row);
    massCreateTableData(row, true, ["# Tentative", "Nombre bonnes réponses", "% Taux réussite", "Temps (min : sec)"]);
    lstBtnTri = document.querySelectorAll(".tri");
    lstBtnTri.forEach(function(element){
        element.addEventListener("click", function(e){
            updateSortBtnVisual([sortConfig[0], this.dataset.property], e);
        });
    });
    // console.log(lstBtnTri);
    updateSortBtnVisual(sortConfig);

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
    newData = true;
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
    // je vais pas faire otut un if else pour 1 lettre de difference...
    let tag = thTagInstead ? "TH" : "TD";

    for(let [index, data] of lstData.entries()){
        let cell = document.createElement(tag);

        if(tag == "TH"){
            let properties = Object.keys(leaderboard[0]);
            let conteneur = document.createElement("div");
            conteneur.classList.add("titreTri");
            conteneur.textContent = data;
            refBtnTri.dataset.property = properties[index];
            conteneur.append(refBtnTri.cloneNode(true));
            cell.append(conteneur);
        }else{
            cell.textContent = data;
        }

        row.append(cell);
    }
}

/**
 * Traque le tmeps ecoule
 */
function chronometre(){
    temps++;
}

/**
 * 
 * @param {Array} config 
 * @param {MouseEvent} e 
 */
function updateSortBtnVisual(config, e){
    let btn = document.querySelector(`.tri[data-property='${config[1]}']`);
    // console.log(btn);
    // let index = config[0] == "d" ? 0 : 1;
    let index = config[0];
    // console.log(index, !index);

    for(let btn of lstBtnTri){
        for(let span of btn.children){
            span.classList.remove("sortOn");
        }
    }
    if(e != undefined){
        // target donne l'un des span, alors je get le parent
        let btn = e.target.parentNode;
        // console.log(btn);
        btn.querySelector(`span:not([data-sort-order='${index}'])`).classList.add("sortOn");
        // console.log(btn.children, index);
    }else{
        // console.log(btn, typeof(btn), btn.constructor.name);
        btn.querySelector(`span[data-sort-order='${index}']`).classList.add("sortOn");
        // console.log(btn.children[index], btn.children[index].classList);
    }

    configOrdre = btn.querySelector("span.sortOn").dataset.sortOrder;
    // console.log(btn.querySelector("span.sortOn"), btn.querySelector("span.sortOn").dataset.sortOrder);
    configPropriete = btn.dataset.property;
    sortConfig = [configOrdre, configPropriete];
    localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
    // console.log(configOrdre, configPropriete, sortConfig);
    // leaderboard.sort(triLeaderboardReussiteDescendant(sortConfig[0], sortConfig[1]));

    if(e != undefined){
        endScreen();
    }
}


/* EXECUTION */
displayQuestion();
leaderboardDisplay.style.display = "none";
noTentative = localStorage.getItem("nbTotalTentatives");
// console.log(leaderboard, leaderboard[0]);
// puisque leaderboard est const, copie doit etre faite avec methode prototype assign()
Object.assign(leaderboard, JSON.parse(localStorage.getItem("leaderboard")));
// console.log(leaderboard, leaderboard[0], JSON.parse(localStorage.getItem("leaderboard")));
// modification de la ref
refBtnTri.classList.replace("test", "tri");
console.log(refBtnTri);
sortConfig = JSON.parse(localStorage.getItem("sortConfig"));

if(noTentative == null){
    noTentative = 1;
}else{
    noTentative = Number(noTentative) + 1;
}
if(sortConfig == null){
    sortConfig = [configOrdre, configPropriete] = ["d", "tentative"];
}else{
    [configOrdre, configPropriete] = sortConfig;
}

localStorage.setItem("nbTotalTentatives", noTentative);
// localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
// commencer le timer
setIID = setInterval(chronometre, 1000);


// localStorage.clear();
