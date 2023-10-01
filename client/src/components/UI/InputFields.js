import React from 'react';

import { FormLabel, Input } from '@chakra-ui/react';

const InputFields = ({
  htmlFor,
  labelText,
  type,
  id,
  name,
  defaultValue,
  onChange,
  labelStyle,
  inputStyle,
}) => {
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
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        fontSize="md"
        {...inputStyle}
      />
    </>
  );
};

export default InputFields;
