// components/MaskedSSNField.tsx

import React, { useState, ChangeEvent, FocusEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

// Extend MUI's TextFieldProps to allow all native props like label, fullWidth, etc.
interface MaskedSSNFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string; // Full SSN stored internally
  onChange: (value: string) => void; // Handler to update SSN in parent
}

// Mask the first 5 digits: ***-**-6789
const maskSSN = (ssn: string): string => {
  if (ssn.length !== 9) return ssn; // Mask only if SSN is exactly 9 digits
  return `***-**-${ssn.slice(5)}`;
};

const MaskedSSNField: React.FC<MaskedSSNFieldProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(maskSSN(value));
  const [isMasked, setIsMasked] = useState(true); // Track if input is masked

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Allow only digits
    if (rawValue.length <= 9) {
      onChange(rawValue); // Update parent state with full SSN
      setInputValue(rawValue); // Temporarily show unmasked value
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsMasked(true); // Mask input on blur
    setInputValue(maskSSN(value));
  };

  const handleFocus = () => {
    setIsMasked(false); // Show full value on focus
    setInputValue(value);
  };

  return (
    <TextField
      {...props} // Pass other TextField props (label, fullWidth, etc.)
      value={isMasked ? maskSSN(value) : inputValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      inputProps={{ maxLength: 11 }} // Limit input to 9 digits (formatted as ***-**-6789)
    />
  );
};

export default MaskedSSNField;
