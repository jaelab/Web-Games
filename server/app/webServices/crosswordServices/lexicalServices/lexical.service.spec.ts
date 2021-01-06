import { LexicalService } from "./lexical.service";

// tslint:disable:no-magic-numbers
import chai = require("chai");
const expect: Chai.ExpectStatic = chai.expect;
chai.use(require("chai-like"));
chai.use(require("chai-things"));

describe.skip("Service lexical", () => {

  let lexical: LexicalService;
  beforeEach(() => {
    lexical = new LexicalService();
  });

  describe("function getDefinition", () => {
    it("should return the definition from the API", async () => {
      const result: string = await lexical.getDefinition("war", true);
      expect(result).to.equal("A state of open, armed, often prolonged conflict carried on between nations, states, or parties.");

    });

    it("should return an alternate definition if dificulty is hard", async () => {
      const result: string = await lexical.getDefinition("war", false);
      expect(result).not.to.equal("a concerted campaign to end something that is injurious");

    });

    it("should return an error message when an invalide request is done", async () => {
      try {
        const result: string = await lexical.getDefinition("*945&?", false);
        expect(result).to.equal("somehting");
      } catch (error) {
        expect(error).to.equal("Error - The entered word is not alphabetic");
      }
    });
  });
});
