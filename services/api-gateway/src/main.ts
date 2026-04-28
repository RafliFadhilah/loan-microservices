import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const LOAN_CORE_URL = process.env.LOAN_CORE_URL || 'http://localhost:3001';
const AUDIT_URL = process.env.AUDIT_URL || 'http://localhost:3010';
const PORT = Number(process.env.PORT || 3000);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', async (_req, res) => {
  try {
    const loan = await axios.get(LOAN_CORE_URL + '/loans/health', { timeout: 2000 }).catch(() => null);
    const audit = await axios.get(AUDIT_URL + '/health', { timeout: 2000 }).catch(() => null);
    res.json({
      status: 'ok',
      services: {
        loan: loan?.data || 'unavailable',
        audit: audit?.data || 'unavailable'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: String(err) });
  }
});

// public API to start loan application
app.post('/api/loans/apply', async (req, res) => {
  const payload = req.body;
  try {
    const r = await axios.post(LOAN_CORE_URL + '/loans/apply', payload, { timeout: 60000 });
    res.json(r.data);
  } catch (err: any) {
    res.status(500).json({ error: err?.toString(), details: err?.response?.data || null });
  }
});

// read audit via audit service
app.get('/api/audit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const r = await axios.get(`${AUDIT_URL}/audit/${encodeURIComponent(id)}`);
    res.json(r.data);
  } catch (err: any) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'not found' });
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log('API Gateway listening on', PORT, 'forwarding to', LOAN_CORE_URL);
});
