/*******************************************************************
 * sample-1.js
 * 
 *  created by Y.Miyamoto on 2021.08.27
 *
 *  Poker game oojs
 *  Modified -3- version
 *******************************************************************/

let card = new CreateDeck();
let player_1 = new CreatePlayer(1, "first player");
let player_2 = new CreatePlayer(2, "secound player");
let player_3 = new CreatePlayer(3, "third player");
let player_4 = new CreatePlayer(4, "fourth player");


/**
 * 初期手札作成
 * @param {*} gameNumber 〇戦目[0~4]
 * @param {*} gameResult 対戦結果
 * @param {*} allCards 山札
 * @param {*} CreateCards allCardsの作成
 */
function CreateDeck() {
    this.gameNumber = 0;
    this.gameResult = PrepareCardsFrame();
    this.allCards = PrepareCardsFrame();
    this.CreateCards = function(allCards, gameNumber) {
        let markName = "";
        for(let j = 0 ; j < 4 ; j ++) {
            let k = j * 13;
            if(j === 0) {
                markName = "spade";
            } else if(j === 2) {
                markName = "club";
            } else if(j === 3) {
                markName = "diamond";
            } else {
                markName = "heart";
            }
            for(let i = 1 ; i <= 13 ; i ++) {
                let value = i;
                if (value === 1) {
                    value = 14;
                }
                allCards[gameNumber][k] = {name: `${markName}_${i}`, mark: markName, value: value};
                k++;
            }
        }
        ShuffleCards(allCards, gameNumber);
    };
}
/**
 * create pleyer date
 * @param {*} playerNum [1, 2, 3, 4]
 * @param {*} playerName [name]
 * @param {*} playerCards [〇戦目][手札]
 * @param {*} playerHand []
 */
function CreatePlayer(playerNum, playerName) {
    this.playerNum = playerNum;
    this.playerName = playerName;
    this.playerCards = PrepareCardsFrame();
    this.playerHand = [];
    this.playerResult = PrepareCardsFrame();
}
function PrepareCardsFrame() {
    let array = [];
    for(let i = 0 ; i < 5 ; i ++) {
        array[i] = [];
    }
    return array;
}

// start play player_but
function play_but() {
    let start = document.getElementById("start"),
        game = document.getElementById("game"),
        game_1 = document.getElementById("game_1"),
        game_1_comment = document.getElementById("game_1_comment");

    let children = game.childNodes;

    game_1_comment.innerHTML = (card.gameNumber + 1);
    start.style.display = "none";
    game.style.display = "block";
    for(let i = 1 ; i <= 5 ; i += 2) {
        children[i].style.display = "none";
    }
    game_1.style.display = "block"

    comment_on("comment_1");
    game_start();
}

/**
 * game_start
 */
function game_start() {
    card.gameNumber;
    card.allCards;
    card.CreateCards(card.allCards, card.gameNumber);

    dealDeck(card, player_1);
    Judgment(player_1);
}


/**
 * 手札を配るプログラム
 * @param {*} game_Num 
 * @param {*} player_num 
 */
function dealDeck(card, player_num) {
    let gameNumber = card.gameNumber;
    ShuffleCards(card.allCards, gameNumber);
    for(let i = 0 ; i < 5 ; i++) {
        player_num.playerCards[gameNumber][i] = card.allCards[gameNumber][0];
        card.allCards[gameNumber].splice(0, 1);
    }

    // display
    if(player_num.playerNum === 1) {
        //displayUpdate(gameNumber, player_num);
        for(let i = 0 ; i < 5 ; i++ ) {
            let cards_img_num = document.getElementById("cards_img_" + (i + 1));
    
            cards_img_num.src = `./images/cards/${player_num.playerCards[gameNumber][i].mark}_${player_num.playerCards[gameNumber][i].value}.png`;
            //console.log(`./images/cards/${player_num.playerCards[gameNumber][i].mark}_${player_num.playerCards[gameNumber][i].value}.png`);
        }
    }
}
/**
 * 山札をシャッフルするプログラム
 * @param {*} allCards card.allCards
 * @param {*} gameNumber card.gameNumber
 * @returns 
 */
function ShuffleCards(allCards, gameNumber) {
    let len = allCards[gameNumber].length;
    let temp,
        i;

    while(len--) {
        i = Math.floor(Math.random() * len);
        temp = allCards[gameNumber][len];
        allCards[gameNumber][len] = allCards[gameNumber][i];
        allCards[gameNumber][i] = temp;
    }
    return allCards;
}


