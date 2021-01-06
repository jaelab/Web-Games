import { TestBed, inject } from "@angular/core/testing";

import { CellComponentService } from "./cell-component.service";
import { CellFocuserService } from "./cell-focuser.service";
import { CellHiglighterService } from "./cell-higlighter.service";
import { LetterPlacerService } from "./letter-placer.service";
import { CellValidatorService } from "./cell-validator.service";
import { QueryList } from "@angular/core";
import { CellComponent } from "../../components/cell/cell.component";

describe("CellComponentService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellComponentService, CellFocuserService, CellHiglighterService, LetterPlacerService, CellValidatorService]
    });
  });

  it("should be created", inject([CellComponentService], (service: CellComponentService) => {
    expect(service).toBeTruthy();
  }));

  describe("Function initialiseCellComponents", () => {

    it("should initialise the cellComponents to the other services", inject([CellComponentService], (service: CellComponentService) => {
      const mockQuerryList: QueryList<CellComponent> = new QueryList();
      service.initialiseCellComponents(mockQuerryList);

      expect(service.cellFocuserService).not.toEqual(undefined);
      expect(service.cellHiglighterService).not.toEqual(undefined);
      expect(service.letterPlacerService).not.toEqual(undefined);
      expect(service.cellValidatorService).not.toEqual(undefined);
    }));

  });
});
