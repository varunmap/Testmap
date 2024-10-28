// SSNInput.tsx (Business Tax ID Input)
import React, { FC, FocusEvent, useState, ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface SSNInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

// Function to format Business Tax ID (EIN) for display (e.g., 12-3456789)
const formatEIN = (ein: string) => {
  const cleaned = ein.replace(/\D/g, ''); // Remove non-digit characters
  const part1 = cleaned.slice(0, 2);
  const part2 = cleaned.slice(2, 9);
  return `${part1}-${part2}`; // Add dash after the first 2 digits
};

// Function to mask EIN, showing only the last 4 digits (e.g., **-***6789)
const maskEIN = (ein: string) => {
  const cleaned = ein.replace(/\D/g, ''); // Remove non-digit characters
  if (cleaned.length < 9) return cleaned; // Show as-is if incomplete
  return `**-***${cleaned.slice(-4)}`; // Mask everything except last 4 digits
};

// Function to remove dashes before sending to the backend
const stripDashes = (ein: string) => ein.replace(/-/g, '');

const SSNInput: FC<SSNInputProps> = ({ value, onChange, ...props }) => {
  const [isMasked, setIsMasked] = useState(true); // Track masking state

  // Handle blur: Mask the EIN on blur
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsMasked(true);
  };

  // Handle focus: Show full EIN for editing
  const handleFocus = () => {
    setIsMasked(false);
  };

  // Handle input changes and update EIN value
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Keep only digits
    onChange(rawValue); // Send raw value to parent
  };

  // Determine the value to display: masked or formatted EIN
  const displayValue = isMasked ? maskEIN(value) : formatEIN(value);

  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      label="Business Tax ID (EIN)"
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      inputProps={{
        pattern: "\\d{2}-\\d{7}", // Validation pattern for EIN
      }}
    />
  );
};

export default SSNInput;
