// Stunning UI using Material UI (MUI) components and theming
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Fade
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const cache = {};
const API_BASE = 'http://127.0.0.1:8000';

function getTodayDayOfWeek() {
  const jsDay = new Date().getDay();
  return daysOfWeek[(jsDay + 6) % 7];
}

const theme = createTheme({
  palette: {
    primary: { main: '#00509e' },
    secondary: { main: '#388e3c' },
    background: { default: '#e3f0ff' }
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: 36, letterSpacing: 2 },
    h2: { fontWeight: 700, fontSize: 28, letterSpacing: 1 },
    h3: { fontWeight: 700, fontSize: 22 }
  }
});

export default function FlightDelayApp() {
  const [day, setDay] = useState(getTodayDayOfWeek());
  const [airport, setAirport] = useState('');
  const [airports, setAirports] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [airportsLoading, setAirportsLoading] = useState(true);
  const [error, setError] = useState('');
  const [todaysWinner, setTodaysWinner] = useState(null);
  const [bestAirport, setBestAirport] = useState(null);
  const [mostDelayedRoute, setMostDelayedRoute] = useState(null);

  useEffect(() => {
    async function fetchAirportsAndStats() {
      setAirportsLoading(true);
      setError('');
      try {
        const airportsRes = await fetch(`${API_BASE}/airports`);
        if (!airportsRes.ok) throw new Error('Failed to fetch airports');
        const data = await airportsRes.json();
        setAirports(data.map(a => ({
          code: a.airport_id,
          name: a.airport_name
        })));

        const todayInt = daysOfWeek.indexOf(getTodayDayOfWeek()) + 1;
        const bestRes = await fetch(`${API_BASE}/best_performers?top_n=1`);
        if (bestRes.ok) {
          const best = await bestRes.json();
          if (best.length > 0) {
            setBestAirport(best[0]);
            const winnerAirportName = best[0].airport_name;
            const found = data.find(a => a.name === winnerAirportName);
            if (found) {
              const predictRes = await fetch(
                `${API_BASE}/predict?day_of_week=${todayInt}&airport_id=${found.code}`
              );
              if (predictRes.ok) {
                const winnerResult = await predictRes.json();
                setTodaysWinner({
                  ...winnerResult,
                  airport_name: winnerAirportName
                });
              }
            }
          }
        }

        const delayedRes = await fetch(`${API_BASE}/most_delayed_routes?top_n=1`);
        if (delayedRes.ok) {
          const delayed = await delayedRes.json();
          if (delayed.length > 0) {
            setMostDelayedRoute(delayed[0]);
          }
        }
      } catch (err) {
        setError('Could not load airports or stats.');
      } finally {
        setAirportsLoading(false);
      }
    }
    fetchAirportsAndStats();
  }, []);

  useEffect(() => {
    if (!airport || airportsLoading) return;
    const cacheKey = `${day}-${airport}`;
    if (cache[cacheKey]) {
      setResult(cache[cacheKey]);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    const dayInt = daysOfWeek.indexOf(day) + 1;
    const url = `${API_BASE}/predict?day_of_week=${dayInt}&airport_id=${airport}`;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('API error');
        return response.json();
      })
      .then(data => {
        cache[cacheKey] = data;
        setResult(data);
      })
      .catch(() => setError('Failed to fetch flight delay data.'))
      .finally(() => setLoading(false));
  }, [day, airport, airportsLoading]);

  // Get today's date string
  const todayDateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 4, textAlign: 'center', boxShadow: 2 }}>
          <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: 28, md: 36 } }}>
            <FlightTakeoffIcon sx={{ fontSize: 36, mr: 1, verticalAlign: 'middle' }} />
            Flight Delay Insights
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#cce3fa', fontSize: 18 }}>
            Your real-time US airport delay predictor
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#e3f0ff', fontSize: 16, mt: 1 }}>
            {todayDateStr}
          </Typography>
        </Box>

        {/* Top stats block */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card elevation={4} sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <CardContent>
                  <EmojiEventsIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h3" color="primary" gutterBottom>
                    Best Airport Today
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {bestAirport ? bestAirport.airport_name : <Fade in={airportsLoading}><span>Loading...</span></Fade>}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color: bestAirport && parseFloat(bestAirport.delay_chance) < 10 ? 'green' : '#d32f2f',
                      fontWeight: 600
                    }}
                  >
                    {bestAirport ? bestAirport.delay_chance : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={4} sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <CardContent>
                  <TrendingDownIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h3" color="primary" gutterBottom>
                    Most Delayed Route Today
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {mostDelayedRoute
                      ? <>
                          <FlightTakeoffIcon sx={{ fontSize: 22, mr: 1, color: '#00509e' }} />
                          {mostDelayedRoute.OriginAirportName}
                          <span style={{ margin: '0 8px', color: '#888' }}>→</span>
                          <FlightLandIcon sx={{ fontSize: 22, mr: 1, color: '#d32f2f' }} />
                          {mostDelayedRoute.DestAirportName}
                        </>
                      : <Fade in={airportsLoading}><span>Loading...</span></Fade>}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color: mostDelayedRoute && parseFloat(mostDelayedRoute.delay_chance) < 10 ? 'green' : '#d32f2f',
                      fontWeight: 600
                    }}
                  >
                    {mostDelayedRoute ? mostDelayedRoute.delay_chance : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Main predictor card */}
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Card elevation={6} sx={{ borderRadius: 4, p: 4, mb: 4 }}>
            <Typography variant="h2" align="center" color="primary" sx={{ mb: 3 }}>
              Predict my flight
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="day-label">Day of the week</InputLabel>
                <Select
                  labelId="day-label"
                  value={day}
                  label="Day of the week"
                  onChange={e => setDay(e.target.value)}
                  sx={{ borderRadius: 2, fontSize: 16 }}
                >
                  {daysOfWeek.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="airport-label">Airport</InputLabel>
                <Select
                  labelId="airport-label"
                  value={airport}
                  label="Airport"
                  onChange={e => setAirport(e.target.value)}
                  sx={{ borderRadius: 2, fontSize: 16 }}
                >
                  <MenuItem value="">Select airport...</MenuItem>
                  {airports.map(a => (
                    <MenuItem key={a.code} value={a.code}>{a.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {error && <Typography color="error" align="center" sx={{ mt: 3, fontWeight: 600 }}>{error}</Typography>}
            {loading && <Box sx={{ textAlign: 'center', mt: 3 }}><CircularProgress color="primary" /></Box>}
            {result && (
              <Fade in={!!result}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h3" align="center" color="secondary" sx={{ mb: 2, fontWeight: 700 }}>
                    Prediction Result
                  </Typography>
                  <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={cellStyle}>Airport</TableCell>
                          <TableCell sx={cellStyle}>{result.airport_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={cellStyle}>Day of Week</TableCell>
                          <TableCell sx={cellStyle}>{daysOfWeek[(result.day_of_week - 1) % 7]}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={cellStyle}>Delay Chance</TableCell>
                          <TableCell sx={{
                            ...cellStyle,
                            fontWeight: 'bold',
                            color: (parseFloat(result.delay_chance) < 10) ? 'green' : '#d32f2f',
                            fontSize: 20
                          }}>
                            {result.delay_chance}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={cellStyle}>Confidence</TableCell>
                          <TableCell sx={cellStyle}>{result.confidence_percent}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Card>
        </Container>

        {/* Today's Winner */}
        {todaysWinner && (
          <Container maxWidth="sm" sx={{ mb: 6 }}>
            <Fade in={!!todaysWinner}>
              <Card elevation={3} sx={{
                borderRadius: 4,
                background: '#e8f5e9',
                mt: 4,
                p: 3,
                boxShadow: '0 1px 4px #0001'
              }}>
                <Typography variant="h3" align="center" color="secondary" sx={{ mb: 2, fontWeight: 700 }}>
                  Today's Winner
                </Typography>
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={cellStyle}>Airport</TableCell>
                        <TableCell sx={cellStyle}>{todaysWinner.airport_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={cellStyle}>Day of Week</TableCell>
                        <TableCell sx={cellStyle}>{daysOfWeek[(todaysWinner.day_of_week - 1) % 7]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={cellStyle}>Delay Chance</TableCell>
                        <TableCell sx={{
                          ...cellStyle,
                          fontWeight: 'bold',
                          color: (parseFloat(todaysWinner.delay_chance) < 10) ? 'green' : '#d32f2f',
                          fontSize: 18
                        }}>
                          {todaysWinner.delay_chance}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={cellStyle}>Confidence</TableCell>
                        <TableCell sx={cellStyle}>{todaysWinner.confidence_percent}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Card>
            </Fade>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
}

const cellStyle = {
  fontSize: 16,
  background: '#fafbfc',
  borderBottom: '1px solid #eee',
  textAlign: 'left',
  padding: '12px 14px'
};
