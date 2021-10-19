type Method = 'GET' | 'POST' | 'DELETE';

interface HttpHeaders {
    [index: string]: string;
}

interface JsonHttpHeaders extends HttpHeaders {
    'OData-MaxVersion': string;
    'OData-Version': string;
    'Accept': string;
    'Content-Type': string;
}
