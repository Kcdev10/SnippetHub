export interface IENV {
  PORT: string;
  MONGODB_URI: string;
  CORS_ORIGIN_ACCESS: string;
}

export interface UserPayload {
  _id: string;
  name: string;
  email: string;
}
