import { TestBed, inject } from "@angular/core/testing";

import { DefinitionDisableService } from "./definition-disable.service";

describe("DefinitionDisableService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefinitionDisableService]
    });
  });

  it("should be created", inject([DefinitionDisableService], (service: DefinitionDisableService) => {
    expect(service).toBeTruthy();
  }));
});