/**
 * カード交換 (player_1)
 */
let exchangeCards = {1: false, 2: false, 3: false, 4: false, 5: false};
function chooseCards(num) {
    let cards_but_num = document.getElementById("cards_but_" + num),
        cards_num = document.getElementById("cards_" + num);

    if(exchangeCards[num - 1] === true) {
        exchangeCards[num - 1] = false;
        cards_num.style.backgroundColor= "forestgreen";
        cards_but_num.style.backgroundColor = "white";
    } else {
        exchangeCards[num - 1] = true;
        cards_num.style.backgroundColor = "yellow";
        cards_but_num.style.backgroundColor = "yellow";
    }
}
function ExchangeButton() {
    let game = document.getElementById("game"),
        game_2 = document.getElementById("game_2");

    let children = game.childNodes;
    game.style.display = "block";
    for(let i = 1 ; i <= 5 ; i += 2) {
        children[i].style.display = "none";
    }    
    game_2.style.display = "block"
    
    dealDeck(card, player_2);
    Judgment(player_2);
    dealDeck(card, player_3);
    Judgment(player_3);
    dealDeck(card, player_4);
    Judgment(player_4);

    Exchange(card, player_1, exchangeCards);
    Exchangethers(card, player_2);
    Exchangethers(card, player_3);
    Exchangethers(card, player_4);
}

/**
 * カード交換 (player_2~4)
 */
function Exchangethers(card, player_num) {
    let sameNumber = [];
    let gameNumber = card.gameNumber;
    let handTotalPoint = 0;
    for(n in player_num.playerHand[gameNumber]) {
        handTotalPoint += player_num.playerHand[gameNumber][n];
    }
    if(handTotalPoint < 150) {
        for(n in player_num.playerCards[gameNumber]) {
            sameNumber[n] = true;
        }
        for(let i = 0 ; i < 4 ; i ++) {
            for(let j = i + 1 ; j < 5 ; j ++) {
                if(player_num.playerCards[gameNumber][i].value === player_num.playerCards[gameNumber][j].value) {
                    sameNumber[i] = false;
                    sameNumber[j] = false;
                }
            }
        }
        // sameNumber == true --> card change
        Exchange(card, player_num, sameNumber);
    }
    /* console.log(sameNumber); */
}
/**
 * カードの交換
 */
function Exchange(card, player_num, exchangeCards) {
    let gameNumber = card.gameNumber;
    ShuffleCards(card.allCards[gameNumber], gameNumber);

    for(i in exchangeCards) {
        if(exchangeCards[i] === true) {
            player_num.playerCards[gameNumber][i] = card.allCards[gameNumber][0];
            card.allCards[gameNumber].splice(0, 1);
        }
    }
    
    Judgment(player_num);
    displayUpdate(gameNumber, player_num);
}
/**
 * Display on html-cards_img_num
 * @param {*} gameNumber card.gameNumber
 * @param {*} player_num [player_1 ~ 4]
 */
function displayUpdate(gameNumber, player_num) {
    let player_num_cards = document.getElementById("player_" + player_num.playerNum + "_cards");
    let game_2_comment = document.getElementById("game_2_comment");

    let j = 0;

    let player_num_comment = player_num_cards.childNodes[13];
    let handTotalPoint = player_num.playerHand[gameNumber];
    let handName = "";

    game_2_comment.innerHTML = (gameNumber + 1);

    for(let i = 3 ; i <= 11 ; i += 2) {
        let player_num_img_i = player_num_cards.childNodes[i];
        player_num_img_i.src = `./images/cards/${player_num.playerCards[gameNumber][j].mark}_${player_num.playerCards[gameNumber][j].value}.png`;
        j ++;
    }

    if(handTotalPoint === 0) {
        handName = "ノーペア";
    } else if(handTotalPoint < 50) {
        handName = "ワンペア";
    } else if(handTotalPoint < 100) {
        handName = "ツーペア";
    } else if(handTotalPoint < 150) {
        handName = "スリーカード";
    } else if(handTotalPoint < 200) {
        handName = "ストレート";
    } else if(handTotalPoint < 250) {
        handName = "フラッシュ";
    } else if(handTotalPoint < 300) {
        handName = "フルハウス";
    } else if(handTotalPoint < 350) {
        handName = "フォーカード";
    } else if(handTotalPoint === 378) {
        handName = "ロイヤルストレートフラッシュ";
    } else {
        handName = "ストレートフラッシュ";
    }
    player_num_comment.innerHTML = handName;
}


