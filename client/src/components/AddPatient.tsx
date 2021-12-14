import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spacer,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { RefObject, useRef, useState } from 'react';
import { useAddPatientMutation } from '../generated/graphql';
import InputField from './InputField';

interface Props {
  refetchHandler: () => Promise<void>;
}

const AddPatient = ({ refetchHandler }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as RefObject<HTMLButtonElement>;

  const [addPatient] = useAddPatientMutation();

  return (
    <>
      <Button
        colorScheme='teal'
        onClick={() => setIsOpen(true)}
        isLoading={loading}
      >
        Add Patient
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay isCentered>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Add Patient
            </AlertDialogHeader>

            <AlertDialogBody>
              <Formik
                initialValues={{ patientEmail: '' }}
                onSubmit={async (values) => {
                  setLoading(true);
                  const { data, errors } = await addPatient({
                    variables: { ...values },
                  });

                  if (errors) {
                    console.log(errors);
                  } else {
                    console.log(data);
                    refetchHandler();
                  }
                  setLoading(false);
                }}
              >
                {({ values, handleChange, isSubmitting }) => (
                  <Form>
                    <InputField
                      name='patientEmail'
                      placeholder='Enter Patient Email'
                      label='Patient Email'
                    />
                    <Spacer mt={8} />

                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme='teal'
                      onClick={onClose}
                      ml={3}
                      type='submit'
                      isLoading={isSubmitting}
                    >
                      Add
                    </Button>
                  </Form>
                )}
              </Formik>
            </AlertDialogBody>

            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AddPatient;
