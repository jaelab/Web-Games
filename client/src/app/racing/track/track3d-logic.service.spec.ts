import { TestBed, inject } from "@angular/core/testing";

import { Track3dLogicService } from "./track3d-logic.service";

describe("Track3dLogicService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Track3dLogicService]
    });
  });

  it("should be created", inject([Track3dLogicService], (service: Track3dLogicService) => {
    expect(service).toBeTruthy();
  }));
});
