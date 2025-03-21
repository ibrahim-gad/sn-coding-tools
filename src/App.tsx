import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { ToastContainer } from 'react-toastify';
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={import.meta.env.BASE_URL}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </Router>
      <ToastContainer 
        position="bottom-right" 
        pauseOnHover={false} 
        stacked={true} 
        newestOnTop={true}
        closeOnClick={true}
        autoClose={3000}
      />
    </ThemeProvider>
  );
};

export default App;
