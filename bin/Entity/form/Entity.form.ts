import {EntityFormContext} from './Entity.formContext';

export class EntityForm extends EntityFormContext {
    static async onLoad(executionContext: Xrm.Events.EventContext): Promise<void> {
        await super.onLoad(executionContext);
    }
}
