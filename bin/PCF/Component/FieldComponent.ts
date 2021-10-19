/* This is a generated file, please do not modify */

import ReactDOM from 'react-dom';
import React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { Observable, Subscriber } from 'rxjs';

export class FieldComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    protected notifyOutputChanged: () => void;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.renderReactElement(context);
    }

    private contextSubscriber: Subscriber<ComponentFramework.Context<IInputs>>;
    private renderReactElement(context: ComponentFramework.Context<IInputs>): void {
        const contextObserver = new Observable<ComponentFramework.Context<IInputs>>((subscriber: Subscriber<ComponentFramework.Context<IInputs>>) => {
            this.contextSubscriber = subscriber;
            this.contextSubscriber.next(context);
        });
        const reactElement = this.createReactElement(contextObserver);
        if (reactElement) {
            ReactDOM.render(reactElement, this.container);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected createReactElement(contextObserver: Observable<ComponentFramework.Context<IInputs>>): React.ReactElement | null {
        return null; // override
    }

    public getOutputs(): IOutputs {
        return {}; // override
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.contextSubscriber.next(context);
    }

    public destroy(): void {
        // ReactDOM.unmountComponentAtNode(this.container);
    }
}
