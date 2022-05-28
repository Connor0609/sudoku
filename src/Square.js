import React from 'react';
import Cell from './Cell.js';

const Square = ({ cells, handleClick }) => {
  return <div className='square'>
    {cells.map( e => <Cell key={e.index} value={e.value} handleClick={(value) => handleClick(e.index, value)}/> )}
  </div>
}


export default Square