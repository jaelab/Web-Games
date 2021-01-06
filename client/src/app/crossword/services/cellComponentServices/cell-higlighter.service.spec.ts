import { TestBed, inject } from "@angular/core/testing";

import { CellHiglighterService } from "./cell-higlighter.service";

describe("CellHiglighterService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellHiglighterService]
    });
  });

  it("should be created", inject([CellHiglighterService], (service: CellHiglighterService) => {
    expect(service).toBeTruthy();
  }));
});
