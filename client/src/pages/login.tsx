import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  Center,
  SimpleGrid,
  Spacer,
  Image,
  Heading,
} from '@chakra-ui/react';
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
      <SimpleGrid columns={2} spacing={10} minH='80vh'>
        <Center px={8}>
          <Image
            src='https://img.freepik.com/free-vector/medical-workers-analyzing-electronic-record_1262-19834.jpg?w=2000&t=st=1650476146~exp=1650476746~hmac=a90bf228285afad32ef68b93718166541b0418c5e73e87dd0d6e43115aba6771'
            alt='Medical Workers Illustration'
          />
        </Center>
        <Center flexDirection='column'>
          {error && <ErrorAlert error={error} setError={setError} />}
          <Heading textAlign='center' mb={12}>
            Sign In
          </Heading>

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
                <Center flexDir='column'>
                  <InputField
                    name='email'
                    placeholder='Email'
                    label='Enter your email'
                  />
                  <Spacer mt={6} />
                  <InputField
                    name='password'
                    placeholder='Enter your password'
                    label='Password'
                    type='password'
                  />
                  <Spacer mt={6} />
                  <UserTypeField name='userType' label='User Type' />

                  <Button
                    mt={8}
                    type='submit'
                    color='teal'
                    isLoading={isSubmitting}
                    size='lg'
                    px={16}
                  >
                    Login
                  </Button>
                </Center>
              </Form>
            )}
          </Formik>
        </Center>
      </SimpleGrid>
    </Wrapper>
  );
};

export default Login;
