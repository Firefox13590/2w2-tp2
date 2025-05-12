/**
 * Structure pour questionnaire
 */
const questionnaire = [
    {
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
];

/**
 * Structure pour leaderboard
 */
let leaderboard = [];

/**
 * Constructeur pour donnees leaderboard
 * @param {Number} tentative 
 * @param {Number} nbBonnesReponses 
 * @param {Number} temps 
 */
function LeaderboardData(tentative, nbBonnesReponses, temps){
    this.tentative = tentative;
    this.nbBonnesReponses = nbBonnesReponses;
    this.tauxReussite = Math.round((this.nbBonnesReponses / nbQsTotales) * 100);
    this.temps = temps;
}

/**
 * Compare 2 objets pour les trier selon le taux de reussite
 * @param {LeaderboardData} a Premier objet de comparaison
 * @param {LeaderboardData} b Deuxieme objet de comparaison
 * @returns Valeur de retour du tri
 * @example 
 * > 0 -> [b, a]
 * < 0 -> [a, b]
 * === 0 -> meme ordre
 */
function triLeaderboardReussiteDescendant(a, b){
    return b.tauxReussite - a.tauxReussite
}
