import React, {useState} from 'react';
import ReactDom from 'react-dom';
import './Webresource.scss';
import {Translation} from '../translation/Translation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WebresourceProps {}

// eslint-disable-next-line no-unused-vars,max-lines-per-function
const Webresource: React.FC<WebresourceProps> = (props: WebresourceProps): JSX.Element => {
    const [yourBoolean, setYourBoolean] = useState(false);
    console.log(yourBoolean); // Prevent linting error
    console.log(setYourBoolean); // Prevent linting error
    console.log(props); // Prevent linting error
    // eslint-disable-next-line max-lines-per-function
    return (
        <>
            <span>{Translation.translate('Language')}</span>
        </>
    );
};
export default Webresource;

export function onLoad(): void {
    const rootDiv = document.getElementById('Webresource');
    ReactDom.render(<Webresource/>, rootDiv);
}
