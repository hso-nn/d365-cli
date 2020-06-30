import {AdalRouterContext} from '../AdalRouter';
import {SdkMessageProcessingStepConfig} from '../sdkmessageprocessingstep/SdkMessageProcessingStep.model';
import {SdkMessageProcessingStepImageModel} from '../sdkmessageprocessingstepimage/SdkMessageProcessingStepImage.model';
import {SdkMessageProcessingStepImageService} from '../sdkmessageprocessingstepimage/SdkMessageProcessingStepImage.service';

export class DeploySdkMessageProcessingStepImage {
    private readonly context: AdalRouterContext;

    constructor(context: AdalRouterContext) {
        this.context = context;
    }

    public async deployImage(step: SdkMessageProcessingStepConfig): Promise<void> {
        const {image} = step;
        if (image) {
            await this.context.log(`<b>Sdkmessageprocessingstepimage</b><br/>${image.name}`);
            await this.upsertImage(image, step);
        } else {
            await this.context.log('No image configured');
        }
    }

    private async upsertImage(image: SdkMessageProcessingStepImageModel, step: SdkMessageProcessingStepConfig): Promise<SdkMessageProcessingStepImageModel> {
        let deployedImage = await this.getDeployedImage(image, step);
        if (deployedImage) {
            return this.updateImage(deployedImage, image);
        } else {
            deployedImage = await this.createImage(image, step);
            await SdkMessageProcessingStepImageService.addToSolution(deployedImage, this.context);
            return deployedImage;
        }
    }

    private async getDeployedImage(image: SdkMessageProcessingStepImageModel, step: SdkMessageProcessingStepConfig): Promise<SdkMessageProcessingStepImageModel> {
        const deployedImages = await SdkMessageProcessingStepImageService.retrieveMultipleRecords({
            select: ['name', 'entityalias', 'imagetype'],
            filters: [{
                conditions: [{
                    attribute: 'sdkmessageprocessingstepid',
                    value: step.sdkmessageprocessingstepid
                }, {
                    attribute: 'name',
                    value: image.name
                }]
            }]
        }, this.context);
        return deployedImages[0];
    }

    private async updateImage(deployedImage: SdkMessageProcessingStepImageModel, image: SdkMessageProcessingStepImageModel): Promise<SdkMessageProcessingStepImageModel> {
        const {entityalias, imagetype} = deployedImage,
            mergedImage = Object.assign(deployedImage, image);
        if (image.entityalias !== entityalias || image.imagetype !== imagetype) {

            // SdkMessageProcessingStepImageService.upsert(mergedImage, this.bearer); // TODO aanzetten
            await this.context.log(`Updated...`);
        } else {
            await this.context.log(` unmodified<br/>`);
        }
        return mergedImage;
    }

    private async createImage(image: SdkMessageProcessingStepImageModel, step: SdkMessageProcessingStepConfig): Promise<SdkMessageProcessingStepImageModel> {
        const createImage = Object.assign({
            sdkmessageprocessingstepid: step.sdkmessageprocessingstepid
        }, image) as SdkMessageProcessingStepImageModel;
        // await SdkMessageProcessingStepImageService.upsert(createImage, this.bearer); // TODO aanzetten
        // const deployedImage = await this.getDeployedImage(createImage, step); // TODO aanzetten
        return createImage; // TODO vervangen met: return deployedImage;
    }
}
