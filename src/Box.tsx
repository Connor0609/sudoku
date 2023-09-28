import Cell from "./Cell";

const Box = ({ boxNum, height, width }) => {
  const cells: JSX.Element[] = [];
  for (let rowInd = 0; rowInd < height * width; rowInd++) {
    for (let colInd = 0; colInd < height * width; colInd++) {
      if (
        Math.floor(rowInd / height) * height + Math.floor(colInd / width) ===
        boxNum
      ) {
        cells.push(
          <Cell key={`(${rowInd}, ${colInd})`} row={rowInd} column={colInd} />
        );
      }
    }
  }
  return (
    <div
      className="box"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, auto)`,
        border: "2px solid #000",
      }}
    >
      <>{cells}</>
    </div>
  );
};

export default Box;
