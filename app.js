'use strict';

let player1 = {};
let player2 = {};
let results = {
    winner: '',
    trumpSuit: '',
    playersScore: [],
    playersRounds: []
  };
let deck = {
  cards: [], //колода - массив карт
  trumpSuit: '',

  init: function() {
    //заполняем колоду
    for (var i = 0; i < 36; i++)
      this.cards[i] = new Card(i);
  },
  shuffle: function() {
    this.cards.sort((a, b) => Math.random() - 0.5);
  },
  getTrumpSuit: function(...suits) {
    let random = Math.floor(Math.random() * (suits.length));
    return this.trumpSuit = suits[random];
  },
  giveOutСards: function(...players) {
    let that = this;
    let len = that.cards.length;
    function getRandomCard() {
      return that.cards.splice(Math.ceil(Math.random() * that.length - 1), 1)[0];
    }
    for (let i = 0; i < len / players.length; i++) {
      for (let j = 0; j < players.length; j++) {
        players[j].cards.push(getRandomCard());
      }
    }
  }
};

//конструктор карты
function Card(number) {
  //вспомогательные массивы
  let suits = ['бубен', 'пик', 'треф', 'червей'];
  let names = ['6', '7', '8', '9', '10', 'Валет', 'Дама', 'Король', 'Туз'];
  let values = [6, 7, 8, 9, 10, 11, 12, 13, 14];
  //определяем свойства карты по ее номеру
  this.suit = suits[parseInt(number / 9)]; //масть
  this.name = names[number % 9]; //название
  this.value = values[number % 9]; //значение
  this.img = new Image(100, 150);
  this.img.src = 'img/' + number + '.jpg'; //путь к изображению
  //задаем дополнительные атрибуты изображения
  this.img.alt = this.setAltName();
  this.img.className = 'Card';
}

Card.prototype.setAltName = function() {
  return this.name + ' ' + this.suit;
}
//конструктор игрока
function Player(name) {
  this.name = name;
  this.cards = [];
  this.score = null;
}

function playCardGame(results, player1, player2) {
  let index = player1.cards.length;
  getTrumpSuitResult(deck);
  scoring();
  getGameResult();

  function getTrumpSuitResult(deck) {
    results.trumpSuit = deck.getTrumpSuit('бубен', 'пик', 'треф', 'червей');
  }

  function scoring() {
    while (0 !== index) {
      let lastCardOne = player1.cards.pop();
      let lastCardTwo = player2.cards.pop();
      let round = [];
      round.push(lastCardOne, lastCardTwo); //сохранение раундов
      results.playersRounds.push(round);
      index -= 1;
      if (lastCardOne.suit !== deck.trumpSuit && lastCardTwo.suit !== deck.trumpSuit) {
        if (lastCardOne.value > lastCardTwo.value) {
          player1.score += 1;
        } else if (lastCardOne.value < lastCardTwo.value){
          player2.score += 1;
        };
      } else if (lastCardOne.suit === deck.trumpSuit && lastCardTwo.suit === deck.trumpSuit) {
        if (lastCardOne.value > lastCardTwo.value) {
          player1.score += 1;
        } else {
          player2.score += 1;
        };
      } else if (deck.trumpSuit === lastCardOne.suit) {
        player1.score += 1;
      } else if (deck.trumpSuit === lastCardTwo.suit) {
        player2.score += 1;
      };
    }
  }

  function getGameResult() {
    results.playersScore[0] = player1.score;
    results.playersScore[1] = player2.score;
    if (player1.score === player2.score) {
      return results.winner = 'Дружба';
    } else if (player1.score > player2.score) {
      return results.winner = 'Петя';
    } else {
      return results.winner = 'Вася';
    };
  }
}

function showResult(results) {
  document.getElementById('winner').innerHTML = `Winner: ${results.winner}.`;
  document.getElementById('suit').innerHTML = `Suit: ${results.trumpSuit}`;
  document.getElementById('score').innerHTML = `Счет:  ${results.playersScore[0]}:${results.playersScore[1]}`;
  showTable();

  function showTable() {
    let rounds = results.playersRounds;
    let countRounds = rounds.length;
    let table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('width', '200');
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    tr.innerHTML = '<td>Петя</td><td>Вася</td>';
    tbody.appendChild(tr);
    for (let i = 0; i < countRounds; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < 2; j++) {
        let td = document.createElement('td');
        let item = rounds[i][j].img;
        // console.log(item);
        td.appendChild(item);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    document.getElementById('rounds-table').appendChild(table);
  }
}

window.onload = function() {
  deck.init(); //заполняем колоду картами
  deck.shuffle(); //тасуем колоду
  player1 = new Player('Петя'); //первый игрок
  player2 = new Player('Вася'); //второй игрок
  deck.giveOutСards(player1, player2); //раздаем карты
  playCardGame(results, player1, player2);
  showResult(results); //отображение результатов на странице
}
