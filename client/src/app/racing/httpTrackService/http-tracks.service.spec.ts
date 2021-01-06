import { TestBed, inject } from "@angular/core/testing";

import { HttpTracksService } from "./http-tracks.service";
import { AppModule } from "../../app.module";

describe("HttpTracksService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([HttpTracksService], (service: HttpTracksService) => {
    expect(service).toBeTruthy();
  }));
});
