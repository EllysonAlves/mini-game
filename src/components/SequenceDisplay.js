import React from 'react';

const SequenceDisplay = ({ sequence }) => {
  return (
    <div>
      <h2>Repita a Sequência:</h2>
      <p>{sequence.join(' ')}</p>
    </div>
  );
};

export default SequenceDisplay;
