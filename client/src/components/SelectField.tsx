import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { SelectHTMLAttributes } from 'react';

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  options: string[];
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name} fontSize='sm' mb={0}>
        {label}
      </FormLabel>
      <Select
        id={field.name}
        {...field}
        {...props}
        placeholder={props.placeholder}
      >
        {props.options.map((op) => (
          <option value={op} key={op}>
            {op}
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectField;
