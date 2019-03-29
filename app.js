document.addEventListener('DOMContentLoaded', () => {

  const width = 8
  const gameBoard = document.getElementById('gameBoard')
  const cells = []

  for(let i=0;i<width**2;i++){
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.style.width = `calc(100%/${width})`
    cell.style.height = `calc(100%/${width})`
    cells.push(cell)
    gameBoard.appendChild(cell)
  }

  for(let i=0;i<10;i++){
    let random = Math.floor(Math.random()* width**2)
    let mine = cells[random]
    while(mine.classList.contains('mine')){
      random = Math.floor(Math.random()* width**2)
      mine = cells[random]
    }
    mine.classList.add('mine')
    console.log(mine)
  }


})
