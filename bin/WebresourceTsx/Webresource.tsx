import React, {useState} from 'react';
import ReactDom from 'react-dom';
import './Webresource.scss';
import {Translation} from '../translation/Translation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WebresourceProps {}

// eslint-disable-next-line no-unused-vars,max-lines-per-function
const Webresource: React.FC<WebresourceProps> = (props: WebresourceProps): JSX.Element => {
    const [translationInitialized, setTranslationInitialized] = useState(false);
    Translation.init({
        relativePath: '<%= publisher %>_/<%= namespace %>/locales'
    }).then(() => {
        setTranslationInitialized(true);
    });

    // eslint-disable-next-line max-lines-per-function
    return (
        <>
            {translationInitialized && <span>{Translation.translate('Language')}</span>}
        </>
    );
};
export default Webresource;

export function onLoad(): void {
    const rootDiv = document.getElementById('Webresource');
    ReactDom.render(<Webresource/>, rootDiv);
}
