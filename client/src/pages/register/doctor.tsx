import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { useDoctorRegisterMutation } from '../../generated/graphql';
import { getToken, setToken } from '../../utils/tokenManager';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

interface DoctorRegisterProps {}

const DoctorRegister: React.FC<DoctorRegisterProps> = () => {
  const router = useRouter();
  const {
    data: { token },
  } = useQuery(getToken);

  useEffect(() => {
    if (token) router.push('/');
  }, [token]);

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
  const [doctorRegister] = useDoctorRegisterMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          specialities: '',
          designation: '',
        }}
        onSubmit={async (values) => {
          const { data, errors } = await doctorRegister({
            variables: { input: values },
          });

          if (errors) {
            console.log(errors);
          } else {
            setToken(data!.doctorRegister.accessToken);
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
