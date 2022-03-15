import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Flex, Spacer } from '@chakra-ui/react';
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
    if (token) router.push('/');
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
    <Wrapper variant='small'>
      {error && <ErrorAlert error={error} setError={setError} />}
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
        onSubmit={async ({ name, email, password, gender, blood_group }) => {
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
            <Button mt={8} type='submit' color='teal' isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default PatientRegister;