/**
 * 役の判定
 */
function Judgment(player_num) {
    //Aggregation of numbers
    let AggregatioNumers = {
        2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0 
    };
    let AggregationMark = {
        "spade": 0, "club": 0, "diamond": 0, "heart": 0,
    }
    let gameNumber = card.gameNumber;

    for(n in player_num.playerCards[gameNumber]) {
        //Judgment numbers
        for(let i = 2 ; i <= 14 ; i ++) {
            if(i === player_num.playerCards[gameNumber][n].value) {
                AggregatioNumers[i] += 1;
            }
        }
        //Judgment mark
        if("spade" === player_num.playerCards[gameNumber][n].mark) {
            AggregationMark.spade += 1;
        } else if("club" === player_num.playerCards[gameNumber][n].mark) {
            AggregationMark.club += 1;
        } else if("diamond" === player_num.playerCards[gameNumber][n].mark) {
            AggregationMark.diamond += 1;
        } else {
            AggregationMark.heart += 1;
        }
    }
    JudgmentHand(gameNumber, player_num, AggregatioNumers, AggregationMark);

}
function JudgmentHand(gameNumber, player_num, AggregatioNumers, AggregationMark) {
    let handPoint = [0];
    let handTotalPoint = 0;
    //Find the pair
    for(let i = 2 ; i <= 14 ; i ++) {
        if(AggregatioNumers[i] === 2) {
            if(handPoint.length === 2) {
                handPoint.push(i + 50);
            } else {
                handPoint.push(i);
            }
        }
    }
    //Find the three pair or full house
    for(let i = 2 ; i <= 14 ; i ++) {
        if(AggregatioNumers[i] === 3) {
            if(handPoint.length === 2) {
                handPoint.push(i + 250);
            } else {
                handPoint.push(i + 100);
            }
        }
    }
    //Find the four cards
    for(let i = 2 ; i <= 14 ; i ++) {
        if(AggregatioNumers[i] === 4) {
            handPoint.push(i + 300);
        }
    }
    //Find the straight
    for(let i = 2 ; i <= 10 ; i ++) {
        if(AggregatioNumers[i] === 1) {
            if(AggregatioNumers[i + 1] === 1 && AggregatioNumers[i + 2] === 1 && AggregatioNumers[i + 3] === 1 && AggregatioNumers[i + 4] === 1) {
                handPoint.push(i + 4 + 150);
            }else {
                break;
            }
        }
    }
    //Find the flash
    for(n in AggregationMark) {
        if(AggregationMark[n] === 5) {
            let maxNumvers = 0;
            for(let i = 14 ; i >= 2 ; i --) {
                if(AggregatioNumers[i] === 1) {
                    maxNumvers = i;
                    break;
                }
            }
            handPoint.push(maxNumvers + 200);
        }
    }
    for(n in handPoint) {
        handTotalPoint += handPoint[n];
    }
    player_num.playerHand[gameNumber] = handTotalPoint;

    /* console.log(player_num.playerName);
    console.log(player_num.playerCards[gameNumber]);
    console.log(player_num.playerHand[gameNumber]); */
}




// game_2 button
function ResultDisplay() {
    let game = document.getElementById("game"),
        game_3 = document.getElementById("game_3"),
        game_3_comment = document.getElementById("game_3_comment");

    let children = game.childNodes;

    game_3_comment.innerHTML = (card.gameNumber + 1);

    game.style.display = "block";
    for(let i = 1 ; i <= 5 ; i += 2) {
        children[i].style.display = "none";
    }
    game_3.style.display = "block";

    CompareHand();

    for(let i = 0 ; i < 4 ; i ++) {
        let rank_num = document.getElementById("rank_" + ( i + 1 ));
        rank_num.childNodes[1].innerHTML = card.gameResult[card.gameNumber][i * 2];
        rank_num.childNodes[3].innerHTML = card.gameResult[card.gameNumber][( i * 2 ) + 1];
        if(card.gameResult[card.gameNumber][i * 2] === 1) {
            rank_num.childNodes[1].style.color = "gold";
            rank_num.childNodes[3].style.color = "gold";
        } else if(card.gameResult[card.gameNumber][i * 2] === 2) {
            rank_num.childNodes[1].style.color = "silver";
            rank_num.childNodes[3].style.color = "silver";
        } else if(card.gameResult[card.gameNumber][i * 2] === 3) {
            rank_num.childNodes[1].style.color = "#815a2b";
            rank_num.childNodes[3].style.color = "#815a2b";
        } else {
            rank_num.childNodes[1].style.color = "blueviolet";
            rank_num.childNodes[3].style.color = "blueviolet";
        }

        // blueviolet gold silver #815a2b
    }
}

