import jwt_decode from 'jwt-decode';
import { removeToken } from './tokenManager';

const validateToken = (token: string) => {
  const decoded = jwt_decode(token) as any;
  const curr = Math.floor(Date.now() / 1000);
  if (curr > decoded.exp) {
    removeToken();
  }
};

export default validateToken;
