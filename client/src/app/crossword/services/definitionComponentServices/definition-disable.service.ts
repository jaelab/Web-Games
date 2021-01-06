import { Injectable, QueryList } from "@angular/core";

import { Word } from "../../../../../../common/communication/word";

import { DefinitionComponent } from "../../components/definition/definition.component";

@Injectable()
export class DefinitionDisableService {
  private _definitionComponents: QueryList<DefinitionComponent>;

  public set definitionComponent(definitionComponent: QueryList<DefinitionComponent>) {
    this._definitionComponents = definitionComponent;
  }

  private findCorrectDefinition(word: Word): DefinitionComponent {
    return this._definitionComponents.find((component) => {
      return component._definition[0]._word === word._word;
    });
  }

  public findNumberOfDefinitionFound(): number {
    let definitionFound: number = 0;
    this._definitionComponents.forEach((definitionComponent: DefinitionComponent) => {
      if (definitionComponent.wordFound) {
        definitionFound++;
      }
    });

    return definitionFound;
  }

  public disableDefinition(word: Word): void {
    this.findCorrectDefinition(word).wordFound = true;
  }
}
