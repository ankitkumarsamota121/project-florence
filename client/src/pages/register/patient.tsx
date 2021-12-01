import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { usePatientRegisterMutation } from '../../generated/graphql';
import { setToken, tokenVar } from '../../utils/tokenManager';
import { useRouter } from 'next/dist/client/router';
import { useReactiveVar } from '@apollo/client';

interface PatientRegisterProps {}

const PatientRegister: React.FC<PatientRegisterProps> = () => {
  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    if (token) router.push('/');
  }, [token]);

  const genders = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [patientRegister] = usePatientRegisterMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          gender: '',
          blood_group: '',
        }}
        onSubmit={async (values) => {
          const { data, errors } = await patientRegister({
            variables: { input: values },
          });

          if (errors) {
            console.log(errors);
          } else {
            setToken(data!.patientRegister.accessToken);
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
