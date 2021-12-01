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
import { Formik, Form } from 'formik';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Wrapper from '../../components/Wrapper';
import { useSingleUploadMutation } from '../../generated/graphql';
import { setToken } from '../../utils/tokenManager';

interface PatientRecordProps {}

const PatientRecord = (props: PatientRecordProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState('');

  const recordCategories = ['AB', 'BCD', 'ED'];

  const uploadFileHandler = async (e: any) => {
    // const file = e.target.files[0];
    // console.log(file);
    // const formData = new FormData();
    // formData.append(
    //   'operations',
    //   '{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) }", "variables": { "file": null } }'
    // );
    // formData.append('map', '{ "0": ["variables.file"] }');
    // formData.append('0', file);
    // setUploading(true);
    // try {
    //   const url = 'http://localhost:4000';
    //   const { data } = await axios.post(`${url}/graphql`, formData);
    //   console.log(data);
    //   setFile(data);
    //   setUploading(false);
    // } catch (error) {
    //   console.error(error);
    //   setUploading(false);
    // }
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{
          title: '',
          description: '',
          category: '',
          attachment: '',
        }}
        onSubmit={async (values) => {
          // 1. Upload File
          const attachmentRef = document.getElementById(
            'attachment'
          ) as HTMLInputElement;
          if (attachmentRef && attachmentRef.files) {
            const file = attachmentRef.files[0];
            console.log(file);
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
              const { data } = await axios.post(`${url}/graphql`, formData);
              console.log(data);

              setFile(data);
              setUploading(false);
            } catch (error) {
              console.error(error);
              setUploading(false);
            }
          }

          // 2. Everything Else
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
              <Textarea
                id='description'
                name='description'
                placeholder='Enter Record Description'
              />
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
                onChange={uploadFileHandler}
              />
              {/* {error && <FormErrorMessage>{error}</FormErrorMessage>} */}
            </FormControl>

            <Button mt={8} type='submit' color='teal' isLoading={isSubmitting}>
              Add Record
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default PatientRecord;
