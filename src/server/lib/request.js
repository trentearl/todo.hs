import bluebird from 'bluebird';
import requestPrimitive from 'request';

const request = bluebird.promisify(requestPrimitive);

export default request;

