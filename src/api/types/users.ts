import { z } from 'zod';

export const userDTO = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  patronymic: z.string(),
  company: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?\d{10,13}\b/),
});

export type UserDTO = z.infer<typeof userDTO>;

export const userListDTO = z.array(userDTO);

export type UserListDTO = z.infer<typeof userListDTO>;

export type UpdateUserDTO = {
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  company?: string;
  email?: string;
  phone?: string;
};

export type AddUserDTO = Required<UpdateUserDTO>;

export type UserListQueryDTO = {
  ordering?: string;
  search?: string;
};
