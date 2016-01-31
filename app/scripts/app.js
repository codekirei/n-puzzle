'use strict'

//----------------------------------------------------------
// pure utility fns
//----------------------------------------------------------

// durstenfeld shuffle
//----------------------------------------------------------
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
// Application
//----------------------------------------------------------
function nPuzzle(n) {
  //----------------------------------------------------------
  // assign vars
  //----------------------------------------------------------
  var tileCount = n + 1

  // elements
  var board = $('#game__board')
  var score = $('#score')

  // calcs
  var gridSize = Math.sqrt(tileCount)
  var gridSizeLessOne = gridSize - 1
  var tileSize =
    Math.floor(
      (board.innerWidth() - parseInt(board.css('padding')) * 2) /
      gridSize -
      10 // FIXME: magic number
    )
  var tileSizePx = tileSize + 'px'

  // state
  var victoryState = []
  var history = []
  var state =
    { score: 0
    , tiles: []
    , values: []
    }

  //----------------------------------------------------------
  // pure closures
  //----------------------------------------------------------

  // get index of blank tile in array of values
  //----------------------------------------------------------
  function blankTilePos(ar) { return ar.indexOf(tileCount) }

  // test a permutation (array) for solvability
  //----------------------------------------------------------
  function isSolvable(permutation) {
    // copy permutation to prevent mutation
    var perm = permutation.slice(0)

    // get taxi distance of blank tile to corner
    var blank = blankTilePos(perm)
    var row = blank % gridSize + 1
    var col = Math.ceil((blank + 1) / gridSize)
    var taxiDistance = (gridSize * 2 - row - col)

    // calculate inviariant
    var invariant = taxiDistance
    while (perm.length) {
      var inversionCt = 0
      var cur = perm.shift()
      if (perm.length) {
        perm.forEach(function(val) {
          if (val < cur) inversionCt++
        })
      }
      invariant += inversionCt
    }

    // true if even, false if odd
    return invariant % 2 !== 1
  }

  // directional grid calc fns
  //----------------------------------------------------------
  function above(i) { return i - gridSize }
  function below(i) { return i + gridSize }
  function left(i) { return i - 1 }
  function right(i) { return i + 1 }

  // generate a tile div
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

  //----------------------------------------------------------
  // event handlers (mutative)
  //----------------------------------------------------------

  // top-level action handler
  //----------------------------------------------------------
  function action(name, context) {
    // snapshot state to history
    history.push($.extend(true, {}, state))

    // mutate state
    switch (name) {
      case 'SWAP':
        swap(context)
        break
      default:
        console.log('unknown action')
    }

    // check for victory
    state.victory = isVictory()

    // re-render
    render()
  }

  // swap two tiles
  //----------------------------------------------------------
  function swapState(a, b, keyStr) {
    var ar = state[keyStr]
    var hold = ar[b]
    ar[b] = ar[a]
    ar[a] = hold
  }

  function swapTilesAndValues(a, b) {
    ['tiles', 'values'].map(function(str) {
      swapState(a, b, str)
    })
  }

  function swap(context) {
    var i = context.i

    switch (context.direction) {
      case 'left':
        swapTilesAndValues(i, right(i))
        break
      case 'right':
        swapTilesAndValues(i, left(i))
        break
      case 'above':
        swapTilesAndValues(i, below(i))
        break
      case 'below':
        swapTilesAndValues(i, above(i))
        break
      default:
        console.log('unknown action')
    }

    // update rest of state
    state.score++
    state.adjacent = adjacentTo(blankTilePos(state.values))
  }

  // bind click handler to clickable tile
  //----------------------------------------------------------
  function bindClickHandler(tiles, direction) {
    var i = state.adjacent[direction]
    if (typeof i !== 'undefined') {
      tiles[i].click(function(e) {
        action('SWAP',
          { direction: direction
          , i: i
          }
        )
      })
    }
  }

  //----------------------------------------------------------
  // other mutative fns
  //----------------------------------------------------------

  // generate initial state
  //----------------------------------------------------------
  function init() {
    // create victory (ascending) state
    for (var i = 1; i <= tileCount; i++) victoryState.push(i)

    // generate solvable random permutation
    var permutation
    var solvable = false
    while (!solvable) {
      permutation = shuffle(victoryState)
      solvable = isSolvable(permutation)
    }

    // push permutation to state
    permutation.forEach(
      function(val) {
        state.tiles.push(tile(val))
        state.values.push(val)
      }
    )

    // find movable tiles
    state.adjacent = adjacentTo(blankTilePos(state.values))
  }

  // render state to DOM
  //----------------------------------------------------------
  function render() {
    // clear board
    board.empty()

    // TODO branch for victory state

    // copy tiles
    var tiles = state.tiles.slice(0)

    // bind click handlers
    if (!state.victory) {
      Object.keys(state.adjacent).map(
        function(direction) {
          bindClickHandler(tiles, direction)
        }
      )
    }

    // append tiles to DOM
    tiles.forEach(
      function(t) { board.append(t) }
    )

    // print score
    score.html(state.score)

    if (state.victory) {
      alert('You won!')
    }
  }

  //----------------------------------------------------------
  // initialize
  //----------------------------------------------------------
  init()
  render()
}

// nPuzzle(8)
nPuzzle(15)
