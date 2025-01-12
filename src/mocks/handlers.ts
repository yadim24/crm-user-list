import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import users from './users.json';

// На бэке должна быть проверка данных с фронта, поэтому в мок-запросах
// используется схема валидации zod данных с фронта
const validateAuthRequestBodyScheme = z.object({
  name: z.string(),
  password: z.string(),
});

const validateUserRequestBodyScheme = z.object({
  first_name: z.string(),
  last_name: z.string(),
  patronymic: z.string(),
  company: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?\d{10,13}\b/),
});

let i = 10;

export const handlers = [
  http.get('/api/users/', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    if (search) {
      const filteredUsers = users.filter((user) =>
        user.company.toLowerCase().includes(search.toLowerCase()),
      );

      return HttpResponse.json(filteredUsers);
    }

    return HttpResponse.json(users);
  }),
  http.post('/api/users/', async ({ request }) => {
    const requestBody = await request.json();
    const validatedUserRequestBodyScheme =
      validateUserRequestBodyScheme.parse(requestBody);
    i += 1;
    const newUser = { ...validatedUserRequestBodyScheme, id: i };
    users.push(newUser);

    return HttpResponse.json(newUser);
  }),
  http.get('/api/users/:id/', ({ params }) => {
    const { id } = params;
    const currentUser = users.find((user) => user.id === Number(id));

    return new HttpResponse(JSON.stringify(currentUser), { status: 200 });
  }),
  http.delete('/api/users/:id/', ({ params }) => {
    const { id } = params;
    const index = users.findIndex((user) => user.id === Number(id));
    users.splice(index, 1);

    return HttpResponse.json(users);
  }),
  http.patch('/api/users/:id/', async ({ request, params }) => {
    const requestBody = await request.json();
    const validatedUserRequestBodyScheme =
      validateUserRequestBodyScheme.parse(requestBody);
    const { id } = params;
    const newUserData = { ...validatedUserRequestBodyScheme, id: Number(id) };
    const index = users.findIndex((user) => user.id === Number(id));
    users[index] = newUserData;

    return HttpResponse.json(newUserData);
  }),
  http.get('/api/users/me/', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post('/api/auth/jwt/create/', async ({ request }) => {
    const requestBody = await request.json();
    const validatedRequestBody =
      validateAuthRequestBodyScheme.parse(requestBody);
    const responseData = {
      access: '45453453sdfvsfd',
      refresh: 'fvgsfgstrwrtfsdf',
    };
    const errorData = {
      detail: 'Такого пользователя не существует',
    };

    return validatedRequestBody.name === 'user' &&
      validatedRequestBody.password === 'user'
      ? new HttpResponse(JSON.stringify(responseData), {
          status: 201,
        })
      : new HttpResponse(JSON.stringify(errorData), {
          status: 422,
        });
  }),
  http.post('/api/auth/jwt/refresh/', () => {
    const responseData = {
      access: '45453453sdfvsfd',
      refresh: 'fvgsfgstrwrtfsdf',
    };

    return new HttpResponse(JSON.stringify(responseData), {
      status: 201,
    });
  }),
];
