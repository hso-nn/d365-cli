import {Translation} from '../translation/Translation';

export class EntityForm {
    static async onLoad(executionContext: Xrm.Events.EventContext): Promise<void> {
        await Translation.init({
            relativePath: '<%= publisher %>_/<%= namespace %>/locales'
        });
    }
}
