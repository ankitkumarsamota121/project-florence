import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';
import { PATIENT, DOCTOR } from '../constants/userType';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <RadioGroup id={field.name}>
        <Stack direction='row'>
          <Radio {...field} value={PATIENT}>
            Patient
          </Radio>

          <Radio {...field} value={DOCTOR}>
            Doctor
          </Radio>
        </Stack>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </RadioGroup>
    </FormControl>
  );
};

export default InputField;
