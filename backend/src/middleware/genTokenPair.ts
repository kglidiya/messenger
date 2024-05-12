import * as jwt from 'jsonwebtoken';

const genTokenPair = (id: string) => {
  const payload = {
    id,
  };
  return {
    accessToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '12h',
    }),
    refreshToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '7d',
    }),
  };
};

export default genTokenPair;
