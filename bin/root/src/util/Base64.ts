

export class Base64 {
    static decode(base64: string) {
        if (typeof window !== 'undefined') {
            return decodeURIComponent(Array.prototype.map.call(window.atob(base64), function (c: string) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } else {
            return Buffer.from(base64, 'base64').toString('ascii');
        }
    }

    static encode(text: string) {
        if (typeof window !== 'undefined') {
            return window.btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                // @ts-ignore
                return String.fromCharCode('0x' + p1);
            }));
        } else {
            return Buffer.from(text).toString('base64');
        }
    }

    static blob(base64: string, mimetype = '', sliceSize = 512) {
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
            // TypeError old chrome, FF and Android browser
            // @ts-ignore
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            // @ts-ignore
            if (e.name === 'TypeError' && window.BlobBuilder) {
                // @ts-ignore
                const bb = new window.BlobBuilder();
                for (offset = 0; offset < byteArrays.length; offset += 1) {
                    bb.append(byteArrays[offset].buffer);
                }
                blob = bb.getBlob(mimetype);
            } else if (e.name === 'InvalidStateError') {
                blob = new Blob(byteArrays, {
                    type: mimetype
                });
            } else {
                return null;
            }
        }
        return blob;
    }

    static decodeBlob(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const fileReader = new window.FileReader();
            fileReader.onload = (readerEvt: any) => {
                let data = readerEvt.target.result;
                const prefix = 'base64,';
                if (data.includes(prefix)) {
                    data = data.substr(data.indexOf(prefix) + prefix.length);
                }
                resolve(data);
            };
            fileReader.onerror = (error: Error) => {
                reject(error);
            };
            fileReader.readAsDataURL(blob);
        });
    }

    decode(base64: string) {
        return Base64.decode(base64);
    }

    encode(text: string) {
        return Base64.encode(text);
    }

    blob(base64: string, contentType = '', sliceSize = 512) {
        return Base64.blob(base64, contentType, sliceSize);
    }

    decodeBlob(blob: Blob) {
        return Base64.decodeBlob(blob);
    }
}
