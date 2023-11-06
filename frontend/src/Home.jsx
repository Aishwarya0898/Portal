import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const primaryColor = '#007bff'; // Change to your preferred primary color
const secondaryColor = '#f50057';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: primaryColor, // Use your primary color as background
  },
  overlay: {
    background: '#adb5bd', // Adjust overlay opacity
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: 'center',
    borderRadius: '15px', // Adjust paper border radius
    boxShadow: '0px 10px 20px #373b3e', // Add a subtle box shadow
    position: 'relative',
    zIndex: 2,
    background: '#dee2e6', // Use a semi-transparent white background
  },
  title: {
    fontSize: '2rem',
    marginBottom: theme.spacing(2),
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    fontSize: '1.2rem',
    padding: theme.spacing(1.5, 4),
    margin: theme.spacing(0, 2),
    textTransform: 'none', // Prevent uppercase text
    borderRadius: '25px', // Adjust button border radius
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add a subtle box shadow
  },
  
}));

function Home() {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

  return (
    <Container className={classes.container}>
      <div className={classes.overlay}></div>
      <Paper className={classes.paper}>
      <Typography
      variant='h4'
      align='center'
      mb={3}
      style={{
        color: 'white',
        fontFamily: 'Roboto, sans-serif', // Set the font family
        fontWeight: 'bold',
        backgroundImage: 'linear-gradient(to right, rgb(44 54 66), rgb(112 193 217))',
        padding: '10px',
        textShadow: '2px 2px 4px #fff',
        borderRadius: '8px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <strong>University Portal</strong>
      </Typography>
      <br/>
        <Typography variant="body1" className={classes.description}>
          <strong>Welcome! Please log in or register to continue.</strong>
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            href="login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            href="register"
          >
            Register
          </Button>
        </div>
      </Paper>
    </Container>
  );
}

export default Home;
