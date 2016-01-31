'use strict'

//----------------------------------------------------------
// utility fns
//----------------------------------------------------------
// in-place durstenfeld shuffle
function shuffle(ar) {
  for (var i = ar.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1))
    var hold = ar[i]
    ar[i] = ar[rand]
    ar[rand] = hold
  }
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
  var states = []
  var state =
    { moves: 0
    , tiles: []
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

  // generate and randomize all tiles
  //----------------------------------------------------------
  function generateTiles() {
    var tiles = []
    for (var i = 1; i <= tileCount; i++) tiles.push(tile(i))
    shuffle(tiles)
    tiles.forEach(
      function(t) { state.tiles.push(t) }
    )
  }

  // pure render fn
  //----------------------------------------------------------
  function render(currentState) {
    // clear board
    board.empty()

    // fill board with tiles
    currentState.tiles.forEach(
      function(t) { board.append(t) }
    )

    // TODO: set score
  }

  // initialize
  //----------------------------------------------------------
  generateTiles()
  render(state)
}

nPuzzle()
