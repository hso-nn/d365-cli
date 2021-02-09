import {Translation} from '../translation/Translation';
import {EntityFormContext} from './Entity.formContext';

export class EntityForm extends EntityFormContext {
    static async onLoad(executionContext: Xrm.Events.EventContext): Promise<void> {
        console.log(executionContext); // Prevent linting error
        console.log(Translation.translate('test')); // See https://github.com/hso-nn/d365-cli/wiki/Translations
    }
}
