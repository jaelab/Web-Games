import { TestBed, inject } from "@angular/core/testing";

import { Wall3dService } from "./wall3d.service";
import { AppModule } from "../../app.module";

describe("Wall3dService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([Wall3dService], (service: Wall3dService) => {
    expect(service).toBeTruthy();
  }));
});
