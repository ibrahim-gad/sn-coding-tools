import { Box, ThemeProvider, createTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
    localStorage.setItem('theme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <Navbar onThemeToggle={toggleTheme} isDarkTheme={isDarkTheme} />
        <Box component="main" className="pt-16 px-4">
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout; 