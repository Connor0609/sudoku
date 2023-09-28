import { MAX_BOX_HEIGHT, MAX_BOX_WIDTH } from "./App";
class ColumnHeader {
  above: ColumnHeader | DLXNode;
  below: ColumnHeader | DLXNode;
  left: ColumnHeader | null;
  right: ColumnHeader | null;
  constraintName: string;
  size: number;

  constructor(constraintName: string) {
    this.constraintName = constraintName;
    this.above = this;
    this.below = this;
    this.left = null;
    this.right = null;
    this.size = 0;
  }
}

class DLXNode {
  above: ColumnHeader | DLXNode | null;
  below: ColumnHeader | DLXNode | null;
  left: DLXNode | null;
  right: DLXNode | null;
  columnHeader: ColumnHeader;

  constructor(columnHeader: ColumnHeader) {
    this.columnHeader = columnHeader;
    this.above = null;
    this.below = null;
    this.left = null;
    this.right = null;
  }
}

class DLXLinkedList {
  head: ColumnHeader | null; //The current node
  /**
   * Creates a new Dancing Links Linked List from a two dimensional array of numbers representing a Sudoku
   * puzzle with the specified box width and box height
   * @param grid The 2 dimensional array representing the Sudoku puzzle
   * @param boxWidth The width of the Sudoku puzzle's box subregions
   * @param boxHeight The height of the Sudoku puzzle's box subregions
   */
  constructor(grid: Array<Array<number>>, boxWidth: number, boxHeight: number) {
    const MAX_VALUE = boxWidth * boxHeight;
    // let numberOfRows = 0;

    //this sets up the constraint columns
    for (let i = 0; i < MAX_VALUE; i++) {
      for (let j = 0; j < MAX_VALUE; j++) {
        this.addNewColumn(`R${i}C${j}`);
        this.addNewColumn(`R${i}#${j + 1}`);
        this.addNewColumn(`C${i}#${j + 1}`);
        this.addNewColumn(`B${i}#${j + 1}`);
      }
    }

    /*
    This loop sets up the rows
  */
    for (let i = 0; i < MAX_VALUE; i++) {
      for (let j = 0; j < MAX_VALUE; j++) {
        const value = grid[i][j];

        if (value) {
          this.createRow(i, j, value, boxHeight, boxWidth);
          //   ++numberOfRows;
        } else {
          for (let k = 1; k <= MAX_VALUE; k++) {
            this.createRow(i, j, k, boxHeight, boxWidth);
            // ++numberOfRows;
          }
        }
      }
    }
    // console.log(`Number of Rows added: ${numberOfRows}`);
  }

  /**
   * Adds a new constraint column to the left of the current column
   * @param constraintName The name of the constraint
   */
  private addNewColumn(constraintName?: string): void {
    const newHeader = new ColumnHeader(constraintName);
    if (this.head === null || this.head === undefined) {
      newHeader.right = newHeader;
      newHeader.left = newHeader;
      this.head = newHeader;
    } else {
      newHeader.right = this.head;
      newHeader.left = this.head.left;
      this.head.left.right = newHeader;
      this.head.left = newHeader;
    }
  }

  /**
   * Appends a DLXNode to the column specified in its columnHeader property
   * @param node The node being appended
   */
  private appendNodeToColumn(node: DLXNode) {
    const columnHeader = node.columnHeader;
    node.below = columnHeader;
    node.above = columnHeader.above;
    columnHeader.above.below = node;
    columnHeader.above = node;
  }

