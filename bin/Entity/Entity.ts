import {EntityForm} from './Entity.form';

export const Form = {
    // In D365 Form specify Form onLoad function: <%= publisher %>.<%= namespace %>.Entity.Form.onLoad
    onLoad: async (executionContext: Xrm.Events.EventContext): Promise<void> => {
        return EntityForm.onLoad(executionContext);
    }
};

export const Ribbon = {
    // In Ribbon WorkBench specify function: <%= publisher %>.<%= namespace %>.Entity.Ribbon.myRibbonMethod
    // In Ribbon WorkBench specify Xrm Parameter 'Primary Control', which is formContext
    myRibbonMethod: (formContext: Xrm.FormContext): void => {
        console.log(formContext); // Prevent linting error
        // EntityForm.myFormMethod(formContext);
    }
};
