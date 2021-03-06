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
  var gridSize = Math.sqrt(tileCount)
  var gridSizeLessOne = gridSize - 1

  // elements
  var board = $('#game__board')
  var score = $('#score')
  var undo = $('.game__undo')

  // styles
  var bp = 960
  var tileStyles =
    { height: void 0
    , width: void 0
    , lineHeight: void 0
    }

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
    var taxiDistance = gridSize * 2 - row - col

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
    return num === tileCount
      ? $('<div/>', props.blank).css(tileStyles)
      : $('<div/>', props.hasNum).css(tileStyles).html(num)
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
  // game event handlers (mutative)
  //----------------------------------------------------------

  // top-level action handler
  //----------------------------------------------------------
  function action(name, context) {
    // handle action
    switch (name) {
      case 'SWAP':
        history.push($.extend(true, {}, state))
        swap(context)
        break
      case 'UNDO':
        if (history.length) state = history.pop()
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

  function swapAndIncrementScore(a, b) {
    ['tiles', 'values'].map(function(str) {
      swapState(a, b, str)
    })
    state.score++
  }

  function swap(context) {
    var i = context.i

    switch (context.direction) {
      case 'left':
        swapAndIncrementScore(i, right(i))
        break
      case 'right':
        swapAndIncrementScore(i, left(i))
        break
      case 'above':
        swapAndIncrementScore(i, below(i))
        break
      case 'below':
        swapAndIncrementScore(i, above(i))
        break
      default:
        console.log('unknown action')
    }

    state.adjacent = adjacentTo(blankTilePos(state.values))
  }

  // bind click handler to clickable tile
  //----------------------------------------------------------
  function bindClickHandler(direction) {
    var i = state.adjacent[direction]
    if (typeof i !== 'undefined') {
      state.tiles[i].click(function(e) {
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

  // generate tileStyles object
  //----------------------------------------------------------
  function genTileStyles() {
    var width =
      { window: $(window).width()
      , board: board.width()
      }
    var tilePadding = width.window >= bp ? 10 : 6
    var tileSize = Math.floor(width.board / gridSize - tilePadding) + 'px'
    Object.keys(tileStyles).map(function(prop) {
      tileStyles[prop] = tileSize
    })
  }

  // initialize state and some event handlers
  //----------------------------------------------------------
  function init() {
    // calculate tile sizes
    genTileStyles()

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

    // add click handler for undo button
    undo.click(function(e) { action('UNDO') })
  }

  // render state to DOM
  //----------------------------------------------------------
  function render() {
    // clear board
    board.empty()

    // bind click handlers
    if (!state.victory) {
      Object.keys(state.adjacent).map(bindClickHandler)
    }

    // append tiles to DOM
    state.tiles.forEach(
      function(t) { board.append(t) }
    )

    // print score
    score.html(state.score)

    // handle victory state
    if (state.victory) {
      undo.off('click')
      alert('You won!')
    }
  }

  //----------------------------------------------------------
  // handle window resize
  //----------------------------------------------------------
  function resizeHandler(e) {
    genTileStyles()
    state.tiles.map(function(t) {
      t.css(tileStyles)
    })
    render()
  }

  var debounceResize
  $(window).resize(function(e) {
    clearTimeout(debounceResize)
    debounceResize = setTimeout(resizeHandler, 50)
  })

  //----------------------------------------------------------
  // initialize
  //----------------------------------------------------------
  init()
  render()
}

// nPuzzle(8)
nPuzzle(15)
