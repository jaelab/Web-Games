import { TestBed, inject } from "@angular/core/testing";

import { AiControlerService } from "./ai-controler.service";

describe("AiControlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiControlerService]
    });
  });

  it("should be created", inject([AiControlerService], (service: AiControlerService) => {
    expect(service).toBeTruthy();
  }));
});
