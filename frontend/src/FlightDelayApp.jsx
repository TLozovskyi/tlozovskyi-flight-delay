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
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TopStats from './TopStats';

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
  const [busiestAirport, setBusiestAirport] = useState(null);
  const [airportsDialogOpen, setAirportsDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [airportsList, setAirportsList] = useState([]);
  const [airportsListLoading, setAirportsListLoading] = useState(false);

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

        // Best Airport Today (lowest delay chance)
        const bestRes = await fetch(`${API_BASE}/best_performers?top_n=1`);
        let bestAirportName = null;
        if (bestRes.ok) {
          const best = await bestRes.json();
          if (best.length > 0) {
            setBestAirport(best[0]);
            bestAirportName = best[0].airport_name;
            const found = data.find(a => a.name === bestAirportName);
            if (found) {
              const predictRes = await fetch(
                `${API_BASE}/predict?day_of_week=${todayInt}&airport_id=${found.code}`
              );
              if (predictRes.ok) {
                const winnerResult = await predictRes.json();
                setTodaysWinner({
                  ...winnerResult,
                  airport_name: bestAirportName
                });
              }
            }
          }
        }

        // Busiest (highest delay chance) Airport Today
        // Use most delayed route's destination airport as the busiest
        const delayedRes = await fetch(`${API_BASE}/most_delayed_routes?top_n=1`);
        if (delayedRes.ok) {
          const delayed = await delayedRes.json();
          if (delayed.length > 0) {
            setBusiestAirport({
              airport_name: delayed[0].DestAirportName,
              delay_chance: delayed[0].delay_chance
            });
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

  // Handler to fetch airports on demand
  const handleShowAirports = async () => {
    setAirportsDialogOpen(true);
    setAirportsListLoading(true);
    try {
      const res = await fetch(`${API_BASE}/airports`);
      if (!res.ok) throw new Error('Failed to fetch airports');
      const data = await res.json();
      setAirportsList(data);
    } catch {
      setAirportsList([]);
    } finally {
      setAirportsListLoading(false);
    }
  };

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
        <TopStats
          bestAirport={bestAirport}
          busiestAirport={busiestAirport}
          airportsLoading={airportsLoading}
        />

        {/* Only show the predictor card, remove tabs and other sections */}
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          {/* Predictor card code here */}
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
