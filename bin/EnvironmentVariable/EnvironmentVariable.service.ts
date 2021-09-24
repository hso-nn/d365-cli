/* This is a generated file, please regenerate and do not modify */

import {WebApi} from '../WebApi/WebApi';

export class EnvironmentVariableService {
    public static logicalName = 'environmentvariablevalue';
    private static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions): Promise<EnvironmentVariableModel[]> {
        return WebApi.retrieveMultipleRecords(EnvironmentVariableService.logicalName, multipleSystemQueryOptions);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private static async getEnvironmentVariableValue(schemaname: string): Promise<EnvironmentVariableModel> {
        const environmentvariabledefinitions = await WebApi.retrieveMultipleRecords('environmentvariabledefinition', {
            select: ['environmentvariabledefinitionid'],
            filters: [{
                conditions: [{
                    attribute: 'schemaname',
                    value: schemaname
                }]
            }]
        });
        const environmentvariabledefinition = environmentvariabledefinitions[0] as {environmentvariabledefinitionid: string};
        const environmentVariableValues = await EnvironmentVariableService.retrieveMultipleRecords({
            select: ['value'],
            filters: [{
                conditions: [{
                    attribute: 'environmentvariabledefinitionid',
                    value: environmentvariabledefinition.environmentvariabledefinitionid
                }]
            }]
        });
        return environmentVariableValues[0];
    }
}