// game_3 button
function NextGame() {
    let game = document.getElementById("game"),
        end = document.getElementById("end"),
        game_1 = document.getElementById("game_1");

    let children = game.childNodes;
    game.style.display = "block";
    for(let i = 1 ; i <= 5 ; i += 2) {
        children[i].style.display = "none";
    }
    game_1.style.display = "block";

    for(let i = 1 ; i <= 5 ; i ++) {
        let cards_but_num = document.getElementById("cards_but_" + i),
            cards_num = document.getElementById("cards_" + i);

        exchangeCards[i - 1] = false;
        cards_num.style.backgroundColor= "forestgreen";
        cards_but_num.style.backgroundColor = "white";
    }

    if(card.gameNumber <= 3) {
        card.gameNumber += 1;
        play_but();
    } else {
        FinalResult();
        game.style.display = "none";
        end.style.display = "block";
    }
}

// end section button
function GameReset() {
    let start = document.getElementById("start"),
        end = document.getElementById("end");

    start.style.display = "block";
    end.style.display = "none";

    card = new CreateDeck();
    player_1 = new CreatePlayer(1, "first player");
    player_2 = new CreatePlayer(2, "secound player");
    player_3 = new CreatePlayer(3, "third player");
    player_4 = new CreatePlayer(4, "fourth player");
}

/**
 * 一戦ごとの順位を判定
 */
function CompareHand() {
    let gameNumber = card.gameNumber;

    let allPlayerHand = {"player_1": 0, "player_2": 0, "player_3": 0, "player_4": 0};
    allPlayerHand.player_1 = player_1.playerHand[gameNumber];
    allPlayerHand.player_2 = player_2.playerHand[gameNumber];
    allPlayerHand.player_3 = player_3.playerHand[gameNumber];
    allPlayerHand.player_4 = player_4.playerHand[gameNumber];
    
    let rank = 1;
    for(let i = 0 ; rank <= 4 ; i ++) {
        let max = 0;
        for(n in allPlayerHand) {
            if(max <= allPlayerHand[n]) {
                max = allPlayerHand[n];
            }
        }
        for(n in allPlayerHand) {
            if(max === allPlayerHand[n]) {
                card.gameResult[gameNumber].push(rank, n);
                delete allPlayerHand[n];
            }
        }
        rank = 5 - Object.keys(allPlayerHand).length;
    }
    for(let i = 1 ; i <= 7 ; i += 2) {
        if(card.gameResult[gameNumber][i] === "player_1") {
            player_1.playerResult[gameNumber] = card.gameResult[gameNumber][i - 1];
        } else if(card.gameResult[gameNumber][i] === "player_2") {
            player_2.playerResult[gameNumber] = card.gameResult[gameNumber][i - 1];
        } else if(card.gameResult[gameNumber][i] === "player_3") {
            player_3.playerResult[gameNumber] = card.gameResult[gameNumber][i - 1];
        } else {
            player_4.playerResult[gameNumber] = card.gameResult[gameNumber][i - 1];
        }
    }
    //console.log(card.gameResult);
}

