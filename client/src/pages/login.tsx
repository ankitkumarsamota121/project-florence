import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { getToken, setToken } from '../utils/tokenManager';
import { useRouter } from 'next/dist/client/router';
import { useQuery } from '@apollo/client';
import { withApollo } from '../utils/withApollo';
import { getDataFromTree } from '@apollo/client/react/ssr';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const {
    data: { token },
  } = useQuery(getToken);

  useEffect(() => {
    console.log(token);
    if (token) router.push('/');
  }, [token]);

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          const { data, errors } = await login({
            variables: { ...values, userType: 'patient' },
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
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
              />
            </Box>
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