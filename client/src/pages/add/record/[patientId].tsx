import axios from 'axios';
import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Spacer,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import InputField from '../../../components/InputField';
import SelectField from '../../../components/SelectField';
import Wrapper from '../../../components/Wrapper';
import {
  useCreateRecordMutation,
  useMeQuery,
} from '../../../generated/graphql';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import { DOCTOR } from '../../../constants/userType';
import { ChevronRightIcon } from '@chakra-ui/icons';

const PatientRecord = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [createRecord] = useCreateRecordMutation();
  const router = useRouter();

  const { data: meData } = useMeQuery({
    fetchPolicy: 'cache-first',
  });
  const userInfo = get(meData, 'me', null);
  const patientId = router.query.patientId as string;

  const recordCategories = ['AB', 'BCD', 'ED'];

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append(
      'operations',
      '{ "query": "mutation ($file: Upload!) { uploadFile(file: $file) }", "variables": { "file": null } }'
    );
    formData.append('map', '{ "0": ["variables.file"] }');
    formData.append('0', file);
    setUploading(true);
    try {
      const url = 'http://localhost:4000';
      const {
        data: { data },
      } = await axios.post(`${url}/graphql`, formData);
      setUploading(false);
      return data?.uploadFile;
    } catch (error) {
      console.error(error);
      setError('Error occured in uploading!');
      setUploading(false);
    }
  };

  return (
    <>
      <Wrapper variant='small'>
        <NextLink
          href={
            userInfo?.userType.toUpperCase() === DOCTOR
              ? `/view/patient/${patientId}`
              : `/profile/${userInfo?.userType.toLowerCase()}`
          }
        >
          <Button>Go Back</Button>
        </NextLink>
        {error && (
          <Alert status='error'>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
          }}
          onSubmit={async (values) => {
            // 1. Upload File
            const attachmentRef = document.getElementById(
              'attachment'
            ) as HTMLInputElement;
            if (!attachmentRef || !attachmentRef.files) {
              console.log('Unable to access the file!');
              return;
            }

            try {
              const attachmentId = await uploadFile(attachmentRef.files[0]);
              console.log(attachmentId);
              const { data, errors } = await createRecord({
                variables: {
                  input: values,
                  attachmentId: parseInt(attachmentId),
                  userType: userInfo!.userType.toUpperCase(),
                  patientId: patientId || undefined,
                },
                refetchQueries: ['GetRecords', 'GetPatientRecords'],
              });

              if (errors) {
                console.log(errors);
                setError('Some error occurred in creating Record!');
              } else {
                console.log(data);
                if (userInfo?.userType.toUpperCase() === DOCTOR) {
                  router.push(`/view/patient/${patientId}`);
                } else {
                  router.push(`/profile/${userInfo?.userType.toLowerCase()}`);
                }
              }
            } catch (error) {
              // console.log(error.networkError.result.errors[0].message);
              console.log(error);
              setError('Some error occurred in executing query!');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Spacer mt={8} />
              <InputField
                name='title'
                placeholder='Enter Record Title'
                label='Title'
              />
              <Spacer mt={4} />
              <SelectField
                name='category'
                placeholder='Select Record Category'
                label='Category'
                options={recordCategories}
              />
              <Spacer mt={4} />

              <Field name='description'>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel htmlFor='description'>Description</FormLabel>
                    <Textarea
                      {...field}
                      id='description'
                      placeholder='Enter Record Description'
                    />
                    {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                  </FormControl>
                )}
              </Field>

              {/* {error && <FormErrorMessage>{error}</FormErrorMessage>} */}
              <Spacer mt={4} />
              <FormControl>
                <FormLabel htmlFor='attachment'>Attachment</FormLabel>
                <input
                  id='attachment'
                  name='attachment'
                  placeholder='Select File'
                  type='file'
                />
                {/* {error && <FormErrorMessage>{error}</FormErrorMessage>} */}
              </FormControl>

              <Button
                mt={8}
                type='submit'
                color='teal'
                isLoading={isSubmitting || uploading}
              >
                Add Record
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default PatientRecord;
