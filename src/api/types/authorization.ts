import { z } from 'zod';

export type LoginDTO = {
  name: string;
  password: string;
};

export const authDTO = z.object({
  access: z.string(),
  refresh: z.string(),
});

export type AuthDTO = z.infer<typeof authDTO>;
