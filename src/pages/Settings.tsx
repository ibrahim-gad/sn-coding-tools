import { Container, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Paper className="p-6 bg-white shadow-lg">
        <Typography variant="h4" component="h1" className="mb-6 text-gray-900">
          Settings
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Configure your preferences and application settings here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Settings; 