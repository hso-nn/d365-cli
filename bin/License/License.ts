import {WebApi} from '../WebApi/WebApi';

export interface ValidateLicenseResult extends JSON {
    LicenseWarningText: string;
    LicenseErrorText: string;
    valid: boolean;
}

class ValidateLicense {
    static async onLoad(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
        return ValidateLicense.validate(executionContext);
    }

    static async validate(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
        const result = await WebApi.executeAction('<%= validateLicenseAction %>', { LicenseModule: '<%= licensename %>' }) as ValidateLicenseResult,
            formContext = executionContext.getFormContext();
        if (result.LicenseErrorText) {
            formContext.ui.setFormNotification(result.LicenseErrorText, 'ERROR', 'validatelicense');
            result.valid = false;
        } else if (result.LicenseWarningText) {
            formContext.ui.setFormNotification(result.LicenseWarningText, 'WARNING', 'validatelicense');
        } else {
            result.valid = true;
        }
        return result;
    }
}
export const Form = {
    // In D365 Form specify Form onLoad function: <%= publisher %>.<%= projectabbr %>.License.Form.onLoad
    onLoad: (executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> => {
        return ValidateLicense.onLoad(executionContext);
    }
};
