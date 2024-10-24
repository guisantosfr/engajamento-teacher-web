import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PersistentDrawerLeft from './components/PersistentDrawerLeft';
import { QuizClassProvider } from './contexts/QuizClassContext';
import { Routes, Route } from 'react-router-dom'; 
import ClassDetail from './components/ClassDetail';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <QuizClassProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <PersistentDrawerLeft />
        <Routes>
          <Route path="/classes/:classCode" element={<ClassDetail />} />
        </Routes>
      </ThemeProvider>
    </QuizClassProvider>
  );
}
