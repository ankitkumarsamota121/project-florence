import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button, Spacer } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { setToken, tokenVar } from '../utils/tokenManager';
import { useRouter } from 'next/dist/client/router';
import { useReactiveVar } from '@apollo/client';
import { DOCTOR, PATIENT } from '../constants/userType';
import UserTypeField from '../components/UserTypeField';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push('/');
  }, [token]);

  const [login] = useLoginMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '', userType: '' }}
        onSubmit={async (values) => {
          console.log(values);
          const { data, errors } = await login({
            variables: { ...values },
          });

          if (errors) {
            console.log(errors);
          } else {
            setToken(data!.login.accessToken);
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
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
