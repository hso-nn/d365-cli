import {Component} from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {}

export interface AppProps {
    globalContext: Xrm.GlobalContext;
}

export class App<P extends AppProps, S extends AppState> extends Component<P, S> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    protected get globalContext(): Xrm.GlobalContext {
        return this.props.globalContext;
    }
}
