// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import React from 'react';
import ReactDom from 'react-dom';
import './Webresource.scss';
import {App, AppProps, AppState} from '../tsx/App';

interface WebresourceState extends AppState {}

interface WebresourceProps extends AppProps {}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
class Webresource extends App<WebresourceProps, WebresourceState> {
    public state: WebresourceState = {};

    public render(): JSX.Element {
        return <p>Language: {this.globalContext.userSettings.languageId}</p>;
    }
}

export function onLoad(): void {
    const globalContext = Xrm.Utility.getGlobalContext(),
        rootDiv = document.getElementById('Webresource');
    ReactDom.render(<Webresource globalContext={globalContext} />, rootDiv);
}
