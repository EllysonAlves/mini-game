import React, { useState } from 'react';

const InputForm = ({ onInputChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    onInputChange(value);
  };

  return (
    <div>
      <label>Digite a sequência:</label>
      <input autoFocus  type="text" value={inputValue} onChange={handleChange} />
    </div>
  );
};

export default InputForm;
