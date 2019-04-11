document.addEventListener('DOMContentLoaded', () => {

  const width = 8
  const gameBoard = document.getElementById('gameBoard')
  const cells = []
  const mines = []
  const surrounding = [width -1, width, width+1, 1, -width+1, -width, -width -1, -1]
  const adjacent = [1, -1, width, -width]

  for(let i=0;i<width**2;i++){
    const cell = document.createElement('div')
    cell.appendChild(document.createElement('p'))
    cell.classList.add('cell', 'hidden')
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
    mines.push(mine)
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

  function checkGameState(cell){
    if(cell.classList.contains('mine')){
      alert('YOU LOSE!')
    } else if (mines.every(mine => mine.classList.contains('flag'))){
      alert('YOU WIN!')
    }
  }

  cells.forEach((cell, index) => {

    const count = countSurrounding(index, 'mine')

    if (count > 0 && !cell.classList.contains('mine')) {
      const num = cell.querySelector('p')
      num.innerText = count
      cell.classList.add('num')
    }

    cell.addEventListener('click', () => {
      clearBlanks(cell, index)
      checkGameState(cell)
    })
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      cell.classList.toggle('flag')
    })
  })
})
