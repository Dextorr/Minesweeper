let overlay,
  title,
  subtitle,
  startButton

class Minesweeper {
  constructor(width, numOfMines){
    this.width = width
    this.numOfMines = numOfMines
    this.surrounding = [width -1, width, width+1, 1, -width+1, -width, -width -1, -1],
    this.adjacent = [1, -1, width, -width],
    this.gameBoard = document.getElementById('gameBoard')
    this.cells = []
    this.mines = []
    this.flags = []

    // this.init = this.init.bind(this)
    this.startGame = this.startGame.bind(this)
    this.createBoard = this.createBoard.bind(this)

    this.init()
  }

  init(){
    overlay = document.getElementById('overlay')
    this.startScreen('Minesweeper', 'Try and find all the mines!\nLeft click to uncover a tile, right click to plant a flag.\nNumbers tell you how many mines surround that tile.\nYou win when there is a flag on every mine.', 'Start Game')
  }

  createBoard(){
    for(let i=0;i<this.width**2;i++){
      const cell = document.createElement('div')
      cell.appendChild(document.createElement('p'))
      cell.classList.add('cell', 'hidden')
      cell.style.width = `calc(100%/${this.width})`
      cell.style.height = `calc(100%/${this.width})`
      this.cells.push(cell)
      this.gameBoard.appendChild(cell)
    }
  }

  placeMines(){
    for(let i=0;i<this.numOfMines;i++){
      let random = Math.floor(Math.random()* this.width**2)
      let mine = this.cells[random]
      while(mine.classList.contains('mine')){
        random = Math.floor(Math.random()* this.width**2)
        mine = this.cells[random]
      }
      mine.classList.add('mine')
      this.mines.push(mine)
    }
  }

  validCells(arr, index){
    return arr.filter(cell => {
      if (index%this.width === 0) {
        const invalid = [this.width-1, -1, -this.width -1]
        return !invalid.includes(cell)
      } else if (index%this.width === this.width-1) {
        const invalid = [this.width+1, 1, -this.width +1]
        return !invalid.includes(cell)
      } else return true
    })
  }

  countSurrounding(index, className){
    const toCheck = this.validCells(this.surrounding, index)
    return toCheck.reduce((count, cell) => {
      if(this.cells[index + cell] &&
        this.cells[index+cell].classList.contains(className)){
        return count + 1
      } return count
    }, 0)
  }

  isBlank(cell){
    const gameClasses = ['num', 'mine']
    return !gameClasses.some(gameClass => cell.classList.contains(gameClass))
  }

  clearBlanks(cell, index){
    this.remove(cell, 'hidden')
    if(this.isBlank(cell)){
      this.clearNums(index)
      const next = this.validCells(this.adjacent, index)
      if (this.isBlank(cell)){
        next.forEach(el => {
          if(this.cells[index+el] &&
            this.isBlank(this.cells[index+el]) &&
            this.cells[index + el].classList.contains('hidden')
          ){
            this.clearBlanks(this.cells[index + el], index+el)
          }
        })
      }
    }
  }

  clearNums(index){
    const toClear = this.validCells(this.surrounding, index)
    toClear.forEach(el => {
      if(this.cells[index+el] &&
        this.cells[index+el].classList.contains('num')
      ) this.remove(this.cells[index+el], 'hidden')
    })
  }

  remove(cell, className){
    cell.classList.remove(className)
  }

  explode(cell){
    let currentStep = 0
    const explosionTimer = setInterval(() => {
      cell.setAttribute('data-step', currentStep)
      currentStep = currentStep === 15 ? 0 : currentStep += 1
      if(currentStep === 0) {
        clearInterval(explosionTimer)
      }
    }, 50)
  }

  checkForMine(cell){
    if(cell.classList.contains('mine')){
      this.explode(cell)
      let i = 0
      const explosionTimer = setInterval(() => {
        if(i<this.mines.length){
          this.remove(this.mines[i], 'hidden')
          this.explode(this.mines[i])
        } else clearInterval(explosionTimer)
        i++
      }, 100)
      setTimeout(() => {
        this.endGame('Game Over!!', 'You detonated the mines! 😔', 'Play again?')
      }, 2500)
    }
  }

  flagHandler(e, cell){
    e.preventDefault()
    if (this.flags.includes(cell)){
      this.flags.splice(this.flags.indexOf(cell), 1)
    } else this.flags.push(cell)
    cell.classList.toggle('flag')
    if (this.flags.every(flag => flag.classList.contains('mine')) &&
    this.flags.length === this.numOfMines
    ){
      let i = 0
      const explosionTimer = setInterval(() => {
        if(i<this.flags.length){
          this.flags[i].classList.add('correct')
        } else clearInterval(explosionTimer)
        i++
      }, 100)
      setTimeout(() => {
        this.endGame('You Won!!', 'You safely discovered all the mines!', 'Play again?')
      }, 2500)
    }
  }

  addEvents(){
    this.cells.forEach((cell, index) => {

      const count = this.countSurrounding(index, 'mine')

      if (count > 0 && !cell.classList.contains('mine')) {
        const num = cell.querySelector('p')
        num.innerText = count
        cell.classList.add('num')
      }

      cell.addEventListener('click', () => {
        if(cell.classList.contains('flag')) this.remove(cell, 'flag')
        else {
          this.clearBlanks(cell, index)
          this.checkForMine(cell)
        }
      })
      cell.addEventListener('contextmenu', (e) => {
        this.flagHandler(e, cell)
      })
    })
  }

  startGame(){
    overlay.style.display = 'none'
    this.createBoard()
    this.placeMines()
    this.addEvents()
  }

  startScreen(titleMsg, subMsg, buttonMsg){
    title = document.createElement('h1')
    title.innerText = titleMsg
    subtitle = document.createElement('h2')
    subtitle.innerText = subMsg
    startButton = document.createElement('button')
    startButton.innerText = buttonMsg
    startButton.addEventListener('click', this.startGame);
    [title, subtitle, startButton].forEach(el => overlay.appendChild(el))
  }

  endGame(endMsg, subMsg, buttonMsg){
    overlay.innerHTML = ''
    this.startScreen(endMsg, subMsg, buttonMsg)
    overlay.style.display = 'block'
    this.gameBoard.innerHTML = ''
    this.cells = []
    this.mines = []
    this.flags = []
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new Minesweeper(8, 10)
})
