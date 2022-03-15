import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Spacer } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { setToken, tokenVar } from '../utils/tokenManager';
import { useRouter } from 'next/dist/client/router';
import { useReactiveVar } from '@apollo/client';
import UserTypeField from '../components/UserTypeField';
import ErrorAlert from '../components/ErrorAlert';
import * as Yup from 'yup';
import { DOCTOR, PATIENT } from '../constants/userType';

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push(`/`);
  }, [token]);

  const [login] = useLoginMutation();

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    userType: Yup.string().oneOf([PATIENT, DOCTOR]).required('Required!'),
  });

  return (
    <Wrapper variant='small'>
      {error && <ErrorAlert error={error} setError={setError} />}

      <Formik
        initialValues={{ email: '', password: '', userType: '' }}
        validationSchema={loginValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values) => {
          try {
            setError('');
            const { data, errors } = await login({
              variables: { ...values },
            });
            if (errors) {
              setError(errors[0].message);
            } else {
              setToken(data!.login.accessToken);
            }
          } catch (error: any) {
            setError(error.message);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='email' placeholder='Email' label='Email' />
            <Spacer mt={4} />
            <InputField
              name='password'
              placeholder='Password'
              label='Password'
              type='password'
            />
            <Spacer mt={4} />
            <UserTypeField name='userType' label='User Type' />

            <Button mt={4} type='submit' color='teal' isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
