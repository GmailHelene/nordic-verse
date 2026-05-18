import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.get('/profiles', (req, res) => {
  res.json({ message: 'Profiles endpoint is ready.' });
});

app.get('/maps', (req, res) => {
  res.json({ message: 'Maps endpoint is ready.' });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
