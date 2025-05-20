import React from 'react';
import {
  Card, Typography, Button, Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemText, CircularProgress
} from '@mui/material';

export default function AirportsTab({
  airportsDialogOpen,
  setAirportsDialogOpen,
  handleShowAirports,
  airportsList,
  airportsListLoading
}) {
  return (
    <Card elevation={6} sx={{ borderRadius: 4, p: 4, mb: 4, textAlign: 'center' }}>
      <Typography variant="h2" align="center" color="primary" sx={{ mb: 3 }}>
        Airports
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowAirports}
        sx={{ mb: 2 }}
      >
        Show Airports List
      </Button>
      <Dialog open={airportsDialogOpen} onClose={() => setAirportsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>All Airports</DialogTitle>
        <DialogContent>
          {airportsListLoading ? (
            <div style={{ textAlign: 'center', margin: '24px 0' }}><CircularProgress /></div>
          ) : (
            <List>
              {airportsList.map(a => (
                <ListItem key={a.airport_id}>
                  <ListItemText primary={a.airport_name} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
