import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Swal from 'sweetalert2';

import Lobby from '../components/Lobby';
import ShowQuestion from '../components/ShowQuestion';
import Final from '../components/Final';
import api from '../services/api';

export default function QuizApply() {
  const navigate = useNavigate();
  const [quizStage, setQuizStage] = useState('lobby'); // 'lobby', 'question', 'podium'
  
  const startQuiz = () => {
    setQuizStage('question');
  };

  const finishQuiz = () => {
    setQuizStage('final');
  };

  const finishApply = () => {
    setQuizStage('')
  }

  const handleCancel = async () => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Cancelar questionário?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não, continuar",
      confirmButtonText: "Sim, cancelar",
      reverseButtons: true,
      confirmButtonColor: '#d33',
  }).then(async (result) => {
    if(result.isConfirmed) {
      await api.get('/limparEstado').then(response => {
        navigate('/');
      });
    }
  })}
    
  return (
    <Container>
      <Container style={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <IconButton aria-label='Cancelar questionário' color="error" size='large' onClick={handleCancel}>
          <Close sx={{ fontSize: '2.5rem' }} />
        </IconButton>
      </Container>

      {quizStage === 'lobby' && <Lobby onStartQuiz={startQuiz} />}

      {quizStage === 'question' && (<ShowQuestion onFinishQuiz={finishQuiz} />)}

      {quizStage === 'final' && <Final onFinishResults={finishApply} />}

    </Container>
  );
};