import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Grid, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ClassDetail() {
  const { classCode } = useParams(); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getClass() {
      try {
        const response = await api.post('/getTurmaTeste', { codigoTurma: classCode });
        setSelectedClass(response.data); 
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os detalhes da turma:', error);
        setIsLoading(false);
      }
    }

    getClass();
  }, [classCode]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedClass || selectedClass.length === 0) {
    return (
      <Box m={4}>
        <Typography variant="h4">Nenhuma turma encontrada para o código: {classCode}</Typography>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>Detalhes da Turma</Typography>
      <Typography variant="h6">Código da Turma: {classCode}</Typography>
      <Typography variant="h6">Número de Alunos: {selectedClass.length}</Typography>

      <Grid container spacing={2} mt={2}>
        {selectedClass.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Matrícula: {student.Matricula}</Typography>
                <Typography variant="body1">Nome: {student.Nome}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
