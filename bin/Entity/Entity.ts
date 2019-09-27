import {EntityForm} from './Entity.form';

export const Form = {
    // In D365 Form specify Form onLoad function: <%= publisher %>.<%= projectabbr %>.Entity.Form.onLoad
    onLoad: async (executionContext: Xrm.Events.EventContext): Promise<void> => {
        return EntityForm.onLoad(executionContext);
    }
};

export const Ribbon = {
    // In Ribbon WorkBench specify function: <%= publisher %>.<%= projectabbr %>.Entity.Ribbon.myRibbonMethod
    // In Ribbon WorkBench specify Xrm Parameter 'Primary Control', which is formContext
    myRibbonMethod: (formContext: Xrm.FormContext): void => {
        // EntityForm.myFormMethod(formContext);
    }
};
