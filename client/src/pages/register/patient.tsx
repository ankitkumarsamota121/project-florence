import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  Center,
  Flex,
  SimpleGrid,
  Spacer,
  Image,
  Heading,
} from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { usePatientRegisterMutation } from '../../generated/graphql';
import { setToken, tokenVar } from '../../utils/tokenManager';
import { useRouter } from 'next/dist/client/router';
import { useReactiveVar } from '@apollo/client';
import ErrorAlert from '../../components/ErrorAlert';
import * as Yup from 'yup';

const PatientRegister = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push('/profile/patient');
  }, [token]);

  const genders = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [patientRegister] = usePatientRegisterMutation();

  const patientRegisterValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    gender: Yup.string().oneOf(genders).required('Required!'),
    blood_group: Yup.string().oneOf(bloodGroups).required('Required!'),
  });

  return (
    <Wrapper>
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
            Create Account
          </Heading>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              gender: '',
              blood_group: '',
            }}
            validationSchema={patientRegisterValidationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async ({
              name,
              email,
              password,
              gender,
              blood_group,
            }) => {
              try {
                if (!name || !email || !password || !gender || !blood_group) {
                  throw new Error('Please enter information for all fields!');
                }
                const { data, errors } = await patientRegister({
                  variables: {
                    input: { name, email, password, gender, blood_group },
                  },
                });

                if (errors) {
                  setError(errors[0].message);
                } else {
                  setToken(data!.patientRegister.accessToken);
                }
              } catch (error: any) {
                setError(error.message);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Center flexDirection='column'>
                  <InputField
                    name='name'
                    placeholder='Enter your name'
                    label='Name'
                  />
                  <Spacer mt={6} />
                  <InputField
                    name='email'
                    placeholder='Enter your email'
                    label='Email'
                  />
                  <Spacer mt={6} />
                  <InputField
                    name='password'
                    placeholder='Enter your password'
                    label='Password'
                    type='password'
                  />
                  <Spacer mt={6} />
                  <Flex width='100%'>
                    <SelectField
                      name='gender'
                      placeholder='Select Gender'
                      label='Gender'
                      options={genders}
                    />
                    <Spacer mx={2} />
                    <SelectField
                      name='blood_group'
                      placeholder='Select Blood Group'
                      label='Blood Group'
                      options={bloodGroups}
                    />
                  </Flex>
                  <Button
                    mt={10}
                    type='submit'
                    color='teal'
                    isLoading={isSubmitting}
                    size='lg'
                    px={12}
                  >
                    Register
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

export default PatientRegister;
