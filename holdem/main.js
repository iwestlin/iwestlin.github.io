let LANG = {
  reset: 'Already choose public cards, click reset button to reset',
  hand: 'Please choose 2 hand cards!',
  pub: 'Please choose 0~4 public public cards',
  player: 'Player',
  hc: 'hand cards',
  pc: 'public cards',
  more: 'Please select 2 or more players!'
}
const SUITS = ['spade', 'heart', 'club', 'diamond']
const VALUES = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
let playerCount = 0
let handCards = []
let publicCards = []

var chosen = id('chosen')
var info = id('info')
var handButton = id('chooseHandCards')
var pubButton = id('public')
var calcButton = id('calc')
var resetButton = id('reset')
var pokers = document.querySelectorAll('.container .poker')

handButton.addEventListener('click', function () {
  let selectedPokers = document.querySelectorAll('.container .selected')
  if (selectedPokers.length !== 2) {
    alert(LANG.hand)
  } else {
    let s = '<div class="cards">'
    let hc = []
    for (let i = 0; i < selectedPokers.length; i++) {
      hc.push(selectedPokers[i].id.split('_'))
      selectedPokers[i].classList.remove('selected')
      s += selectedPokers[i].outerHTML
    }
    handCards.push(hc)
    s += '<span> ' + LANG.player + ' ' +
    (playerCount + 1) + ' - ' +
    LANG.hc + '</span><hr /></div>'
    playerCount += 1
    chosen.innerHTML += s
  }
})

pubButton.addEventListener('click', function () {
  let selectedPokers = document.querySelectorAll('.container .selected')
  let slen = selectedPokers.length
  if (publicCards.length) {
    alert(LANG.reset)
  } else if (slen >= 5) {
    alert(LANG.pub)
  } else {
    if (slen === 0) return;
    let s = '<div class="cards">'
    for (let i = 0; i < slen; i++) {
      publicCards.push(selectedPokers[i].id.split('_'))
      selectedPokers[i].classList.remove('selected')
      s += selectedPokers[i].outerHTML
    }
    s += '<span> ' + LANG.pc + '</span><hr /></div>'
    chosen.innerHTML += s
  }
})

calcButton.addEventListener('click', function () {
  if (handCards.length < 2) {
    alert(LANG.more)
  } else {
    calcButton.disabled = 'true'
    axios.get(getQuery()).then(data => {
      showResult(data.data)
    }).catch(err => {
      console.log(err)
      alert('service error')
    })
  }
})

resetButton.addEventListener('click', function () {
  winRecords = [0, 0, 0]
  playerCount = 0
  handCards = []
  publicCards = []
  chosen.innerHTML = ''
  info.innerHTML = ''
  let scards = document.getElementsByClassName('selected')
  scards = Array.prototype.slice.call(scards)
  for (let i = 0; i < scards.length; i++) {
    scards[i].classList.remove('selected')
  }
})

window.onload = function () {
  for (let i = 0; i < pokers.length; i++) {
    pokers[i].onclick = triggerSelected(i)
  }
}

function triggerSelected (i) {
  return function () {
    pokers[i].classList.toggle('selected')
  }
}

function showResult (result) {
  let s = ''
  for (let i = 0; i < result.length; i++) {
    s += `<tr><td>${(i + 1)}</td><td>${toPercent(result[i].win)}</td><td>${toPercent(result[i].split)}</td></tr>`
  }
  info.innerHTML = s
  calcButton.disabled = ''
}

// hand=Ac+As|3s+4d&pub=Kd
function getHandCards () {
  var result = handCards.map(player => {
    return player.map(card => {
      return card[1] + card[0][0]
    })
  })
  result = result.map(player => {
    return player.join('+')
  })
  return result.join('|')
}

function getPubCards () {
  var result = publicCards.map(card => {
    return card[1] + card[0][0]
  })
  return result.join('+')
}

function getQuery () {
  var link = 'https://viegg.chinacloudsites.cn/texas?hand='
  return link + getHandCards() + '&pub=' + getPubCards()
}

function id (id) {
  return document.getElementById(id)
}

function toPercent (n) {
  n = Number(n) * 100
  n = n.toFixed(2)
  return n + '%'
}
