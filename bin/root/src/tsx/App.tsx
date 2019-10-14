import {Component} from 'react';
import {Translation} from '../translation/Translation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
    translationsLoaded?: boolean;
}

export interface AppProps {
    globalContext?: Xrm.GlobalContext;
}

export class App<P extends AppProps, S extends AppState> extends Component<P, S> {
    public constructor(props: P, state: S) {
        super(props, state);
        Translation.init({
            relativePath: '<%= publisher %>_/<%= projectabbr %>/locales'
        }).then(() => {
            this.setState({
                translationsLoaded: true
            });
        });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    protected get globalContext(): Xrm.GlobalContext {
        return this.props.globalContext;
    }
}
