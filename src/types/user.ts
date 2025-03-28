export default interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UpdateUserRequest {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}
