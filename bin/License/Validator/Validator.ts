// import {DLFCore, ValidateLicenseResult} from 'dlf-core';
import {WebApi} from '../../WebApi/WebApi';

export interface ValidateLicenseResult extends JSON {
    LicenseWarningText: string;
    LicenseErrorText: string;
    valid: boolean;
}

export class Validator {
    static async onLoad(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
        return Validator.validate(executionContext);
    }

    // public static async validate(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
    //     const formContext = executionContext.getFormContext();
    //     return DLFCore.validateLicense('<%= licensename %>', formContext);
    // }

    public static async validate(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
        const result = await WebApi.executeAction('hds_DLFValidateLicense', { LicenseModule: '<%= licensename %>' }) as ValidateLicenseResult,
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

// In D365 Form specify Validator onLoad function: <%= publisher %>.<%= namespace %>.LicenseValidator.onLoad
export function onLoad(executionContext: Xrm.Events.EventContext): Promise<ValidateLicenseResult> {
    return Validator.onLoad(executionContext);
}
