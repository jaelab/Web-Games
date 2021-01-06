import { TestBed, inject } from "@angular/core/testing";

import { Track3dService } from "./track3d.service";
import { AppModule } from "../../app.module";

describe("Track3dService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([Track3dService], (service: Track3dService) => {
    expect(service).toBeTruthy();
  }));
});
