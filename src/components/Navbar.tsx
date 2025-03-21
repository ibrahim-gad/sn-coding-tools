import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FaMoon, FaSun } from "react-icons/fa";

interface NavbarProps {
  onThemeToggle: () => void;
  isDarkTheme: boolean;
}

const Navbar = ({ onThemeToggle, isDarkTheme }: NavbarProps) => {
  return (
    <AppBar position="fixed">
      <Toolbar className='container mx-auto'>
        <Typography variant="h6" component="div" className="flex-grow text-white">
          SN Coding Tools
        </Typography>
        <Box className="flex gap-4 items-center">
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            className="text-white hover:text-gray-300"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/settings"
            className="text-white hover:text-gray-300"
          >
            Settings
          </Button>
          <IconButton
            onClick={onThemeToggle}
            className="text-white hover:text-gray-300"
            size="large"
          >
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 