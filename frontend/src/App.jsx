import React, { useState } from 'react';
import FlightDelayApp from './FlightDelayApp';

function Section({ title, children }) {
  return (
    <section style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`);
      if (!res.ok) throw new Error('API error');
      setData(await res.json());
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fetchData };
}

export default function App() {
  const airportsApi = useApi('/airports');
  const delayedApi = useApi('/most_delayed_routes?top_n=10');
  const bestApi = useApi('/best_performers?top_n=5');
  const airlinesApi = useApi('/airline_delays');

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Flight Delay Dashboard</h1>
      <Section title="Predict Flight Delay">
        <FlightDelayApp />
      </Section>
      <Section title="Airports">
        <button onClick={airportsApi.fetchData}>Show Airports</button>
        {airportsApi.loading && <div>Loading...</div>}
        {airportsApi.error && <div style={{ color: 'red' }}>{airportsApi.error}</div>}
        {airportsApi.data && (
          <ul>
            {airportsApi.data.map(a => (
              <li key={a.airport_id}>{a.airport_name} ({a.airport_id})</li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Most Delayed Routes">
        <button onClick={delayedApi.fetchData}>Show Most Delayed Routes</button>
        {delayedApi.loading && <div>Loading...</div>}
        {delayedApi.error && <div style={{ color: 'red' }}>{delayedApi.error}</div>}
        {delayedApi.data && (
          <table>
            <thead>
              <tr>
                <th>Origin</th>
                <th>Destination</th>
                <th>Delay Chance</th>
              </tr>
            </thead>
            <tbody>
              {delayedApi.data.map((r, i) => (
                <tr key={i}>
                  <td>{r.OriginAirportName} ({r.OriginAirportID})</td>
                  <td>{r.DestAirportName} ({r.DestAirportID})</td>
                  <td>{r.delay_chance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
      <Section title="Best On-Time Performers">
        <button onClick={bestApi.fetchData}>Show Best Performers</button>
        {bestApi.loading && <div>Loading...</div>}
        {bestApi.error && <div style={{ color: 'red' }}>{bestApi.error}</div>}
        {bestApi.data && (
          <table>
            <thead>
              <tr>
                <th>Airport</th>
                <th>Delay Chance</th>
              </tr>
            </thead>
            <tbody>
              {bestApi.data.map((r, i) => {
                // Extract numeric value for coloring
                let percent = 0;
                if (typeof r.delay_chance === 'string' && r.delay_chance.endsWith('%')) {
                  percent = parseFloat(r.delay_chance.replace('%', ''));
                }
                return (
                  <tr key={i}>
                    <td>{r.airport_name}</td>
                    <td style={{
                      color: percent < 10 ? 'green' : undefined,
                      fontWeight: percent < 10 ? 'bold' : undefined
                    }}>
                      {r.delay_chance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Section>
      <Section title="Airline Delays">
        <button onClick={airlinesApi.fetchData}>Show Airline Delays</button>
        {airlinesApi.loading && <div>Loading...</div>}
        {airlinesApi.error && <div style={{ color: 'red' }}>{airlinesApi.error}</div>}
        {airlinesApi.data && (
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Delay Chance</th>
              </tr>
            </thead>
            <tbody>
              {airlinesApi.data.map((r, i) => (
                <tr key={i}>
                  <td>{r.Airline || r.airline || r.airline_id}</td>
                  <td>{r.delay_chance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}