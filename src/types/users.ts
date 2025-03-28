import IUser from "./user";

export interface IUserResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: IUser[];
  support: {
    url: string;
    text: string;
  };
}

export interface TransformedUserResponse {
  totalPages: number;
  users: IUser[];
}
