/**
 * Structure pour questionnaire
 */
    // {
    //     // Nom jeu/franchise
    //     titre: "",
    //     choix: [
    //         "",
    //         "",
    //         "",
    //         "",
    //         "",
    //         "",
    //     ],
    //     reponse: 0,
    // },
const questionnaire = [
    {
        // Mario
        titre: "Pourquoi suis-je fan de la franchise Mario?",
        choix: [
            "J'adore financer les désirs capitalistes de Nintendo",
            "J'ai grandi avec cette franchise",
            "Mon premier jeu vidéo était un jeu Mario",
            "C'est meilleur que Zelda",
            "C'est hilarant de voir mes potes rager quand je les martyrise sur Mario Party",
            "À cause de la pub japonaise de Bowser qui s'est fait faire une radiographie et a retrouvé un amiibo de lui dans son rectum"
        ],
        reponse: 2,
    },
    {
        // Persona 4
        titre: "Qui est la best girl de Persona 4?",
        choix: [
            "Chie",
            "Yukiko",
            "Rise",
            "Naoto",
            "Marie",
            "Kanji"
        ],
        reponse: 5,
    },
    {
        // Clash of Clans
        titre: "Qu'est-ce COC?",
        choix: [
            "Un sérieux Conflit racial",
            "Un Coq",
            "Clash of Clans",
            "C'est le \"Center of Computers\"",
            "Un Palindrome",
            "COC"
        ],
        reponse: 0,
    },
    {
        // Minecraft
        titre: "Qui est Steve?",
        choix: [
            "L'enfant de Notch et Mojang",
            "Un homme blanc barbu, corpulent et massif dans la cinquantaine ",
            "Le gars carré",
            "Le petit ami d'Alex",
            "Monsieur Jobs",
            "Le commentateur de Family feud",
        ],
        reponse: 1,
    },
    {
        // Terraria
        titre: "Quelle est \"OBJECTIVEMENT\" la meilleure classe dans terraria?",
        choix: [
            "La classe Ranger. C'est l'équivalent de vivre aux USA et avoir au moins 42 armes a feu",
            "Meme si j'adore la classe Summoner, mon avocat m'a recommandé de ne pas en dire davantage",
            "Il faut être un joueur Melee! Satisfaction garantie quand tu facetank une attaque de destruction massive",
            "Thrower. Comme ça, t'existes pas. Tu peux pas perdre si tu n'existes même pas",
            "La classe Mage parce que c'est hilarant d'utiliser le pouvoir des drogues illicites pour tuer dieu",
            "Imagine se limiter aux classes vanilla...",
        ],
        reponse: 4,
    },
    {
        // Arknights
        titre: "Qui est la waifu #1?",
        choix: [
            "W",
            "Angelina",
            "Lappland",
            "Toutes ces réponses",
            "Manticore",
            "Texas",
        ],
        reponse: 3,
    },

];

/**
 * Structure pour leaderboard
 */
const leaderboard = [];

/**
 * Constructeur pour donnees leaderboard
 * @param {Number} tentative Numero de la tentative
 * @param {Number} nbBonnesReponses Nombre de bonnes responses
 * @param {Number} temps Temps ecoule, converti en string selon format "min : sec"
 */
function LeaderboardData(tentative, nbBonnesReponses, temps){
    this.tentative = tentative;
    this.nbBonnesReponses = nbBonnesReponses;
    this.tauxReussite = Math.round((this.nbBonnesReponses / nbQsTotales) * 100);
    this.temps = timeToString(temps);
}

/**
 * Compare 2 objets pour les trier selon le taux de reussite
 * @param {String} ordre Premier objet de comparaison
 * @param {String} propriete Deuxieme objet de comparaison
 * @returns Fonction lambda qui retourne valeur de tri
 * @example 
 * > 0 -> [b, a]
 * < 0 -> [a, b]
 * === 0 -> meme ordre
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function triLeaderboardReussiteDescendant(ordre, propriete){
    /**
     * @param {LeaderboardData} a Premier objet de comparaison
     * @param {LeaderboardData} b Deuxieme objet de comparaison
     */
    return function(a, b){
        if(propriete == "temps"){
            if(ordre == "d"){
                return stringToTime(b[propriete]) - stringToTime(a[propriete])
            }else{
                return stringToTime(a[propriete]) - stringToTime(b[propriete])
            }
        }else{
            // console.log(a[propriete], b[propriete]);
            if(ordre == "d"){
                return b[propriete] - a[propriete]
            }else{
                return a[propriete] - b[propriete]
            }
        }
    }
}

/**
 * Convertit le temps en secondes en une chaine de caracteres selon le format "min : sec"
 * @param {Number} temps Valeur de temps en secondes
 * @returns Chaine de caracteres au format "min : sec"
 */
function timeToString(temps){
    let minutes = Math.floor(temps / 60);
    let secondes = temps % 60;
    return `${minutes} : ${secondes}`
}

/**
 * Convertit Une chaine de caracteres de format "min : sec" en nombre avec le array destructuring
 * @param {String} temps Valeur de temps en format "min : sec"
 * @returns Valeur en nombre
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
 */
function stringToTime(temps){
    let minutes, secondes;
    [minutes, secondes] = temps.split(" : ");
    return Number(minutes) * 60 + Number(secondes)
}
