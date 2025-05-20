import React from 'react';
import {
  Card, Typography, Box, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Paper, Table, TableBody, TableCell, TableRow, Fade
} from '@mui/material';

export default function PredictorTab({
  day, setDay, airport, setAirport, airports, result, loading, error, daysOfWeek
}) {
  return (
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
  );
}

const cellStyle = {
  fontSize: 16,
  background: '#fafbfc',
  borderBottom: '1px solid #eee',
  textAlign: 'left',
  padding: '12px 14px'
};