  /**
   * Creates a row in the linked list that represents a (cell, value) combination that
   * could potentially exist in the Sudoku solution
   * @param row The row of the cell
   * @param column The column of the cell
   * @param value The value in the cell
   * @param boxHeight The height of the Sudoku's box subregions (used to calculate which box subregion the cell belongs to)
   * @param boxWidth The width of the Sudoku's box subregions (used to calculate which box subregion the cell belongs to)
   */
  private createRow(
    row: number,
    column: number,
    value: number,
    boxHeight: number,
    boxWidth: number
  ) {
    const boxNumber =
      Math.floor(row / boxHeight) * boxHeight + Math.floor(column / boxWidth);

    const cellConstraint = this.findColumn(`R${row}C${column}`);
    const cellNode = new DLXNode(cellConstraint);
    const rowConstraint = this.findColumn(`R${row}#${value}`);
    const rowNode = new DLXNode(rowConstraint);
    const columnConstraint = this.findColumn(`C${column}#${value}`);
    const columnNode = new DLXNode(columnConstraint);
    const boxConstraint = this.findColumn(`B${boxNumber}#${value}`);
    const boxNode = new DLXNode(boxConstraint);

    this.appendNodeToColumn(cellNode);
    this.appendNodeToColumn(rowNode);
    this.appendNodeToColumn(columnNode);
    this.appendNodeToColumn(boxNode);

    cellNode.left = boxNode;
    cellNode.right = rowNode;
    rowNode.left = cellNode;
    rowNode.right = columnNode;
    columnNode.left = rowNode;
    columnNode.right = boxNode;
    boxNode.left = columnNode;
    boxNode.right = cellNode;
  }

  /**
   * Finds the ColumnHeader node with the specified constraint name
   * @param constraintName The constraint name of the column to be found
   * @returns The ColumnHeader node with the specified constraint name
   */
  private findColumn(constraintName: string): ColumnHeader | null {
    if (this.head === null) {
      return null;
    }

    let currLeft = this.head;
    let currRight = this.head;
    do {
      if (currLeft.constraintName === constraintName) {
        return currLeft;
      }
      if (currRight.constraintName === constraintName) {
        return currRight;
      }
      currLeft = currLeft.left;
      currRight = currRight.right;
    } while (currLeft !== this.head && currRight !== this.head);
    return null;
  }

  /**
   * Returns the column header that has the fewest number of valid rows
   */
  private findMostConstrained(): ColumnHeader {
    let mostConstrained = this.head;
    let currentLeft = this.head.left;
    let currentRight = this.head.right;

    while (currentLeft !== this.head && currentRight !== this.head) {
      if (currentLeft.size < mostConstrained.size) {
        mostConstrained = currentLeft;
      }
      if (currentRight.size < mostConstrained.size) {
        mostConstrained = currentRight;
      }
      currentLeft = currentLeft.left;
      currentRight = currentRight.right;
    }
    return mostConstrained;
  }

  private numberOfColumns(): number {
    if (this.head === null) {
      return 0;
    }
    let current = this.head;
    let num = 0;
    do {
      ++num;
      current = current.right;
    } while (current !== this.head);
    return num;
  }

  /**
   * Readds a column removed during the solving algorithm.
   * @param column Column header of the column to be readded
   */
  private readdColumn(column: ColumnHeader) {
    if (this.head === null) {
      this.head = column;
    } else {
      let currentNode: ColumnHeader | DLXNode = column.above;
      do {
        currentNode.left.right = currentNode;
        currentNode.right.left = currentNode;
        currentNode = currentNode.above;
      } while (currentNode !== column.above);
    }
  }

  /**
   * Readd the row the provided node belongs to
   * @param node A node that belongs to the row to be readded
   */
  private readdRow(node: DLXNode) {
    let currentNode = node.left;
    do {
      currentNode.above.below = currentNode;
      currentNode.below.above = currentNode;
      currentNode = currentNode.left;
    } while (currentNode !== node.left);
  }

  /**
   * Removes the column with the provided column header.
   * If the column provided is the last column, sets the head to null,
   * otherwise moves the head to the right.
   * @return The column header of the removed column
   */
  private removeColumn(column: ColumnHeader) {
    if (this.head === column) {
      if (column === column.right) {
        this.head = null;
      } else {
        this.head = column.right;
      }
    }
    let currentNode: ColumnHeader | DLXNode = column;
    do {
      currentNode.left.right = currentNode.right;
      currentNode.right.left = currentNode.left;
      currentNode = currentNode.below;
    } while (currentNode !== column);
  }

  /**
   * Removes the row that the provided DLX node belongs to
   * @param node A DLXNode in the row to be removed
   */
  private removeRow(node: DLXNode): void {
    let currentNode: DLXNode = node;
    do {
      currentNode.above.below = currentNode.below;
      currentNode.below.above = currentNode.above;
      currentNode = currentNode.right;
    } while (currentNode !== node);
  }

