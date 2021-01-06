import { TestBed, inject } from "@angular/core/testing";

import { CellFocuserService } from "./cell-focuser.service";

describe("CellFocuserService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellFocuserService]
    });
  });

  it("should be created", inject([CellFocuserService], (service: CellFocuserService) => {
    expect(service).toBeTruthy();
  }));
});
