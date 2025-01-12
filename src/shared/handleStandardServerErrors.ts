import { Dispatch } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { openAlert } from 'store/toastSlice';
import { z } from 'zod';
import { schemeErrorDTO } from './typesAndSchemes';

// type ErrorField = Record<string, string[]>;
// type TError = Record<string, string[] | ErrorField[]>;
type TError = z.infer<typeof schemeErrorDTO>['detail'] | string;

type Props<TFields extends FieldValues> = {
  fields?: Extract<keyof TFields, string>[];
  callback?: (field: keyof TFields, message: string) => void;
  validatedError: TError;
  dispatch: Dispatch;
};

/**
 * Функция обрабатывает ошибки полей формы со статусом 400 стандартным способом: если в объекте ошибки от сервера есть название поля, которое совпадает с названием инпута формы, присваивает ошибку этому инпуту.
 * Не работает со вложенными полями объекта ошибки, например {parents: {material_number:['Сообщение об ошибке']}, serial:['Сообщение об ошибке']}
 * Если передан callback - исполняет его
 * Если есть поля non_field_error, detail или stream (для форм создания продуктов) - выводит их в тостер.
 * Работает в связке с функцией handleError422.
 * Принимает массив с именами инпутов, ошибки в которых мы хотим обработать стандартно.
 * Возвращает булево значение: ошибка была обработана или нет.
 * Предполагается, что формат ошибки от сервера не будет меняться, см. дженерик TError.
 */
export const handleStandardServerErrors = <TFields extends FieldValues>({
  fields,
  callback,
  validatedError,
  dispatch,
}: Props<TFields>): boolean => {
  let isErrorHandled = false;

  if (fields && Array.isArray(validatedError)) {
    fields.forEach((f) =>
      validatedError.forEach((d) => {
        if (typeof d.loc[1] === 'string' && d.loc[1] === f && callback) {
          const errorMessage = d.msg;

          callback(f, errorMessage);
          isErrorHandled = true;
        }
      }),
    );
  }

  if (typeof validatedError === 'string') {
    dispatch(
      openAlert({
        message: validatedError,
        alertType: 'error',
      }),
    );
    isErrorHandled = true;
  }

  return isErrorHandled;
};
