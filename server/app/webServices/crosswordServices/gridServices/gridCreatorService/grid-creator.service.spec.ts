import "reflect-metadata";
import { GridCreatorService } from "./grid-creator.service";
import { GridMakerService } from "../gridMakerService/grid-maker.service";
import { WordDB } from "../gridLexicalService/wordDB";
import { GridLexicalSerivce } from "../gridLexicalService/grid-lexical.service";
import { GridFillerService } from "../gridFillerService/grid-filler.service";
import { Crossword } from "../../../../../../common/communication/crossword";

// tslint:disable:no-magic-numbers
import chai = require("chai");
import { GridFillerManipulatorService } from "../gridFillerService/grid-filler-manipulator.service";
const expect: Chai.ExpectStatic = chai.expect;

describe("GridCreatorService", () => {

  const wordDB: WordDB = new WordDB(new GridLexicalSerivce);
  before(async () => {
    await wordDB.createDB();
  });

  let service: GridCreatorService;
  beforeEach(() => {
    service = new GridCreatorService(wordDB, new GridFillerService(new GridMakerService, new GridFillerManipulatorService, wordDB));
  });

  describe("function postCrossword", () => {
    it("should return a word/definition tuple", async() => {
      const result: Crossword = await service.postCrossWords("easy");
      expect(result.grid.length).to.equal(10);
      expect(result.wordDefinitions.length).to.not.equal(0);
    });
  });

});
