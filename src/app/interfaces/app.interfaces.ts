export interface UserLoginData {
  email: string,
  password: string
}
export interface Token {
  token: string
}
export interface UserData {
  token?: string,
  id?: number,
  role?: string,
  name?: string
}
