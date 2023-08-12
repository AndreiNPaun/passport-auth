import React from 'react';

import { FormLabel, Input, Flex, Text } from '@chakra-ui/react';

// reusable component for label and input
const InputFields = React.forwardRef(
  (
    {
      htmlFor,
      labelText,
      type,
      id,
      defaultValue,
      onChange,
      labelStyle,
      inputStyle,
    },
    ref
  ) => {
    return (
      <>
        <FormLabel
          htmlFor={htmlFor}
          fontSize="md"
          fontWeight="600"
          color="#181717"
          p="1rem 1rem 0 0"
          {...labelStyle}
        >
          {labelText}
        </FormLabel>
        <Input
          type={type || 'text'}
          id={id}
          defaultValue={defaultValue}
          onChange={onChange}
          ref={ref}
          fontSize="md"
          {...inputStyle}
        />
      </>
    );
  }
);

export default InputFields;
