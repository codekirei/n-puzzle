Todo:

- [x] eslint
- [x] browser-sync
- [x] create responsive gameboard
- [x] add tiles to board in random order
  - [x] add tiles to board
  - [x] overlay blank tile(s)
  - [x] shuffle tiles
  - [x] push shuffled tiles to state
  - [x] pure render fn to append tiles to board
- [x] calculate winning game state
- [x] comparison logic between current state and winning state
- [x] calculate which tiles are moveable (adjacent to blank)
- [x] bind event handler to movable tiles
- [x] click handler for swapping moveable tiles
- [x] turn counter
- [x] notify victory
- [x] ensure solvable permutation
- [x] ensure event handlers are firing on touch events
- [x] FIXMEs / TODOs

Maybe:

- [x] resize handler
- [x] live GH pages version
- [x] responsive margin/padding for tiles and board
- [x] undo button with immutable state

Future:

- [ ] functionality
  - [ ] tile dragging (jqueryUI + touch-punch?)
  - [ ] reset button (same perm)
  - [ ] dialogs
    - [ ] Victory dialog with play again button
    - [ ] tutorial dialog
  - [ ] change tile count slider
  - [ ] solve button
- [ ] presentation
  - [ ] animations/fades
  - [ ] no-js dialog
- [ ] code
  - [ ] front-end tests
  - [ ] fn docstrings
  - [ ] modularity
  - [ ] err handling
  - [ ] editorconfig
  - [ ] tests
    - [ ] DOM (jest)
    - [ ] xbt
