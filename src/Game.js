import React, { useState, useEffect, useRef } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import './Game.css'; // Importa o arquivo de estilos CSS
import Styles from './Game.module.css';
import { isMobile } from 'mobile-device-detect'; // Importa a função de verificação de dispositivo móvel

const Game = () => {
  const [sequence, setSequence] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const sequenceLength = 6; // Número de letras na sequência
  const timeoutDuration = 2000; // Tempo limite em milissegundos (10 segundos)
  const [timeRemaining, setTimeRemaining] = useState(timeoutDuration);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [playCorrectSound, setPlayCorrectSound] = useState(false);
  const [playWrongSound, setPlayWrongSound] = useState(false);
  const [playTimeoutSound, setPlayTimeoutSound] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (isMobile) {
      alert('Acesso não permitido em dispositivos móveis.');
      window.location.href = 'https://www.kabum.com.br/computadores/pc/pc-gamer'
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      generateSequence();
      const interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 100); // Atualiza a cada 100ms
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(interval); // Limpa o intervalo ao finalizar o jogo
        setGameOver(true);
        setMessage('Tempo esgotado! Você não completou a sequência a tempo.');
        setPlayTimeoutSound(true); // Toca o som de tempo esgotado
      }, timeoutDuration);

      // Limpar o intervalo quando o componente for desmontado ou o jogo terminar
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [gameStarted, gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);
  

  const generateSequence = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // Exemplo de letras disponíveis
    const newSequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      newSequence.push(letters[randomIndex]);
    }
    setSequence(newSequence);
    setTimeRemaining(timeoutDuration); // Reinicia o tempo restante
    setInputValue(''); // Limpa o campo de input
  };

  const handleKeyDown = (event) => {
    if (!gameOver && inputValue.length < sequenceLength) {
      const key = event.key.toUpperCase(); // Converte para maiúsculas
      setInputValue(prevValue => prevValue + key);

      // Verifica se a letra digitada está correta
      if (key === sequence[inputValue.length]) {
        // Se for a última letra da sequência, encerra o jogo
        if (inputValue.length + 1 === sequence.length) {
          setGameOver(true);
          setMessage('Parabéns! Você acertou a sequência.');
        }
        setPlayCorrectSound(true); // Toca o som de acerto
      } else {
        // Se a letra digitada estiver incorreta, encerra o jogo
        setGameOver(true);
        setMessage('Game over! Você errou a sequência.');
        setPlayWrongSound(true); // Toca o som de erro
      }
    }
  };

  const restartGame = () => {
    setSequence([]);
    setGameOver(false);
    setMessage('');
    setTimeRemaining(timeoutDuration);
    setGameStarted(false); // Reinicia o estado de gameStarted para permitir iniciar novamente
  };

  // Calcula o progresso da barra com base no tempo restante
  const progress = (timeoutDuration - timeRemaining) / timeoutDuration * 100;

  useEffect(() => {
    const audioCorrect = new Audio('/correct.mp3');
    if (playCorrectSound) {
      audioCorrect.play();
      setPlayCorrectSound(false); // Reseta o estado para parar a reprodução contínua
    }
  }, [playCorrectSound]);

  useEffect(() => {
    const audioWrong = new Audio('/wrong.mp3');
    if (playWrongSound) {
      audioWrong.play();
      setPlayWrongSound(false); // Reseta o estado para parar a reprodução contínua
    }
  }, [playWrongSound]);

  useEffect(() => {
    const audioTimeout = new Audio('/timeout.mp3');
    if (playTimeoutSound) {
      audioTimeout.play();
      setPlayTimeoutSound(false); // Reseta o estado para parar a reprodução contínua
    }
  }, [playTimeoutSound]);

  return (
    <div className={Styles.gameContainer}>
      <h1>Mini Game</h1>
      {!gameStarted && (
        <div>
          <p>Clique no botão para iniciar o jogo.</p>
          <Button variant="contained" color="primary" onClick={() => setGameStarted(true)}>Iniciar Jogo</Button>
        </div>
      )}
      {gameStarted && (
        <>
          <LinearProgress color="warning" variant="determinate" value={progress} />
          <div className={Styles.sequenceDisplay}>
            {sequence.map((letter, index) => (
              <span key={index} className={`letter ${inputValue[index] === letter ? 'correct' : 'incorrect'}`}>
                {letter}
              </span>
            ))}
          </div>
          {gameOver && (
            <div>
              <p>{message}</p>
              <Button variant="contained" color="warning" onClick={restartGame}>Jogar Novamente</Button>
            </div>
          )}
          {/* Input oculto para capturar eventos de teclado */}
          <input
            type="text"
            value={inputValue}
            ref={inputRef}
            className={Styles.hiddenInput}
            onKeyDown={handleKeyDown}
            autoFocus={gameStarted} // Foca automaticamente no campo de input ao carregar a página
          />
        </>
      )}
    </div>
  );
};

export default Game;
