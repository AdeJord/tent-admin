import React from 'react';
import { StyledGreeting } from '../styles';

interface GreetingProps {
  loggedInName: string;
}

const Greeting: React.FC<GreetingProps> = ({ loggedInName }) => {
  // Get the current hour
  const currentHour = new Date().getHours();

  // Determine the greeting based on the current hour
  let greeting;
  if (currentHour < 4) {
    greeting = `You're up early, ${loggedInName}. Hope you have a great day!`;
  } else if (currentHour < 8) {
    greeting = `Good Morning, ${loggedInName}. Have a great day!`;
  } else if (currentHour < 18) {
    greeting = `Good Afternoon, ${loggedInName}. Hope you're having a good day!`;
  } else if (currentHour < 22) {
    greeting = `Good Evening, ${loggedInName}. Hope you're having a good night!`;
  } else if (currentHour < 24) {
    greeting = `You're up late, ${loggedInName}. Can't sleep?`;
  } else {
    greeting = `Shouldn't you be in bed, ${loggedInName}?`;
  }

  return (
    <StyledGreeting>
      {greeting}
    </StyledGreeting>
  );
};

export default Greeting;
