import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { useAddUser, useUpdateUser } from 'api/endpoints/users';
import { UserDTO } from 'api/types/users';
import isEqual from 'lodash/isEqual';
import { FC, useId } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleError422 } from 'shared/handleError422';
import { handleStandardServerErrors } from 'shared/handleStandardServerErrors';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { FormDevTool } from 'shared/reactHookForm/FromDevTool';
import { schemeErrorDTO } from 'shared/typesAndSchemes';
import { UserFormValue, validationUserScheme } from './typesAndSchemas';
import { UserCompanyInput } from './UserCompanyInput';
import { UserEmailInput } from './UserEmailInput';
import { UserFirstNameInput } from './UserFirstNameInput';
import { UserLastNameInput } from './UserLastNameInput';
import { UserPatronymicInput } from './UserPatronymicInput';
import { UserPhoneInput } from './UserPhoneInput';

type Props = {
  currentUser?: UserDTO;
  onClose: () => void;
};

export const UpdateUserContent: FC<Props> = ({ currentUser, onClose }) => {
  const formId = useId();

  const { control, resetField, setError, handleSubmit } =
    useForm<UserFormValue>({
      resolver: zodResolver(validationUserScheme),
      defaultValues: {
        first_name: currentUser?.first_name ?? '',
        last_name: currentUser?.last_name ?? '',
        patronymic: currentUser?.patronymic ?? '',
        company: currentUser?.company ?? '',
        email: currentUser?.email ?? '',
        phone: currentUser?.phone ?? '',
      },
    });

  const dispatch = useAppDispatch();

  const addUserMutation = useAddUser({
    onSuccess: () => {
      onClose();
    },
    onError: (error) =>
      handleError422({
        dispatch,
        callback: (response) => {
          const validatedError = schemeErrorDTO.safeParse(response.data);

          let isErrorHandled = false;

          if (validatedError.data?.detail)
            isErrorHandled = handleStandardServerErrors<UserFormValue>({
              fields: [
                'first_name',
                'last_name',
                'patronymic',
                'company',
                'email',
                'phone',
              ],
              dispatch,
              callback: (field: keyof UserFormValue, message: string) =>
                setError(field, { type: 'server', message }),
              validatedError: validatedError.data.detail,
            });

          return isErrorHandled;
        },
      })(error),
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      onClose();
    },
    onError: (error) =>
      handleError422({
        dispatch,
        callback: (response) => {
          const validatedError = schemeErrorDTO.safeParse(response.data);

          let isErrorHandled = false;

          if (validatedError.data?.detail)
            isErrorHandled = handleStandardServerErrors<UserFormValue>({
              fields: [
                'first_name',
                'last_name',
                'patronymic',
                'company',
                'email',
                'phone',
              ],
              dispatch,
              callback: (field: keyof UserFormValue, message: string) =>
                setError(field, { type: 'server', message }),
              validatedError: validatedError.data.detail,
            });

          return isErrorHandled;
        },
      })(error),
  });

  const onSubmit: SubmitHandler<UserFormValue> = (formValues) => {
    const validatedFromValues = validationUserScheme.parse(formValues);
    const newFormValues = { ...validatedFromValues, id: currentUser?.id };

    if (currentUser && !isEqual(currentUser, newFormValues)) {
      updateUserMutation.mutate({
        body: formValues,
        userId: currentUser.id,
      });
    }

    if (!currentUser) {
      addUserMutation.mutate(formValues);
    }
  };

  return (
    <>
      <DialogContent>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <UserLastNameInput
            control={control}
            fieldReset={() => resetField('last_name', { defaultValue: '' })}
          />
          <UserFirstNameInput
            control={control}
            fieldReset={() => resetField('first_name', { defaultValue: '' })}
          />
          <UserPatronymicInput
            control={control}
            fieldReset={() => resetField('patronymic', { defaultValue: '' })}
          />
          <UserCompanyInput
            control={control}
            fieldReset={() => resetField('company', { defaultValue: '' })}
          />
          <UserEmailInput
            control={control}
            fieldReset={() => resetField('email', { defaultValue: '' })}
          />
          <UserPhoneInput
            control={control}
            fieldReset={() => resetField('phone', { defaultValue: '' })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          disabled={updateUserMutation.isPending || addUserMutation.isPending}
          onClick={onClose}
        >
          Отмена
        </Button>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            type="submit"
            form={formId}
            disabled={updateUserMutation.isPending || addUserMutation.isPending}
          >
            Сохранить
          </Button>
          {(updateUserMutation.isPending || addUserMutation.isPending) && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </DialogActions>
      <FormDevTool control={control} />
    </>
  );
};