  solve(): Array<DLXNode> | null {
    //console.log(`There are ${this.numberOfColumns()} columns remaining.`);
    const solution: Array<DLXNode> = [];
    if (this.head === null) {
      //First Base Case
      console.log("Found a solution");
      return solution;
    }

    const selectedColumn = this.findMostConstrained(); //Select a Column
    if (selectedColumn.below instanceof ColumnHeader) {
      //Second Base Case
      /*console.log(
        `This branch is a bust, backtracking. ${selectedColumn.constraintName}`
      );*/
      return null;
    }

    let selectedRow: DLXNode | ColumnHeader = selectedColumn.below;
    while (!(selectedRow instanceof ColumnHeader)) {
      //Before subroutine start
      solution.push(selectedRow);

      const deletedItems: Array<DLXNode | ColumnHeader> = [];
      let currentRowNode = selectedRow;
      do {
        const columnToBeDeleted = currentRowNode.columnHeader;
        let rowToBeDeleted = columnToBeDeleted.below;
        while (!(rowToBeDeleted instanceof ColumnHeader)) {
          this.removeRow(rowToBeDeleted);
          deletedItems.push(rowToBeDeleted);
          rowToBeDeleted = rowToBeDeleted.below;
        }
        this.removeColumn(columnToBeDeleted);
        deletedItems.push(columnToBeDeleted);
        currentRowNode = currentRowNode.right;
      } while (currentRowNode !== selectedRow);
      /*console.log(
        `Deleted ${deletedItems.length} items related to the selected row`
      );*/
      //Before subroutine end

      //Subroutine logic start
      const subSolution = this.solve();
      if (subSolution) {
        return solution.concat(subSolution);
      }
      //Subroutine logic end

      //After subroutine start
      //   let restoredItems = 0;
      while (deletedItems.length > 0) {
        const itemToBeRestored = deletedItems.pop();
        if (itemToBeRestored instanceof ColumnHeader) {
          this.readdColumn(itemToBeRestored);
        } else {
          this.readdRow(itemToBeRestored);
        }
        // ++restoredItems;
      }
      /*console.log(
        `Restored ${restoredItems} items relating to the selected row`
      );*/
      solution.pop();
      selectedRow = selectedRow.below;
      //After subroutine end
    }
    return null;
  }
}

function decodeSolution(solution: Array<DLXNode>): Array<Array<number>> {
  const maxBoxSize = MAX_BOX_HEIGHT * MAX_BOX_WIDTH;
  const grid = Array(maxBoxSize)
    .fill(null)
    .map(() => Array(maxBoxSize).fill(null));
  for (let i = 0; i < solution.length; i++) {
    const rowStart = solution[i];
    let currentItem = rowStart;

    const rowRegex = /R(?<row>\d+)/;
    const columnRegex = /C(?<column>\d+)/;
    const valueRegex = /#(?<value>\d+)/;

    let value: number;
    let row: number;
    let column: number;
    do {
      const attribute = currentItem.columnHeader.constraintName;
      console.log(`Current constraint name is ${attribute}`);
      const rowMatched = attribute.match(rowRegex);
      console.log(`Row regex check resulted in ${rowMatched}`);
      const columnMatched = attribute.match(columnRegex);
      console.log(`Column regex check resulted in ${columnMatched}`);
      const valueMatched = attribute.match(valueRegex);
      console.log(`Value regex check resulted in ${valueMatched}`);
      if (rowMatched) {
        row = Number(rowMatched.groups.row);
      }
      if (columnMatched) {
        column = Number(columnMatched.groups.column);
      }
      if (valueMatched) {
        value = Number(valueMatched.groups.value);
      }
      currentItem = currentItem.right;
    } while (currentItem.right !== rowStart);

    // console.log(`Row: ${row} Column: ${column} Value: ${value}`);
    if (!isNaN(value) && !isNaN(row) && !isNaN(column)) {
      grid[row][column] = value;
    }
  }

  return grid;
}

export default function findSolution(
  grid: Array<Array<number>>,
  boxWidth: number,
  boxHeight: number
): Array<Array<number>> {
  const dlxll = new DLXLinkedList(grid, boxWidth, boxHeight);
  const solution = dlxll.solve();

  if (solution) {
    const decodedSolution = decodeSolution(solution);
    console.log(decodedSolution);
    return decodedSolution;
  } else {
    alert("The puzzle provided has no valid solution");
    return grid;
  }
}
