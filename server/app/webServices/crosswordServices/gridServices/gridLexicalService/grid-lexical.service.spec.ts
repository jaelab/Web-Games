import { GridLexicalSerivce } from "./grid-lexical.service";
import { Word } from "../../../../../../common/communication/word";

import chai = require("chai");
const expect: Chai.ExpectStatic = chai.expect;
chai.use(require("chai-like"));
chai.use(require("chai-things"));

// tslint:disable:no-magic-numbers
describe("GridLexicalService", () => {

  let service: GridLexicalSerivce;
  beforeEach(() => {
      service = new GridLexicalSerivce();
  });

  describe("function requestDefinitionFromAPI", () => {
    it("should return the description of the word", async () => {
      const mockWord: Word = new Word(0, 0, true, "test");
      const result: string = await service.requestDefinitionFromAPI(mockWord, "common");
      expect(result).to.not.equal("");
    });

    it("should return an error", async () => {
      try {
        const mockWord: Word = new Word(0, 0, true, "jad");
        await service.requestDefinitionFromAPI(mockWord, "common");
      } catch (error) {
        expect(error).to.equal("This word does not exist");
      }
    });
  });

  describe("function requestWordsFromDB", () => {
    it("should return the data base of common words", async () => {
      const result: string[][] = await service.requestWordsFromDB("common");
      expect(result.length).to.equal(9);
    });

    it("should return the data base of notCommon words", async () => {
      const result: string[][] = await service.requestWordsFromDB("notCommon");
      expect(result.length).to.equal(9);
    });
  });
});
