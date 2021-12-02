import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  Spacer,
  Flex,
  Button,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Wrapper from '../../components/Wrapper';
import {
  useCreateRecordMutation,
  useMeQuery,
  useSingleUploadMutation,
} from '../../generated/graphql';
import { setToken } from '../../utils/tokenManager';
import { get } from 'lodash';

interface PatientRecordProps {}

const PatientRecord = (props: PatientRecordProps) => {
  const [uploading, setUploading] = useState(false);
  const [createRecord] = useCreateRecordMutation();

  const { data: meData } = useMeQuery({
    nextFetchPolicy: 'cache-first',
  });
  let userInfo = get(meData, 'me', null);

  const recordCategories = ['AB', 'BCD', 'ED'];

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append(
      'operations',
      '{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) }", "variables": { "file": null } }'
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
      return data?.singleUpload;
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <Wrapper variant='small'>
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
            console.log('SOME ERROR OCCURED!!!');
            return;
          }

          const attachmentId = await uploadFile(attachmentRef.files[0]);
          try {
            const { data, errors } = await createRecord({
              variables: {
                ...values,
                attachmentId: parseInt(attachmentId),
                userType: userInfo!.userType.toUpperCase(),
                patientId: undefined,
              },
            });

            console.log(data);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
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
            <FormControl>
              <FormLabel htmlFor='description'>Description</FormLabel>
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
            </FormControl>
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
  );
};

export default PatientRecord;
