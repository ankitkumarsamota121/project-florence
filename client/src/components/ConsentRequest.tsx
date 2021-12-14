import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spacer,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { RefObject, useRef, useState } from 'react';
import { useCreateConsentRequestMutation } from '../generated/graphql';

interface Props {
  recordId: number;
  patientId: string;
}

const ConsentRequest = ({ recordId, patientId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as RefObject<HTMLButtonElement>;

  const [createConsentRequest] = useCreateConsentRequestMutation();

  return (
    <>
      <Button
        colorScheme='teal'
        onClick={() => setIsOpen(true)}
        isLoading={loading}
      >
        Request Access
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay isCentered>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Request Record Access
            </AlertDialogHeader>

            <AlertDialogBody>
              <Formik
                initialValues={{ content: '' }}
                onSubmit={async (values) => {
                  setLoading(true);
                  const { data, errors } = await createConsentRequest({
                    variables: {
                      ...values,
                      recordId,
                      patientId,
                    },
                  });

                  if (errors) {
                    console.log(errors);
                  } else {
                    console.log(data);
                    // refetchHandler();
                  }
                  setLoading(false);
                }}
              >
                {({ values, handleChange, isSubmitting }) => {
                  return (
                    <Form>
                      <Field name='content'>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor='content'>
                              Why do you need to access the record?
                            </FormLabel>
                            <Textarea
                              {...field}
                              id='content'
                              placeholder='Please mention the reason for requesting access.'
                            />
                            {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                          </FormControl>
                        )}
                      </Field>

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
                        Send
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </AlertDialogBody>

            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConsentRequest;
