import React, {useState, useEffect} from 'react';
import { IInputs } from './generated/ManifestTypes';
import { Observable } from 'rxjs';
import { Label } from '@fluentui/react';

interface PCFComponentInputProps {
    notifyOutputChanged: (value: string) => void;
    contextObserver: Observable<ComponentFramework.Context<IInputs>>;
}

export const PCFComponent: React.FC<PCFComponentInputProps> = (linearInputProps) => {
    const {notifyOutputChanged, contextObserver} = linearInputProps;
    const [context, setContext] = useState<ComponentFramework.Context<IInputs>>();
    const [sampleValue, setSampleValue] = useState<string>();

    useEffect(() => {
        contextObserver.subscribe((context: ComponentFramework.Context<IInputs>) => {
            setContext(context);
            const value = context.parameters.sampleProperty.raw ?? '';
            setSampleValue(value);
        });
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setSampleValue(value);
        notifyOutputChanged(value);
    };

    return (
        <div>
            <Label>{sampleValue}</Label>
            <input onChange={onChange} className={''} defaultValue={sampleValue}/>
        </div>
    );
};
