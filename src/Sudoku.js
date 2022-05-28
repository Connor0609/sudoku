import React, { useState } from 'react';
import Square from './Square.js'

const Sudoku = () => {
  const [cells, setCells] = useState(new Array(81).fill(null))

  const {columns, rows, squares} = calcGroups(cells)

  const assign = (allCells, unsolvedCells) => {
    for(let i in unsolvedCells){
      //console.log(unsolvedCells[i])
      if(unsolvedCells[i].length === 1){
        allCells[i] = unsolvedCells[i][0]
        //console.log('here')
      }
    }
    console.log(allCells)
    setCells(allCells)
  }

  const eliminate = (index, values) => {
    const colNum = index % 9, 
    rowNum = (index - colNum) / 9, 
    sqNum = getSq(rowNum, colNum),
    col = columns[colNum].map(e => e.value),
    row = rows[rowNum].map(e => e.value),
    sq = squares[sqNum].map(e => e.value)

    for(let i = 0; i < values.length;){
      if(col.includes(values[i]) || row.includes(values[i]) || sq.includes(values[i])){
        values.splice(i, 1)
      } else {
        ++i
      }
    }
  }

  const handleClick = (index, value) => {
    const nextState = cells.slice()
    nextState[index] = value === null ? 1 : value < 9 ? value + 1 : null
    setCells(nextState)
  }

  const step = () => {
    const cellsCopy = cells.slice()
    const unsolvedCells = cells.reduce((obj, e, i) => {
      if( e === null ){
        obj[i] = new Array(9).fill().map((e, i) => i+1)
      }

      return obj
    },{})
    
    for(let index in unsolvedCells) {
      eliminate(index, unsolvedCells[index])
    }
    assign(cellsCopy, unsolvedCells)

    //console.log(unsolvedCells)
  }

  return (
    <>
      <div className='sudoku'>
        {squares.map((e, i) => <Square key={i} cells={e} handleClick={handleClick} />)}
      </div>
      <button id='toggleInput' onClick={() => {step()}}>Step</button>
    </>
  )
}

const calcGroups = (cells) => {
  const rows = initGroup(), columns = initGroup(), squares = initGroup()
  for( let i = 0; i < cells.length; ++i ){
    const colNum = i % 9
    const rowNum = (i - colNum) / 9
    const sqNum = getSq(rowNum, colNum)

    const pair = {index: i, value: cells[i]}
    columns[colNum].push(pair)
    rows[rowNum].push(pair)
    squares[sqNum].push(pair)
  }

  return {columns: columns, rows: rows, squares: squares}
}

const getSq = (row, col) => {
  return 3 * Math.trunc(row / 3) + Math.trunc(col / 3)
}


const initGroup = () => {
  return new Array(9).fill().map(() => [])
}

export default Sudoku