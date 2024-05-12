import { verifyToken } from './jwtMiddleware';

export const verify = (token: any): any => {
  const accessToken = token.authorization.split(' ')[1];
  // console.log(verifyToken(accessToken));
  return verifyToken(accessToken);
};
