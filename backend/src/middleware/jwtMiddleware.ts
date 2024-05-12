import * as jwt from 'jsonwebtoken';

export const verifyToken = (
  token: string,
): null | { [key: string]: string } => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData as { [key: string]: string };
  } catch (error) {
    return null;
  }
};
