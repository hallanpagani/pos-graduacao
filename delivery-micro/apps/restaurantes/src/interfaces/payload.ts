export interface Payload {
  id: string;
  email: string;
  dono: boolean;

  iat?: number;
  exp?: number;
}
