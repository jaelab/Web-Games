import "reflect-metadata";
import { GridFillerService } from "./grid-filler.service";
import { GridMakerService } from "../gridMakerService/grid-maker.service";
import { WordDB } from "../gridLexicalService/wordDB";
import { GridLexicalSerivce } from "../gridLexicalService/grid-lexical.service";

import chai = require("chai");
import { GridFillerManipulatorService } from "./grid-filler-manipulator.service";
const expect: Chai.ExpectStatic = chai.expect;

// tslint:disable:no-magic-numbers
describe("GridFillerService", () => {

  const wordDB: WordDB = new WordDB(new GridLexicalSerivce);
  before(async () => {
    await wordDB.createDB();
  });

  let service: GridFillerService;
  beforeEach(() => {
    service = new GridFillerService(new GridMakerService, new GridFillerManipulatorService, wordDB);
  });

  describe("function initializeListOfWords", () => {
    it("should fill a listOfWord and the associated grid", () => {
      service.initializeListOfWords("common");
      expect(service.words[0]._word[0]).to.equal(service.gridMakerService.grid[service.words[0]._y][service.words[0]._x]._value);
    });
  });

});
