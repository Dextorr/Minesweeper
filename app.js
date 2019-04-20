const width = 8,
  numOfMines = 10,
  cells = [],
  mines = [],
  flags = [],
  surrounding = [width -1, width, width+1, 1, -width+1, -width, -width -1, -1],
  adjacent = [1, -1, width, -width]
let gameBoard,
  overlay,
  title,
  subtitle,
  startButton

function createBoard(){
  for(let i=0;i<width**2;i++){
    const cell = document.createElement('div')
    cell.appendChild(document.createElement('p'))
    cell.classList.add('cell', 'hidden')
    cell.style.width = `calc(100%/${width})`
    cell.style.height = `calc(100%/${width})`
    cells.push(cell)
    gameBoard.appendChild(cell)
  }
}

function placeMines(){
  for(let i=0;i<numOfMines;i++){
    let random = Math.floor(Math.random()* width**2)
    let mine = cells[random]
    while(mine.classList.contains('mine')){
      random = Math.floor(Math.random()* width**2)
      mine = cells[random]
    }
    mine.classList.add('mine')
    mines.push(mine)
  }
}

function validCells(arr, index){
  return arr.filter(cell => {
    if (index%width === 0) {
      const invalid = [width-1, -1, -width -1]
      return !invalid.includes(cell)
    } else if (index%width === width-1) {
      const invalid = [width+1, 1, -width +1]
      return !invalid.includes(cell)
    } else return true
  })
}

function countSurrounding(index, className){
  const toCheck = validCells(surrounding, index)
  return toCheck.reduce((count, cell) => {
    if(cells[index + cell] &&
      cells[index+cell].classList.contains(className)){
      return count + 1
    } return count
  }, 0)
}

function isBlank(cell){
  const gameClasses = ['num', 'mine']
  return !gameClasses.some(gameClass => cell.classList.contains(gameClass))
}

function clearBlanks(cell, index){
  remove(cell, 'hidden')
  if(isBlank(cell)){
    clearNums(index)
    const next = validCells(adjacent, index)
    if (isBlank(cell)){
      next.forEach(el => {
        if(cells[index+el] &&
          isBlank(cells[index+el]) &&
          cells[index + el].classList.contains('hidden')
        ){
          clearBlanks(cells[index + el], index+el)
        }
      })
    }
  }
}

function clearNums(index){
  const toClear = validCells(surrounding, index)
  toClear.forEach(el => {
    if(cells[index+el] &&
      cells[index+el].classList.contains('num')
    ) remove(cells[index+el], 'hidden')
  })
}

function remove(cell, className){
  cell.classList.remove(className)
}

function explode(cell){
  let currentStep = 0
  const explosionTimer = setInterval(() => {
    cell.setAttribute('data-step', currentStep)
    currentStep = currentStep === 15 ? 0 : currentStep += 1
    if(currentStep === 0) {
      clearInterval(explosionTimer)
    }
  }, 50)
}

function checkForMine(cell){
  if(cell.classList.contains('mine')){
    alert('YOU LOSE!')
    explode(cell)
    let i = 0
    const explosionTimer = setInterval(() => {
      if(i<mines.length){
        remove(mines[i], 'hidden')
        explode(mines[i])
      } else clearInterval(explosionTimer)
      i++
    }, 100)
  }
}

function flagHandler(e, cell){
  e.preventDefault()
  if (flags.includes(cell)){
    flags.splice(flags.indexOf(cell), 1)
  } else flags.push(cell)
  cell.classList.toggle('flag')
  if (flags.every(flag => flag.classList.contains('mine')) &&
  flags.length === numOfMines
  ){
    alert('YOU WIN!')
  }
}

function addEvents(){
  cells.forEach((cell, index) => {

    const count = countSurrounding(index, 'mine')

    if (count > 0 && !cell.classList.contains('mine')) {
      const num = cell.querySelector('p')
      num.innerText = count
      cell.classList.add('num')
    }

    cell.addEventListener('click', () => {
      if(cell.classList.contains('flag')) remove(cell, 'flag')
      else {
        clearBlanks(cell, index)
        checkForMine(cell)
      }
    })
    cell.addEventListener('contextmenu', (e) => {
      flagHandler(e, cell)
    })
  })
}

function startScreen(titleMsg, subMsg, buttonMsg){
  title = document.createElement('h1')
  title.innerText = titleMsg
  subtitle = document.createElement('h2')
  subtitle.innerText = subMsg
  startButton = document.createElement('button')
  startButton.innerText = buttonMsg
  startButton.addEventListener('click', startGame);
  [title, subtitle, startButton].forEach(el => overlay.appendChild(el))
}

function startGame(){
  overlay.style.display = 'none'
  createBoard()
  placeMines()
  addEvents()
}

function init(){
  gameBoard = document.getElementById('gameBoard')
  overlay = document.getElementById('overlay')
  startScreen('Minesweeper', 'Try and find all the mines!', 'Start Game')
}

document.addEventListener('DOMContentLoaded', init)
