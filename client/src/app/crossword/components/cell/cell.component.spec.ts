import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CellComponent } from "./cell.component";
import { AppModule } from "../../../app.module";
import { Cell } from "../../../../../../common/communication/cell";

describe("CellComponent", () => {
  let cellComponent: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    cellComponent = fixture.componentInstance;
    const cell: Cell = new Cell(0, 0, "t", true, false);
    cellComponent.cell = cell;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(cellComponent).toBeTruthy();
  });

  describe("Function focusInput", () => {

    it("should focus the cell input", () => {
      cellComponent.focusInput();
      expect(cellComponent.value).toEqual("");
    });

  });

  describe("Function unHighlightCell", () => {

    it("should unHighlight the cell", () => {
      cellComponent.unHighlightCell();
      expect(cellComponent.colorToHighlight).toEqual("white");
    });

  });

  describe("Function highlightCell", () => {

    it("should highlight the cell blue", () => {
      cellComponent.highlightCell("blue");
      expect(cellComponent.colorToHighlight).toEqual("blue");
    });

    it("should highlight the cell red", () => {
      cellComponent.highlightCell("red");
      expect(cellComponent.colorToHighlight).toEqual("red");
    });

    it("should highlight the cell green", () => {
      cellComponent.highlightCell("green");
      expect(cellComponent.colorToHighlight).toEqual("green");
    });

  });
});
