
export const jsonHttpHeaders = {
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Http {
    public static request(method: Method, url: string, data?: any, httpHeaders: HttpHeaders = {}): Promise<XMLHttpRequest> {
        return new Promise((resolve, reject): void => {
            const request = new XMLHttpRequest(),
                requestData = data && JSON.stringify(data),
                headerKeys = Object.keys(httpHeaders);
            request.open(method, encodeURI(url), true);
            for (const key of headerKeys) {
                request.setRequestHeader(key, httpHeaders[key]);
            }
            request.onreadystatechange = function (): void {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    if ([200, 201, 204, 304].includes(this.status)) {
                        resolve(request);
                    } else {
                        reject(new Error(request.response));
                    }
                }
            };
            request.send(requestData);
        });
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
