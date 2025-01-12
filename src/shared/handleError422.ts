import { Dispatch } from '@reduxjs/toolkit';
import { AxiosResponse, isAxiosError } from 'axios';
import { openAlert } from 'store/toastSlice';

/**
 * Эта функция обрабатывает ошибки формы со статусом 422,
 * при неверной валидации возвращает неизвестную ошибку в тостер.
 * @example
 * const updateProductionStageItemMutation = useUpdateProductionStageItem(
 *  { productionStageId },
 *  {
 *    onError: handleError422Extended({
 *      dispatch,
 *      callback: (response) => {
 *        const validatedError = schemeErrorProductionStageItemDto.safeParse(
 *          response.data,
 *        );
 *
 *        if (validatedError.success && validatedError.data.status) {
 *          dispatch(
 *            openAlert({
 *              message: validatedError.data.status.join(' '),
 *              alertType: 'error',
 *            }),
 *          );
 *
 *          return true;
 *        }
 *
 *        return false;
 *      },
 *    }),
 *  },
 * );
 */
export const handleError422 =
  (params: {
    dispatch: Dispatch;
    callback: (errorResponse: AxiosResponse) => boolean;
  }) =>
  (error: unknown): void => {
    if (
      isAxiosError(error) &&
      error.response?.data &&
      error.response.status === 422
    ) {
      if (!params.callback(error.response)) {
        params.dispatch(
          openAlert({
            message: 'Произошла неизвестная ошибка',
            alertType: 'error',
          }),
        );
      }
    }
  };
