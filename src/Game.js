import React, { useState, useEffect } from 'react';
import SequenceDisplay from './SequenceDisplay';
import InputForm from './InputForm';

const Game = () => {
  const [sequence, setSequence] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const sequenceLength = 6; // Número de letras na sequência
  const timeoutDuration = 3000; // Tempo limite em milissegundos (10 segundos)

  useEffect(() => {
    if (!gameOver) {
      generateSequence();
      const timeout = setTimeout(() => {
        setGameOver(true);
        setMessage('Tempo esgotado! Você não completou a sequência a tempo.');
      }, timeoutDuration);

      // Limpar o timeout quando o componente for desmontado ou o jogo terminar
      return () => clearTimeout(timeout);
    }
  }, [gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateSequence = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // Exemplo de letras disponíveis
    const newSequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      newSequence.push(letters[randomIndex]);
    }
    setSequence(newSequence);
  };

  const handleInputChange = (input) => {
    setCurrentInput(input);
    // Verifica letra por letra enquanto o usuário digita
    for (let i = 0; i < input.length; i++) {
      if (input[i].toUpperCase() !== sequence[i]) {
        // Se a letra digitada estiver incorreta, encerra o jogo
        setGameOver(true);
        setMessage('Game over! Você errou a sequência.');
        return;
      }
    }
    // Verifica se o usuário completou a sequência corretamente
    if (input.length === sequence.length && input.toUpperCase() === sequence.join('')) {
      setGameOver(true);
      setMessage('Parabéns! Você acertou a sequência.');
    }
  };

  const restartGame = () => {
    setSequence([]);
    setCurrentInput('');
    setGameOver(false);
    setMessage('');
  };

  return (
    <div className="game-container">
      <h1>Mini Game de Sequência</h1>
      {!gameOver && <SequenceDisplay sequence={sequence} />}
      {!gameOver && <InputForm onInputChange={handleInputChange} />}
      {gameOver && (
        <div>
          <p>{message}</p>
          <button onClick={restartGame}>Jogar Novamente</button>
        </div>
      )}
    </div>
  );
};

export default Game;
