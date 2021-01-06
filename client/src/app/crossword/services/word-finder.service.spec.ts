import { TestBed, inject } from "@angular/core/testing";
import { WordFinderService } from "./word-finder.service";

describe("WordFinderService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordFinderService]
    });
  });

  it("should be created", inject([WordFinderService], (service: WordFinderService) => {
    expect(service).toBeTruthy();
  }));
});
