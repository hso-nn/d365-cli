
export class Geolocation {
    public static async getPosition(): Promise<GeolocationPosition> {
        const clientContext = Xrm.Utility.getGlobalContext().client,
            client = clientContext.getClient();
        if (client === 'Mobile') {
            return Xrm.Device.getCurrentPosition();
        } else {
            if (navigator.geolocation) {
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
                });
            } else {
                throw new Error('No geo-location feature for this client');
            }
        }
    }
}
