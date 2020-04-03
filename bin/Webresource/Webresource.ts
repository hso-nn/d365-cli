import './Webresource.scss';

class Webresource {
    public static onLoad(globalContext: Xrm.GlobalContext): void {
        console.log(globalContext); // Prevent linting error
    }
}

export function onLoad(): void {
    const globalContext = Xrm.Utility.getGlobalContext();
    Webresource.onLoad(globalContext);
}
