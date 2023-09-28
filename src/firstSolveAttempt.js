solve() {
  if (this.head === null) {
      return solution; // first base case. If there are no columns the solution is valid.
    }

    const selectedColumn = this.findMostConstrained(); //Now we select a column.
    if (selectedColumn.below === selectedColumn) {
      return null; // second base case. If there are no rows that satisfy the selected column's constraint we need to backtrack or there is no solution
    }

    //For the selected column try all rows that satisfy the column's constraint
    let currentRow = selectedColumn.below;
    while (currentRow !== selectedColumn) {
      solution.push(currentRow as DLXNode); //The column header is the only item that has type ColumnHeader so this is guaranteed to be a DLXNode.

      //We now need to remove the selected row, conflicting rows and the columns that the row satisfied

      const deletedItems: Array<ColumnHeader | DLXNode> = [];
      let currentNode = currentRow as DLXNode;
      do {
        let columnToBeRemoved = currentNode.columnHeader;
        let rowToBeRemoved = columnToBeRemoved.below;
        while (rowToBeRemoved !== columnToBeRemoved) {
          this.removeRow(rowToBeRemoved as DLXNode);
          deletedItems.push(rowToBeRemoved);
        }
        this.removeColumn(columnToBeRemoved);
        deletedItems.push(columnToBeRemoved);
        currentNode = currentNode.right;
      } while (currentNode !== currentRow);

      //Finished removing

      const subSolution = this.solve(solution); //Calls this function recursively to try all solutions that could occur with our selected row
      if (subSolution) {
        //Found a solution
        return solution;
      } else {
        //Didn't find a solution. Have to put things back to try the next row.
        while (deletedItems.length > 0) {
          const itemToBeRestored = deletedItems.pop();
          if (itemToBeRestored instanceof ColumnHeader) {
            this.readdColumn(itemToBeRestored);
          } else {
            this.readdRow(itemToBeRestored);
          }
        }
      }
      currentRow = currentRow.below; //Sets the control variable to the next value
    }
    //All possible rows that could satisfy our selected constraint didn't result in a solution so we return null signifying no solution
    return null;
  }
