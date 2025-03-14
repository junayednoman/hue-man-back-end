import jsonwebtoken from "jsonwebtoken";
import { IJWTPayload } from "../interfaces";
import config from "../config";

const verifyJWT = (token: string): IJWTPayload => {
  const decoded = jsonwebtoken.verify(token, config.jwt_access_secret as string)
  return decoded as IJWTPayload;
}

export default verifyJWT;