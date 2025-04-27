import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import api from '../services/api';
import { Box, Button, CircularProgress, Container, Grid, IconButton, Paper, Stack } from "@mui/material";
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { useQuizClass } from '../contexts/QuizClassContext';
import getReadingTime from '../utils/getReadingTime';
import ProgressBar from "./ProgressBar";

export default function ShowQuestion({ onFinishQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timeIsOver, setTimeIsOver] = useState(false);
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const { quiz } = useQuizClass();

  const liberarProximaQuestao = async () => {
    const result = await api.get('/liberaProximaQuestao');
    setVisible(false);
    setKey(prevKey => prevKey + 1);
    setTimeIsOver(false);
    setShowSpinner(false);
    setButtonEnabled(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  const finalizarQuestionario = async () => {
    const result = await api.get('/liberaProximaQuestao');
    onFinishQuiz();
  }

  const renderTime = ({ remainingTime }) => {
    return (
      <Typography variant="h4">{remainingTime}</Typography>
    );
  };

  useEffect(() => {
    if (quiz && quiz.questoes && quiz.questoes[currentQuestionIndex]) {
      const readingTime = getReadingTime(quiz.questoes[currentQuestionIndex].enunciado);
      setTimer(readingTime);
    }
  }, [currentQuestionIndex, quiz]);

  useEffect(() => {
    if (timeIsOver) {
      setShowSpinner(true);
      setTimeout(() => {
        setShowSpinner(false);
        setButtonEnabled(true);
      }, 2000);
    }
  }, [timeIsOver]);

  return (
    <Stack spacing={6}
      sx={{
        mt: 4,
        justifyContent: "center",
        alignItems: "center",
      }}>

      {
        timeIsOver ? (
          <Typography variant="h5">Tempo esgotado</Typography>
        )
          : (
            <CountdownCircleTimer
              key={key}
              isPlaying
              duration={timer}
              size={110}
              strokeWidth={6}
              colors={['#663399', '#93000a']}
              colorsTime={[timer, 0]}
              onComplete={() => setTimeIsOver(true)}
            >
              {renderTime}
            </CountdownCircleTimer>

          )
      }

      <Typography variant="h5">Questão {currentQuestionIndex + 1} de {quiz.questoes.length}</Typography>
      <ProgressBar current={currentQuestionIndex + 1} target={quiz.questoes.length} />

      <Typography variant="h5">{quiz.questoes[currentQuestionIndex].enunciado}</Typography>

      {
        !timeIsOver && (
          <Typography variant="h5">Responda <span style={{ color: '#1E90FF' }}>Verdadeiro</span> ou <span style={{ color: '#FF4500' }}>Falso</span></Typography>
        )
      }

      {timeIsOver && (
        <Stack spacing={5} width={'35%'}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
          <Typography variant="h5" sx={{ mr: 3 }}>Resposta correta: </Typography>

          {
            visible ?
              (
                quiz.questoes[currentQuestionIndex].resposta === 'V' ?
                  <Typography variant='h5'
                    onClick={() => setVisible(!visible)}>
                    <span style={{ color: '#1E90FF' }}>Verdadeiro</span>
                  </Typography>
                  :
                  <Typography variant='h5'
                    onClick={() => setVisible(!visible)}>
                    <span style={{ color: '#FF4500' }}>Falso</span>
                  </Typography>
              ) : (
                <Paper
                elevation={4}
                sx={{
                  p: 2.5,
                  width: 150,
                  height: 80,
                  bgcolor: visible
                    ? (quiz.questoes[currentQuestionIndex].resposta === 'V' ? 'lightblue' : 'lightcoral')
                    : '#333',
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: 2,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => setVisible(!visible)}
              >
                {!visible && (
                  <Visibility sx={{ fontSize: 40, color: 'white' }} />
                )}
                {visible && (
                  <Typography variant="h6">
                    {quiz.questoes[currentQuestionIndex].resposta === 'V' ? 'Verdadeiro' : 'Falso'}
                  </Typography>
                )}
              </Paper>

              )
          }
          </Box>

          {
            showSpinner ? (
              <CircularProgress />
            ) : (
              currentQuestionIndex === quiz.questoes.length - 1 ? (
                <Button variant="contained" onClick={finalizarQuestionario} disabled={!buttonEnabled} sx={{ mt: 4 }}>
                  Finalizar questionário
                </Button>
              )
                : (
                  <Button variant="contained" onClick={liberarProximaQuestao} disabled={!buttonEnabled} sx={{ mt: 4 }}>
                    Próxima questão
                  </Button>
                )
            )
          }
        </Stack>
      )
      }
    </Stack>
  )
}