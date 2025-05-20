import React from 'react';
import { Container, Card, CardContent, Typography, Fade, Box, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';

export default function TodaysStats({ bestAirport, busiestAirport, airportsLoading }) {
  const bestRoute = bestAirport
    ? {
        OriginAirportName: bestAirport.airport_name,
        DestAirportName: bestAirport.airport_name,
        delay_chance: bestAirport.delay_chance
      }
    : null;

  const winnerColor = '#388e3c';
  const looserColor = '#d32f2f';

  const statCard = (icon, label, value, delay, color) => (
    <Card
      elevation={2}
      sx={{
        minWidth: 180,
        maxWidth: 220,
        mx: 'auto',
        borderRadius: 3,
        textAlign: 'center',
        py: 2,
        px: 1.5,
        border: `2px solid ${color}`,
        background: 'linear-gradient(to bottom, #fff, #fafbfc)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: color,
        }
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0.5 }}>
          {icon}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color, fontSize: 16, mb: 0.5, letterSpacing: 0.5 }}
          >
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: color,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 0.5,
          }}
        >
          {delay}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography 
        variant="h2" 
        align="center" 
        color="primary" 
        sx={{ 
          mb: 3,
          fontWeight: 700,
          letterSpacing: 1,
          background: 'linear-gradient(45deg, #003366, #00509e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Today's Stats
      </Typography>
      {/* Winners row: Best Airport & Best Route */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="flex-start" flexWrap="wrap" sx={{ mb: 2 }}>
        {statCard(
          <EmojiEventsIcon sx={{ fontSize: 28, color: winnerColor, mb: 0.5 }} />,
          'Best Airport',
          bestAirport ? bestAirport.airport_name : <Fade in={airportsLoading}><span>Loading...</span></Fade>,
          bestAirport ? bestAirport.delay_chance : '',
          winnerColor
        )}
        {statCard(
          <EmojiEventsIcon sx={{ fontSize: 28, color: winnerColor, mb: 0.5 }} />,
          'Best Route',
          bestRoute ? (
            <span>
              <FlightTakeoffIcon sx={{ fontSize: 18, mr: 0.5, color: '#00509e', verticalAlign: 'middle' }} />
              {bestRoute.OriginAirportName}
              <span style={{ margin: '0 6px', color: '#888' }}>→</span>
              <FlightLandIcon sx={{ fontSize: 18, mr: 0.5, color: winnerColor, verticalAlign: 'middle' }} />
              {bestRoute.DestAirportName}
            </span>
          ) : <Fade in={airportsLoading}><span>Loading...</span></Fade>,
          bestRoute ? bestRoute.delay_chance : '',
          winnerColor
        )}
      </Stack>
      {/* Losers row: Busiest Airport & Most Delayed Route */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="flex-start" flexWrap="wrap">
        {statCard(
          <TrendingDownIcon sx={{ fontSize: 28, color: looserColor, mb: 0.5 }} />,
          'Busiest Airport',
          busiestAirport ? busiestAirport.airport_name : <Fade in={airportsLoading}><span>Loading...</span></Fade>,
          busiestAirport ? busiestAirport.delay_chance : '',
          looserColor
        )}
        {statCard(
          <TrendingDownIcon sx={{ fontSize: 28, color: looserColor, mb: 0.5 }} />,
          'Most Delayed Route',
          mostDelayedRoute ? (
            <span>
              <FlightTakeoffIcon sx={{ fontSize: 18, mr: 0.5, color: '#00509e', verticalAlign: 'middle' }} />
              {mostDelayedRoute.OriginAirportName}
              <span style={{ margin: '0 6px', color: '#888' }}>→</span>
              <FlightLandIcon sx={{ fontSize: 18, mr: 0.5, color: looserColor, verticalAlign: 'middle' }} />
              {mostDelayedRoute.DestAirportName}
            </span>
          ) : <Fade in={airportsLoading}><span>Loading...</span></Fade>,
          mostDelayedRoute ? mostDelayedRoute.delay_chance : '',
          looserColor
        )}
      </Stack>
    </Container>
  );
}
