import {Translation} from '../translation/Translation';

export class EntityForm {
    static onLoad(executionContext: Xrm.Events.EventContext): void {
        Translation.init({
            relativePath: '<%= publisher %>_/<%= projectabbr %>/locales'
        });
    }
}
