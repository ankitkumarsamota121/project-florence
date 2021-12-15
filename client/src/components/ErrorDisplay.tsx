import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import React from 'react';

interface ErrorDisplayProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorDisplay = ({ error, setError }: ErrorDisplayProps) => {
  return (
    <Alert status='error'>
      <AlertIcon />
      <AlertDescription>{error}</AlertDescription>
      <CloseButton
        position='absolute'
        right='8px'
        top='8px'
        onClick={() => setError('')}
      />
    </Alert>
  );
};

export default ErrorDisplay;
