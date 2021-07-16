import {EntityForm} from './Entity.form';

export const Form = {
    // In D365 Form '<%= formname %>' specify Form onLoad function: <%= publisher %>.<%= namespace %>.Entity.Form.onLoad
    onLoad: async (executionContext: Xrm.Events.EventContext): Promise<void> => {
        return EntityForm.onLoad(executionContext);
    }
};

export const Ribbon = {
    // In Ribbon WorkBench specify function: <%= publisher %>.<%= namespace %>.Entity.Ribbon.myRibbonMethod1
    // In Ribbon WorkBench specify Xrm Parameter 'Primary Control', which is formContext
    myRibbonMethod1: (formContext: Xrm.FormContext): void => {
        console.log(formContext); // Prevent linting error
        // EntityForm.myFormMethod(formContext);
    },

    // In Ribbon WorkBench specify function: <%= publisher %>.<%= namespace %>.Entity.Ribbon.myRibbonMethod2
    // In Ribbon WorkBench specify Xrm Parameter 'Primary Control', which is gridControl
    myRibbonMethod2: (gridControl: Xrm.Controls.GridControl): void => {
        console.log(gridControl); // Prevent linting error
        // EntityForm.myFormMethod(gridControl);
    }
};
