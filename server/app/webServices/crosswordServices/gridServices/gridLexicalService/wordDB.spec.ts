import { WordDB } from "./wordDB";
import { Word } from "../../../../../../common/communication/word";
import { GridLexicalSerivce } from "./grid-lexical.service";

import chai = require("chai");
const expect: Chai.ExpectStatic = chai.expect;
chai.use(require("chai-like"));
chai.use(require("chai-things"));

// tslint:disable:no-magic-numbers
describe("WordDB", () => {

  let dataBase: WordDB;
  before(() => {
      dataBase = new WordDB(new GridLexicalSerivce);
  });

  describe("function shuffleAllWords", () => {
    const mockArray: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const initialPosition: string = mockArray.toString();
    it("should shuffle all the dataBase common", () => {
      dataBase.dBwordCommon[0] = mockArray;
      dataBase.shuffleAllWords("common");
      expect(dataBase.dBwordCommon[0][0].toString()).to.not.equal(initialPosition);
    });

    it("should shuffle all the dataBase notCommon", () => {
      dataBase.dBwordNotCommon[0] = mockArray;
      dataBase.shuffleAllWords("notCommon");
      expect(dataBase.dBwordNotCommon[0][0].toString()).to.not.equal(initialPosition);
    });
  });

  describe("function createDB", () => {
    it("should create the dataBase of common and notCommon words", async () => {
      await dataBase.createDB();
      expect(dataBase.dBwordCommon[0].length).to.not.equal(0);
      expect(dataBase.dBwordCommon[0].length).to.not.equal(0);
    });
  });

  describe("function getWordsByConstraint", () => {
    it("should return an array of words that satisfy the constraint", () => {
      dataBase.dBwordCommon[1] = ["ttt", "wet", "wrt"];
      const result: string[] = dataBase.getWordsByConstraint(new Word(0, 0, true, "???"), dataBase.dBwordCommon);
      expect(result[0].length).to.equal(3);
    });
  });

  describe("function getFrequenceFromDB", () => {
    it("should update the frequence of a list of word", async () => {
      await dataBase.createDB();
      const mockListOfWord: Word[] = [new Word(0, 0, true, "???", 0), new Word(0, 0, true, "hey", Number.MAX_SAFE_INTEGER)];
      dataBase.getFrequenceFromDB("common", mockListOfWord);

      expect(mockListOfWord[0]._numberOfWordInDB).to.not.equal(0);
      expect(mockListOfWord[1]._numberOfWordInDB).to.equal(Number.MAX_SAFE_INTEGER);
    });
  });
});
