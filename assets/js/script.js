/* VARIABLES */
const
btnNavQuiz = document.querySelector("button"),
quizDisplay = document.querySelector(".quiz-display");

let
numeroQuestion = 0,
nbBonnesReponses = 0;

console.log(questionnaire, btnNavQuiz, quizDisplay);


/* ECOUTEURS D'EVENEMENTS */
btnNavQuiz.addEventListener("click", processNextAction);


/* FONCTIONS */
/**
 * Affiche le titre de la question ainsi que les choix
 */
function displayQuestion(){
    while(quizDisplay.children.length > 0){
        quizDisplay.children[0].remove();
    }

    let
    titreQs = document.createElement("h2"),
    lstChoix = document.createElement("div");
    titreQs.textContent = questionnaire[numeroQuestion].titre;
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
    if(numeroQuestion + 1 < questionnaire.length){
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
 * @param {MouseEvent} e evenement click de l'interface MouseEvent
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
    while(quizDisplay.children.length > 0){
        quizDisplay.children[0].remove();
    }

    let textResults = document.createElement("p");
    textResults.innerHTML = `
                            Nombre de questions réussies: ${nbBonnesReponses}<br>
                            Nombre de questions totales: ${questionnaire.length}<br>
                            Taux de réussite: ${Math.round((nbBonnesReponses / questionnaire.length) * 100)}%`;
    quizDisplay.append(textResults);
}

/**
 * Recommence le quiz
 */
function restartQuiz(){
    numeroQuestion = nbBonnesReponses = 0;
    btnNavQuiz.removeEventListener("click", restartQuiz);
    btnNavQuiz.textContent = "Prochaine question";
    btnNavQuiz.addEventListener("click", processNextAction);
    displayQuestion();
}


/* EXECUTION */
displayQuestion();
