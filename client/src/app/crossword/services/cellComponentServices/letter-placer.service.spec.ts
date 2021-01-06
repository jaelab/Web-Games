import { TestBed, inject } from "@angular/core/testing";

import { LetterPlacerService } from "./letter-placer.service";

describe("LetterPlacerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LetterPlacerService]
    });
  });

  it("should be created", inject([LetterPlacerService], (service: LetterPlacerService) => {
    expect(service).toBeTruthy();
  }));
});
