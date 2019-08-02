import './Webresource.scss';

class Webresource {
    public static onLoad(executionContext: Xrm.Events.EventContext): void {
    }
}

export function onLoad(executionContext: Xrm.Events.EventContext): void {
    Webresource.onLoad(executionContext);
}
