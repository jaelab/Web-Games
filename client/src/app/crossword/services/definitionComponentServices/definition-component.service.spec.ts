import { TestBed, inject } from "@angular/core/testing";

import { DefinitionComponentService } from "./definition-component.service";
import { DefinitionDisableService } from "./definition-disable.service";
import { QueryList } from "@angular/core";
import { DefinitionComponent } from "../../components/definition/definition.component";

describe("DefinitionComponentService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefinitionComponentService, DefinitionDisableService]
    });
  });

  it("should be created", inject([DefinitionComponentService], (service: DefinitionComponentService) => {
    expect(service).toBeTruthy();
  }));

  describe("Function initialiseDefinitionComponents", () => {

    it("should initialise the definitions component to the other services",
       inject([DefinitionComponentService], (service: DefinitionComponentService) => {
      const mockQueryList: QueryList<DefinitionComponent> = new QueryList<DefinitionComponent>();
      service.initialiseDefinitionComponents(mockQueryList);

      expect(service.definitionDisableService).not.toEqual(undefined);
    }));

  });
});
