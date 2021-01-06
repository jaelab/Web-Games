import { TestBed, inject } from "@angular/core/testing";

import { CellValidatorService } from "./cell-validator.service";

describe("CellValidatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellValidatorService]
    });
  });

  it("should be created", inject([CellValidatorService], (service: CellValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
