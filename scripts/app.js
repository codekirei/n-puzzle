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
function nPuzzle(n) {
  // assign initial vars
  //----------------------------------------------------------
  var tileCount = n + 1

  // pre-init elements
  var board = $('#game__board')
  var score = $('#score')

  // state
  var victoryState = []
  var states = []
  var state =
    { score: 0
    , tiles: []
    , values: []
    }

  // calcs
  var gridSize = Math.sqrt(tileCount)
  var gridSizeLessOne = gridSize - 1
  var tileSize =
    Math.floor(
      ( board.innerWidth() -
        parseInt(board.css('padding')) * 2
      ) / gridSize - 10 // FIXME: magic number
    )
  var tileSizePx = tileSize + 'px'

  // directional grid calc fns
  //----------------------------------------------------------
  function above(i) {
    return i - gridSize
  }

  function below(i) {
    return i + gridSize
  }

  function left(i) {
    return i - 1
  }

  function right(i) {
    return i + 1
  }

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

  // get index of blank tile
  //----------------------------------------------------------
  function blankTilePos() {
    return state.values.indexOf(tileCount)
  }

  // find indices adjacent to an index in an array
  //----------------------------------------------------------
  function adjacentTo(i) {
    var adjacent = {}

    var _below = below(i)
    adjacent.below = _below < tileCount ? _below : void 0

    var _above = above(i)
    adjacent.above = _above >= 0 ? _above : void 0

    adjacent.right = i % gridSize < gridSizeLessOne
      ? right(i)
      : void 0

    adjacent.left = i % gridSize > 0
      ? left(i)
      : void 0

    return adjacent
  }

  // bind click handler for clickable tile
  //----------------------------------------------------------
  function bindClickHandler(ar, direction) {
    var i = state.adjacent[direction]
    if (typeof i !== 'undefined') {
      ar[i].click(function(e) {
        console.log('clicked ' + direction)
      })
    }
  }

  // check if current state is victory state
  //----------------------------------------------------------
  function isVictory() {
    var i = 0
    var victory = false
    while (i < tileCount) {
      if (state.values[i] === victoryState[i]) i++
      else break
      if (i === tileCount) victory = true
    }
    return victory
  }

  // generate initial state
  //----------------------------------------------------------
  function init() {
    for (var i = 1; i <= tileCount; i++) victoryState.push(i)
    shuffle(victoryState).forEach(
      function(val) {
        state.tiles.push(tile(val))
        state.values.push(val)
      }
    )
    state.adjacent = adjacentTo(blankTilePos())
  }

  // render fn
  //----------------------------------------------------------
  function render() {
    // clear board
    board.empty()

    // TODO branch for victory state

    // bind click handlers and render tiles
    var tiles = state.tiles.slice(0)
    Object.keys(state.adjacent).map(
      function(direction) {
        bindClickHandler(tiles, direction)
      }
    )
    tiles.forEach(
      function(t) { board.append(t) }
    )
    // TODO: set score
    score.html(state.score)
  }

  // initialize
  //----------------------------------------------------------
  init()
  render()
}

// nPuzzle(8)
nPuzzle(15)
