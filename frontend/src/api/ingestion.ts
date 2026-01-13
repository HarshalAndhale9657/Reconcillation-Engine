import { INGESTION_BASE_URL } from './config';

export const startIngestion = async () => {
  const res = await fetch(`${INGESTION_BASE_URL}/ingestion/start`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to start ingestion');
  return res.json();
};

export const stopIngestion = async () => {
  const res = await fetch(`${INGESTION_BASE_URL}/ingestion/stop`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to stop ingestion');
  return res.json();
};

export const getIngestionStatus = async () => {
  const res = await fetch(`${INGESTION_BASE_URL}/ingestion/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};
