'use strict'

//----------------------------------------------------------
// main app logic
//----------------------------------------------------------
function nPuzzle() {
  // initial setup
  //----------------------------------------------------------
  var panels = 15
  var moves = 0

  // elements
  var board = $('#game__board')
  var score = $('#score')

  // state
  var states = []
  var state

  // calcs
  var grid = Math.sqrt(panels + 1)
  var tileSize = Math.floor(
    (board.innerWidth() - parseInt(board.css('padding')) * 2) / grid
  )
  var tileSizePx = tileSize + 'px'

  // tile factory
  function buildTile(num) {
    var props = { 'class': 'tile' }
    var last = { 'class': 'title last'}
    var styles =
      { height: tileSizePx
      , width: tileSizePx
      , lineHeight: tileSize - 10 + 'px' // FIXME: magic number
      }

    return $('<div/>', props).css(styles).html(num)
    // return (num === panels + 1)
    //   ? $('<div/>', last).css(styles).html("")
    //   : $('<div/>', props).css(styles).html(num)
  }

  var tiles = []

  // generate tiles
  for(var i = 0; i <= panels; i++) {
    board.append(buildTile(i + 1))
    // tiles.push(buildTile(i + 1))
  }

}

nPuzzle()
