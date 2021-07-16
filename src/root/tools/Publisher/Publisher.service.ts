import {NodeApi} from '../NodeApi/NodeApi';
import {PublisherModel} from './Publisher.model';
import {SolutionService} from '../Solution/Solution.service';

export class PublisherService {
    private static entitySetName = 'publishers';

    private static async retrieveRecord(id: string, multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<PublisherModel> {
        return NodeApi.retrieveRecord(PublisherService.entitySetName, id, multipleSystemQueryOptions, bearer);
    }

    public static async getPublisher(bearer: string): Promise<PublisherModel> {
        const solution = await SolutionService.getSolution(['_publisherid_value'], bearer);
        // eslint-disable-next-line no-underscore-dangle
        return PublisherService.retrieveRecord(solution._publisherid_value, {
            select: ['publisherid', 'customizationprefix']
        }, bearer);
    }
}
