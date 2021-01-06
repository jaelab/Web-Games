import { TestBed, inject } from "@angular/core/testing";

import { DetectorService } from "./detector.service";
import { AppModule } from "../../app.module";

describe("DetectorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([DetectorService], (service: DetectorService) => {
    expect(service).toBeTruthy();
  }));
});
