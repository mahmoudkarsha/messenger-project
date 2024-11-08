import Axios from 'axios';

const local = 'http://127.0.0.1:3001';
const router = 'http://192.168.0.150:3001';
const server = 'https://www.ms.gov';
const serverEmni = 'https://10.1.1.105';
const serverIp = 'https://10.1.1.100';

export const SERVER_URL = serverEmni;
export default Axios.create({
  baseURL: SERVER_URL + '/backendserver',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
