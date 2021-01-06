import { TestBed, inject } from "@angular/core/testing";

import { DetectorIntersectionService } from "./detector-intersection.service";

describe("DetectorIntersectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetectorIntersectionService]
    });
  });

  it("should be created", inject([DetectorIntersectionService], (service: DetectorIntersectionService) => {
    expect(service).toBeTruthy();
  }));
});
