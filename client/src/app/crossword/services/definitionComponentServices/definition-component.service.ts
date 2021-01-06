import { Injectable, QueryList } from "@angular/core";

import { DefinitionComponent } from "../../components/definition/definition.component";

import { DefinitionDisableService } from "./definition-disable.service";

@Injectable()
export class DefinitionComponentService {

  public  constructor(public definitionDisableService: DefinitionDisableService) {
  }

  public initialiseDefinitionComponents(definitionComponents: QueryList<DefinitionComponent>): void {
    this.definitionDisableService.definitionComponent = definitionComponents;
  }

}
