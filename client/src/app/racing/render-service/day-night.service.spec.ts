import { TestBed, inject } from "@angular/core/testing";

import { DayNightService } from "./day-night.service";
import { AppModule } from "../../app.module";

describe("DayNightService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([DayNightService], (service: DayNightService) => {
    expect(service).toBeTruthy();
  }));
});
