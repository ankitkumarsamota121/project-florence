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
import { useDoctorRegisterMutation } from '../../generated/graphql';
import { setToken, tokenVar } from '../../utils/tokenManager';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import * as Yup from 'yup';
import ErrorAlert from '../../components/ErrorAlert';

const DoctorRegister = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push('/profile/doctor');
  }, [token]);
  const [doctorRegister] = useDoctorRegisterMutation();

  const specialities = [
    'Surgery',
    'Pediatrics',
    'Dermatology',
    'Internal Medicine',
    'Orthopaedics',
    'Gynaecology',
    'Oncology',
    'Cardiology',
  ];
  const designations = [
    'Physician',
    'Dentist',
    'Paramedic',
    'Surgeon',
    'Physical Assistant',
  ];

  const doctorRegisterValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    specialities: Yup.string().oneOf(specialities).required('Required!'),
    designation: Yup.string().oneOf(designations).required('Required!'),
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
        <Center flexDir='column'>
          {error && <ErrorAlert error={error} setError={setError} />}
          <Heading textAlign='center' mb={12}>
            Create Account
          </Heading>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              specialities: '',
              designation: '',
            }}
            validationSchema={doctorRegisterValidationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values) => {
              try {
                const { data, errors } = await doctorRegister({
                  variables: { input: values },
                });

                if (errors) {
                  setError(errors[0].message);
                } else {
                  setToken(data!.doctorRegister.accessToken);
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
                  <Flex w='100%'>
                    <SelectField
                      name='specialities'
                      placeholder='Select Specialities'
                      label='Specialities'
                      options={specialities}
                    />
                    <Spacer mx={2} />
                    <SelectField
                      name='designation'
                      placeholder='Select Designation'
                      label='Designation'
                      options={designations}
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

export default DoctorRegister;
