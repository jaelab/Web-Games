import { Cell } from "./cell";
import { Word } from "./word";

export class Crossword {
  public grid: Cell[][];
  public wordDefinitions: [Word, string][];
}