function FinalResult() {
    ReflectionTable(player_1, 1);
    ReflectionTable(player_2, 2);
    ReflectionTable(player_3, 3);
    ReflectionTable(player_4, 4);

    let aggregation = {"player_1": 0, "player_2": 0, "player_3": 0, "player_4": 0};
    aggregation.player_1 = player_1.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation.player_2 = player_2.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation.player_3 = player_3.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation.player_4 = player_4.playerResult.reduce((sum, element) => sum + element, 0);

    let z = -4;
    for(let i = 0 ; i < 4 ; i ++) {
        let max = 0;
        for(n in aggregation) {
            if(max <= aggregation[n]) {
                max = aggregation[n];
            }
        }
        for(n in aggregation) {
            if(max === aggregation[n]) {
                aggregation[n] = (z + i);
            }
        }
    }
    //console.log(aggregation);

    let rank = 1;
    for(let i = -1 ; i >= -4 ; i --) {
        let j = 0;
        for(n in aggregation) {
            if(i === aggregation[n]) {
                let final_result_num = document.getElementById("final_result_" + (rank + j));
                final_result_num.childNodes[1].innerHTML = rank;
                final_result_num.childNodes[3].innerHTML = n;
                if(rank === 1) {
                    final_result_num.childNodes[1].style.color = "gold";
                    final_result_num.childNodes[3].style.color = "gold";
                } else if(rank === 2) {
                    final_result_num.childNodes[1].style.color = "silver";
                    final_result_num.childNodes[3].style.color = "silver";
                } else if(rank === 3) {
                    final_result_num.childNodes[1].style.color = "#815a2b";
                    final_result_num.childNodes[3].style.color = "#815a2b";
                } else {
                    final_result_num.childNodes[1].style.color = "blueviolet";
                    final_result_num.childNodes[3].style.color = "blueviolet";
                }
                j ++;
            }
        }
        rank = rank + j;
    }

    /* let aggregation_hand = {"player_1": 0, "player_2": 0, "player_3": 0, "player_4": 0};
    aggregation_hand.player_1 = player_1.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation_hand.player_2 = player_2.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation_hand.player_3 = player_3.playerResult.reduce((sum, element) => sum + element, 0);
    aggregation_hand.player_4 = player_4.playerResult.reduce((sum, element) => sum + element, 0);

    let x = -4;
    for(let i = 0 ; i < 4 ; i ++) {
        let max = 0;
        for(n in aggregation_hand) {
            if(max <= aggregation_hand[n]) {
                max = aggregation_hand[n];
            }
        }
        for(n in aggregation_hand) {
            if(max === aggregation_hand[n]) {
                aggregation_hand[n] = (x + i);
            }
        }
    }
    //console.log(aggregation);

    rank = 1;
    for(let i = -1 ; i >= -4 ; i --) {
        let j = 0;
        for(n in aggregation_hand) {
            if(i === aggregation_hand[n]) {
                let final_result_num = document.getElementById("final_result_hand_" + (rank + j));
                final_result_num.childNodes[1].innerHTML = rank;
                final_result_num.childNodes[3].innerHTML = n;
                if(rank === 1) {
                    final_result_num.childNodes[1].style.color = "gold";
                    final_result_num.childNodes[3].style.color = "gold";
                } else if(rank === 2) {
                    final_result_num.childNodes[1].style.color = "silver";
                    final_result_num.childNodes[3].style.color = "silver";
                } else if(rank === 3) {
                    final_result_num.childNodes[1].style.color = "#815a2b";
                    final_result_num.childNodes[3].style.color = "#815a2b";
                } else {
                    final_result_num.childNodes[1].style.color = "blueviolet";
                    final_result_num.childNodes[3].style.color = "blueviolet";
                }
                j ++;
            }
        }
        rank = rank + j;
    } */
}
/**
 * 各ゲームの順位を表示する
 * @param {*} player_num 
 * @param {*} num 
 */
function ReflectionTable(player_num, num) {
    let all_result_num = document.getElementById("all_result_" + num);
    let j = 0;
    for(let i = 2 ; i <= 6 ; i ++) {
        all_result_num.childNodes[i].innerHTML = player_num.playerResult[j] + "位";
        j ++;
    }
}



/**
 * htnl
 */
// comment on
function comment_on(elementId) {
    let comment = document.getElementById("comment");
    let element = document.getElementById(elementId);
    let children = comment.childNodes;

    comment.style.display = "block";
    for(let i = 1 ; i <= 5 ; i += 2) {
        children[i].style.display = "none";
    }
    element.style.display = "block";

}
// comment off
function comment_off() {
    let comment = document.getElementById("comment");
    comment.style.display = "none";
}


/***************************************************************
 * workbench
 ***************************************************************/
function button2() {
    let comment = document.getElementById("comment");
    let children = comment.childNodes;

    console.log(children);

    children[1].style.display = "none";
}

function ViewplayerCards() {
    console.log("player_1");
    console.log(player_1.playerCards[card.gameNumber]);
    console.log("player_2");
    console.log(player_2.playerCards[card.gameNumber]);
    console.log("player_3");
    console.log(player_3.playerCards[card.gameNumber]);
    console.log("player_4");
    console.log(player_4.playerCards[card.gameNumber]);
    console.log("playerHand")
    console.log("player_1");
    console.log(player_1.playerHand[card.gameNumber]);
    console.log("player_2");
    console.log(player_2.playerHand[card.gameNumber]);
    console.log("player_3");
    console.log(player_3.playerHand[card.gameNumber]);
    console.log("player_4");
    console.log(player_4.playerHand[card.gameNumber]);
}

