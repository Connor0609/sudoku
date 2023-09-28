import Box from "./Box";

const Sudoku = ({ boxWidth, boxHeight }) => {
  let boxes: JSX.Element[] = [];
  for (let i = 0; i < boxWidth * boxHeight; i++) {
    boxes.push(<Box key={i} boxNum={i} height={boxHeight} width={boxWidth} />);
  }
  return (
    <div
      className="sudoku"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boxHeight}, auto)`,
      }}
    >
      <>{boxes}</>
    </div>
  );
};

export default Sudoku;
