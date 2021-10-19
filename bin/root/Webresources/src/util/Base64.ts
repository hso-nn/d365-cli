
export class Base64 {
    static decode(base64: string): string {
        if (typeof window !== 'undefined') {
            return decodeURIComponent(Array.prototype.map.call(window.atob(base64), function (c: string) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } else {
            return Buffer.from(base64, 'base64').toString('ascii');
        }
    }

    static encode(text: string): string {
        if (typeof window !== 'undefined') {
            return window.btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(Number('0x' + p1));
            }));
        } else {
            return Buffer.from(text).toString('base64');
        }
    }

    static blob(base64: string, mimetype = '', sliceSize = 512): Blob {
        const input = base64.replace(/\s/g, ''),
            byteCharacters = atob(input),
            byteArrays = [];
        let offset, slice, byteNumbers, i, byteArray, blob;
        for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            slice = byteCharacters.slice(offset, offset + sliceSize);
            byteNumbers = new Array(slice.length);
            for (i = 0; i < slice.length; i += 1) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        try {
            blob = new Blob(byteArrays, {
                type: mimetype
            });
        } catch (e) {
            return Base64.oldBlob(byteArrays, mimetype, e);
        }
        return blob;
    }

    static oldBlob(byteArrays: Uint8Array[], mimetype: string, e: Error): Blob {
        let offset, blob;
        if (e.name === 'TypeError') {
            const dataViews = [];
            for (offset = 0; offset < byteArrays.length; offset += 1) {
                dataViews.push(new DataView(byteArrays[offset].buffer));
            }
            blob = new Blob(dataViews, {type: mimetype});
        } else if (e.name === 'InvalidStateError') {
            blob = new Blob(byteArrays, {
                type: mimetype
            });
        } else {
            return null;
        }
        return blob;
    }

    static decodeBlob(blob: Blob): Promise<string> {
        return new Promise((resolve, reject): void => {
            const fileReader = new FileReader();
            fileReader.onload = (readerEvt: ProgressEvent<FileReader>): void => {
                let data: string = readerEvt.target.result.toString();
                const prefix = 'base64,';
                if (data.includes(prefix)) {
                    data = data.substr(data.indexOf(prefix) + prefix.length);
                }
                resolve(data);
            };
            fileReader.onerror = (ev: ProgressEvent<FileReader>): void => {
                reject(ev);
            };
            fileReader.readAsDataURL(blob);
        });
    }

    decode(base64: string): string {
        return Base64.decode(base64);
    }

    encode(text: string): string {
        return Base64.encode(text);
    }

    blob(base64: string, contentType = '', sliceSize = 512): Blob {
        return Base64.blob(base64, contentType, sliceSize);
    }

    decodeBlob(blob: Blob): Promise<string> {
        return Base64.decodeBlob(blob);
    }
}
