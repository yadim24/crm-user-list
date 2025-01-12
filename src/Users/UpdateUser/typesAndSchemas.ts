import { z } from 'zod';

export const validationUserScheme = z.object({
  first_name: z.string().min(1, { message: 'Слишком короткое имя' }),
  last_name: z.string().min(1, { message: 'Слишком короткая фамилия' }),
  patronymic: z.string().min(1, { message: 'Слишком короткое отчество' }),
  company: z.string().min(1, { message: 'Слишком короткое название' }),
  email: z.string().email('Формат email не соответствует'),
  phone: z.string().regex(/^\+?\d{10,13}\b/),
});

export type UserFormValue = z.infer<typeof validationUserScheme>;
