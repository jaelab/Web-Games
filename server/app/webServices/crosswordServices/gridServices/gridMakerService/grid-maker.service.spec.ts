import "reflect-metadata";
import { GridMakerService } from "./grid-maker.service";
import { Cell } from "../../../../../../common/communication/cell";
import { Word } from "../../../../../../common/communication/word";

import chai = require("chai");
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable:no-magic-numbers
describe("GridMakerService", () => {

  let service: GridMakerService;

  beforeEach(() => {
    service = new GridMakerService();
  });

  describe("constructor initialisation", () => {
    it("Grid should be of x.size 10", () => {
      expect(service.grid.length).to.equal(10);
    });

    it("Grid should be of y.size 10", () => {
      expect(service.grid[0].length).to.equal(10);
    });
  });

  describe("function createValidGrid", () => {
    it("should create a valid grid", () => {
      service.createValidGrid();
      let numberOfBlackCell: number = 0;
      service.grid.forEach((line: Cell[]) => line.forEach((cell: Cell) => {
        if (cell._isBlack) {
          numberOfBlackCell++;
        }
      }));
      expect(service.numberOfBlackCell).to.equal(numberOfBlackCell);
      expect(service.numberOfBlackCell).to.at.least(30);
    });
  });

  describe("function findAllWordsInGrid", () => {
    it("should return all the words in the grid", () => {
      service.createValidGrid();
      const result: Word[] = service.findAllWordsInGrid();

      expect(result.length).to.not.equals(0);
    });
  });

  describe("function placeWordInGrid", () => {
    it("should place correctly the word in the grid (horizontal)", () => {
      const mockWord: Word = new Word(0, 0, true, "test");
      service.placeWordInGrid(mockWord);
      for (let i: number = 0; i < mockWord._word.length; i++) {
        expect(service.grid[0][i]._value).to.equal(mockWord._word[i]);
      }
    });

    it("should place correctly the word in the grid (vertical)", () => {
      const mockWord: Word = new Word(2, 2, false, "kevtest");
      service.placeWordInGrid(mockWord);
      for (let i: number = 0; i < mockWord._word.length; i++) {
        expect(service.grid[i + 2][2]._value).to.equal(mockWord._word[i]);
      }
    });
  });
});
