import "reflect-metadata";
import { Word } from "../../../../../../common/communication/word";
import { Cell } from "../../../../../../common/communication/cell";
import { injectable } from "inversify";

const GAME_DIMENSION: number = 10;
const NUMBER_OF_BLACK_CELL: number = 30;
const SECONDNEIGHBOR: number = 2;

@injectable()
export class GridMakerService {

  public grid: Cell[][];
  public numberOfBlackCell: number;

  constructor() {
    this.createValidGrid();
  }

  // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  private transposeGrid(): void {
    this.grid = this.grid[0].map((col: Cell, i: number) => this.grid.map((row: Cell[]) => row[i]));
  }

  private createWhiteGrid(): void {
    this.grid = [];
    for (let i: number = 0; i < GAME_DIMENSION; i++) {
      this.grid[i] = [];
      for (let j: number = 0; j < GAME_DIMENSION; j++) {
        this.grid[i][j] = new Cell(j, i, "?", false);
      }
    }
    this.numberOfBlackCell = 0;
  }

  private generateRandomNumber(lowerBound: number, higherBound: number): number {
    return Math.floor(Math.random() * (higherBound - lowerBound)) + lowerBound;
  }

  private floor(positionToCheck: number, blackCellPosition: number): number {
    if (positionToCheck < 0) {
      return blackCellPosition;
    } else if (positionToCheck > GAME_DIMENSION - 1) {
      return blackCellPosition;
         }

    return positionToCheck;
  }

  private initialiseListOfCell(): string[] {
    const positionWhiteCell: string[] = [];
    for (let i: number = 0; i < GAME_DIMENSION; i++) {
      for (let j: number = 0; j < GAME_DIMENSION; j++) {
        const positionString: string = String(i) + String(j);
        positionWhiteCell.push(positionString);
      }
    }

    return positionWhiteCell;
  }

  private checkNeighbors(positionX: number, positionY: number, listOfWhiteCell: string[]): string[] {
    if (!this.grid[this.floor(positionY + 1, positionY)][positionX]._isBlack) {
      if (this.grid[this.floor(positionY + SECONDNEIGHBOR, positionY)][positionX]._isBlack) {
        listOfWhiteCell = this.placeBlackCell(positionX, positionY + 1, listOfWhiteCell);
      }
    }

    if (!this.grid[this.floor(positionY - 1, positionY)][positionX]._isBlack) {
      if (this.grid[this.floor(positionY - SECONDNEIGHBOR, positionY)][positionX]._isBlack) {
        listOfWhiteCell = this.placeBlackCell(positionX, positionY - 1, listOfWhiteCell);
      }
    }

    if (!this.grid[positionY][this.floor(positionX + 1, positionX)]._isBlack) {
      if (this.grid[positionY][this.floor(positionX + SECONDNEIGHBOR, positionX)]._isBlack) {
        listOfWhiteCell = this.placeBlackCell(positionX + 1, positionY, listOfWhiteCell);
      }
    }

    if (!this.grid[positionY][this.floor(positionX - 1, positionX)]._isBlack) {
      if (this.grid[positionY][this.floor(positionX - SECONDNEIGHBOR, positionX)]._isBlack) {
        listOfWhiteCell = this.placeBlackCell(positionX - 1, positionY, listOfWhiteCell);
      }
    }

    return listOfWhiteCell;
  }

  private placeBlackCell(positionX: number, positionY: number, listOfWhiteCell: string[]): string[] {
    this.numberOfBlackCell++;
    this.grid[positionY][positionX]._isBlack = true;

    listOfWhiteCell = listOfWhiteCell.filter((value: string) => {
      return (!value.startsWith(String(positionX)) || !value.endsWith(String(positionY)));
    });
    listOfWhiteCell = this.checkNeighbors(positionX, positionY, listOfWhiteCell);

    return listOfWhiteCell;
  }

  private isWordInLine(): boolean {
    // Horizontal line
    for (const rowOfCell of this.grid) {
      if (this.findWordsInLine(rowOfCell).length === 0) {
        return false;
      }
    }
    this.transposeGrid();

    // Vertical line
    for (const rowOfCell of this.grid) {
      if (this.findWordsInLine(rowOfCell).length === 0) {
        return false;
      }
    }
    this.transposeGrid();

    return true;
  }

  public createValidGrid(): void {
    do {
      this.createWhiteGrid();
      let listOfWhiteCell: string[] = this.initialiseListOfCell();
      do {
        const randomPosition: number = this.generateRandomNumber(0, listOfWhiteCell.length - 1);
        const positionOfBlack: string = listOfWhiteCell[randomPosition];
        listOfWhiteCell = this.placeBlackCell(Number(positionOfBlack[0]), Number(positionOfBlack[1]), listOfWhiteCell);
        listOfWhiteCell = this.placeBlackCell(GAME_DIMENSION - 1 - Number(positionOfBlack[0]),
                                              GAME_DIMENSION - 1 - Number(positionOfBlack[1]), listOfWhiteCell);
      }while (this.numberOfBlackCell < NUMBER_OF_BLACK_CELL);
    }while (!this.isWordInLine());
  }

  private findBlackCellPosition(line: Cell[], startingPosition: number = 0): number {
    for (let i: number = startingPosition; i < line.length; i++) {
      if (line[i]._isBlack) {
        return i;
      }
    }

    return -1;
  }

  private findWordsInLine(line: Cell[]): Array<[number, number]> {
    const wordsTuple: Array<[number, number]> = [];
    let position1: number = 0;
    let position2: number = 0;
    do {
      position2 = this.findBlackCellPosition(line, position1);

      if (position2 === -1) {
        wordsTuple.push([position1, line.length - position1]);

      } else if (position2 - position1 > 1) {
        wordsTuple.push([position1, position2 - position1]);

        }
      position1 = position2 + 1;

    }while (position2 !== -1 && position2 !== line.length - 1);

    return wordsTuple;
  }

  private findWordsInGrid(isHorizontal: boolean): Word[] {
    const listOfWords: Word[] = [];
    let wordsTuple: Array<[number, number]> = [];
    let i: number = 0;

    for (const line of this.grid) {
      wordsTuple = this.findWordsInLine(line);

      for (const word of wordsTuple) {
        const wordString: string[] = [];
        line.slice(word[0], word[0] + word[1]).forEach((cell: Cell) => wordString.push(cell._value));

        if (isHorizontal) {
          listOfWords.push(new Word(word[0], i, isHorizontal, wordString.join("")));
        } else {
          listOfWords.push(new Word(i, word[0], isHorizontal, wordString.join("")));
        }
      }
      i++;
    }

    return listOfWords;
  }

  public findAllWordsInGrid(): Word[] {
    let allWords: Word[];
    allWords = this.findWordsInGrid(true);
    this.transposeGrid();
    allWords = allWords.concat(this.findWordsInGrid(false));
    this.transposeGrid();

    return allWords;
  }

  public placeWordInGrid(word: Word): void {
    if (word._x >= 0 && word._y >= 0) {
      for (let i: number = 0; i < word._word.length; i++) {
        if (word._isHorizontal) {
          this.grid[word._y][word._x + i]._value = word._word[i];
        } else {
        this.grid[word._y + i][word._x]._value = word._word[i];
        }
      }
    }
  }
}
