import { useReducer, FC, ChangeEvent, createContext } from "react";
import Sudoku from "./Sudoku";
import findSolution from "./dancingLinks";

const MIN_BOX_HEIGHT = 1;
export const MAX_BOX_HEIGHT = 5;
const MIN_BOX_WIDTH = 1;
export const MAX_BOX_WIDTH = 5;

type State = {
  boxHeight: number;
  boxWidth: number;
  grid: Array<Array<number | null>>;
};

type Action = {
  type: string;
  nextHeight?: number;
  nextWidth?: number;
  row?: number;
  column?: number;
  solution?: Array<Array<number | null>>;
};

const initState: State = {
  boxHeight: 3,
  boxWidth: 3,
  grid: Array(MAX_BOX_HEIGHT * MAX_BOX_WIDTH)
    .fill(0)
    .map(() => Array(MAX_BOX_HEIGHT * MAX_BOX_WIDTH).fill(null)),
};

export const HandlerContext = createContext(null);
export const GridContext = createContext(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "changeHeight":
      return {
        ...state,
        boxHeight: action.nextHeight,
      };
    case "changeWidth":
      return {
        ...state,
        boxWidth: action.nextWidth,
      };
    case "incrementCell":
      const nextGrid = state.grid.map((row) => row.slice());
      const MAX_VALUE = state.boxHeight * state.boxWidth;
      const nextValue = nextGrid[action.row][action.column] + 1;
      nextGrid[action.row][action.column] =
        nextValue > MAX_VALUE ? null : nextValue;
      return {
        ...state,
        grid: nextGrid,
      };
    case "resetGrid":
      const newGrid = Array(MAX_BOX_HEIGHT * MAX_BOX_WIDTH)
        .fill(0)
        .map(() => Array(MAX_BOX_HEIGHT * MAX_BOX_WIDTH).fill(null));
      return { ...state, grid: newGrid };
    case "solve":
      const solution = action.solution;
      return { ...state, grid: solution };
    default:
      return state;
  }
}
const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const { boxHeight, boxWidth, grid } = state;

  const handleCellIncrement = (row: number, column: number) => {
    dispatch({ type: "incrementCell", row: row, column: column });
  };

  const handleBoxHeight = (event: ChangeEvent) => {
    if (event.target instanceof HTMLInputElement) {
      const newValue = Math.trunc(Number(event.target.value));
      if (MIN_BOX_HEIGHT <= newValue && newValue <= MAX_BOX_HEIGHT) {
        dispatch({
          type: "changeHeight",
          nextHeight: Number(event.target.value),
        });
      }
    }
  };

  const handleBoxWidth = (event: ChangeEvent) => {
    if (event.target instanceof HTMLInputElement) {
      const newValue = Math.trunc(Number(event.target.value));
      if (MIN_BOX_WIDTH <= newValue && newValue <= MAX_BOX_WIDTH) {
        dispatch({
          type: "changeWidth",
          nextWidth: Number(event.target.value),
        });
      }
    }
  };

  const handleReset = () => {
    dispatch({ type: "resetGrid" });
  };

  const handleSolve = () => {
    const newGrid = findSolution(grid, boxWidth, boxHeight);
    dispatch({ type: "solve", solution: newGrid });
  };

  return (
    <div className="app">
      <div id="controls">
        <label htmlFor="boxHeight">Box Height</label>
        <input
          name="boxHeight"
          type="number"
          min={MIN_BOX_HEIGHT}
          max={MAX_BOX_HEIGHT}
          value={boxHeight}
          onChange={handleBoxHeight}
        />
        <label htmlFor="boxWidth">Box Width</label>
        <input
          name="boxWidth"
          type="number"
          min={MIN_BOX_WIDTH}
          max={MAX_BOX_WIDTH}
          value={boxWidth}
          onChange={handleBoxWidth}
        />
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div id="puzzle">
        <GridContext.Provider value={grid}>
          <HandlerContext.Provider value={handleCellIncrement}>
            <Sudoku boxHeight={boxHeight} boxWidth={boxWidth} />
          </HandlerContext.Provider>
        </GridContext.Provider>
      </div>
    </div>
  );
};

export default App;
