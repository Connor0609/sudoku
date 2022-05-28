import React from 'react';

const Cell = ({ value, handleClick }) => {
  return <button className='cell' onClick={() => handleClick(value)}>{value}</button>
}

export default Cell