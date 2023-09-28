import { useContext } from "react";
import { HandlerContext, GridContext } from "./App";

const Cell = ({ row, column }) => {
  const handleCellIncrement = useContext(HandlerContext);
  const grid = useContext(GridContext);

  return (
    <button className="cell" onClick={() => handleCellIncrement(row, column)}>
      {grid[row][column]}
    </button>
  );
};

export default Cell;
