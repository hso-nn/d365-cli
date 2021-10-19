import { IInputs, IOutputs } from './generated/ManifestTypes';
import {PCFComponent as PCFComponentTSX} from './PCFComponent';
import { FieldComponent } from './FieldComponent';
import React from 'react';
import { Observable } from 'rxjs';

// index.ts is the intermediary between PCF framework and React template
// Please start you component in PCFComponentTSX React template
export class PCFComponent extends FieldComponent {
    protected value: string;

    protected createReactElement(contextObserver: Observable<ComponentFramework.Context<IInputs>>): React.ReactElement {
        return React.createElement(PCFComponentTSX, {
            notifyOutputChanged: (value: string) => {
                this.value = value;
                this.notifyOutputChanged();
            },
            contextObserver: contextObserver
        });
    }

    public getOutputs(): IOutputs {
        return {
            sampleProperty: this.value
        };
    }
}
