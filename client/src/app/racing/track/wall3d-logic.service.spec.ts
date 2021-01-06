import { TestBed, inject } from "@angular/core/testing";

import { Wall3dLogicService } from "./wall3d-logic.service";

describe("Wall3dLogicService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Wall3dLogicService]
    });
  });

  it("should be created", inject([Wall3dLogicService], (service: Wall3dLogicService) => {
    expect(service).toBeTruthy();
  }));
});
