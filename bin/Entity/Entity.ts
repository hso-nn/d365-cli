import {EntityForm} from './Entity.form';

export namespace Form {
    export function onLoad(executionContext: Xrm.Events.EventContext): void {
        EntityForm.onLoad(executionContext);
    }
}

export namespace Ribbon {
    // In Ribbon WorkBench specify Xrm Parameter 'Primary Control', which is formContext
    // In Ribbon WorkBench specify function: <publisher abbreviation>.<project abbreviation>.Entity.Ribbon.myRibbonMethod
    export function myRibbonMethod(formContext: Xrm.FormContext): void {
        // EntityForm.myFormMethod(formContext);
    }
}
