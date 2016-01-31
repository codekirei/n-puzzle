'use strict'

//----------------------------------------------------------
// utility fns
//----------------------------------------------------------
// durstenfeld shuffle
function shuffle(unshuffledAr) {
  var ar = unshuffledAr.slice(0)
  for (var i = ar.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1))
    var hold = ar[i]
    ar[i] = ar[rand]
    ar[rand] = hold
  }
  return ar
}

//----------------------------------------------------------
// application
//----------------------------------------------------------
function nPuzzle() {
  // setup
  //----------------------------------------------------------
  var n = 15
  var tileCount = n + 1

  // pre-init elements
  var board = $('#game__board')
  var score = $('#score')

  // state
  var victoryState = []
  var states = []
  var state =
    { moves: 0
    , tiles: []
    , values: []
    }

  // calcs
  var rows = Math.sqrt(tileCount)
  var tileSize =
    Math.floor(
      ( board.innerWidth() -
        parseInt(board.css('padding')) * 2
      ) / rows - 10 // FIXME: magic number
    )
  var tileSizePx = tileSize + 'px'

  // create a tile div
  //----------------------------------------------------------
  function tile(num) {
    var props =
      { hasNum:
        { 'class': 'tile' }
      , blank:
        { 'class': 'tile blank-tile' }
      }
    var styles =
      { height: tileSizePx
      , width: tileSizePx
      , lineHeight: tileSizePx
      }
    return num === tileCount
      ? $('<div/>', props.blank).css(styles)
      : $('<div/>', props.hasNum).css(styles).html(num)
  }

  // generate initial state
  //----------------------------------------------------------
  function initState() {
    for (var i = 1; i <= tileCount; i++) victoryState.push(i)
    shuffle(victoryState).forEach(
      function(val) {
        state.tiles.push(tile(val))
        state.values.push(val)
      }
    )
  }

  // pure render fn
  //----------------------------------------------------------
  function render(currentState) {
    board.empty()

    currentState.tiles.forEach(
      function(t) { board.append(t) }
    )

    // TODO: set score
  }

  // find blank tile in tile array
  //----------------------------------------------------------
  function blankTilePos(currentState) {
    return currentState.values.indexOf(tileCount)
  }

  // check if current state is victory state
  //----------------------------------------------------------
  function isVictory(currentState) {
    var i = 0
    var victory = false
    while (i < tileCount) {
      if (currentState.values[i] === victoryState[i]) i++
      else break
      if (i === tileCount) victory = true
    }
    return victory
  }

  // initialize
  //----------------------------------------------------------
  initState()
  console.log(isVictory(state))
  render(state)
}

nPuzzle()
