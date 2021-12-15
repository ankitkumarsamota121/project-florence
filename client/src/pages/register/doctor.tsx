import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { useDoctorRegisterMutation } from '../../generated/graphql';
import { setToken, tokenVar } from '../../utils/tokenManager';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import * as Yup from 'yup';
import ErrorDisplay from '../../components/ErrorDisplay';

const DoctorRegister = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push('/');
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
      {error && <ErrorDisplay error={error} setError={setError} />}
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          specialities: '',
          designation: '',
        }}
        validationSchema={doctorRegisterValidationSchema}
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
            <InputField name='name' placeholder='John Doe' label='Name' />
            <Spacer mt={4} />
            <InputField
              name='email'
              placeholder='johndoe@example.com'
              label='Email'
            />
            <Spacer mt={4} />
            <InputField
              name='password'
              placeholder='Password'
              label='Password'
              type='password'
            />
            <Spacer mt={4} />
            <Flex>
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
            <Button mt={8} type='submit' color='teal' isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default DoctorRegister;
