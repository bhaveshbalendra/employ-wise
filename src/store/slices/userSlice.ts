import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL from "../../constants/url";
import IUser, { UpdateUserRequest } from "../../types/user";
import { IUserResponse, TransformedUserResponse } from "../../types/users";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["Users"], // Define a tag to track updates
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (loginData) => ({
        url: "/login",
        method: "POST",
        body: loginData,
      }),
    }),
    getUsers: builder.query<TransformedUserResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: "/users",
        method: "GET",
        params: { page },
      }),
      transformResponse: (response: IUserResponse) => ({
        totalPages: response.total_pages,
        users: response.data,
      }),
      providesTags: ["Users"], // Marks this data as tracked by the "Users" tag
    }),
    updateUser: builder.mutation<IUser, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"], // Forces re-fetching users after an update
    }),
    deleteUser: builder.mutation<void, number>({
      query: (user_id) => ({
        url: `/users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], // Forces re-fetching users after a deletion
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
