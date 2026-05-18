import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { api, ApiError } from '../../shared/api';
import { ComplaintResponse } from '../../shared/types/api';

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
  new: 'warning',
  in_review: 'default',
  resolved: 'success',
  rejected: 'error',
};

export default function MyComplaints() {
  const [items, setItems] = useState<ComplaintResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.complaints
      .getMy()
      .then((data) => {
        setItems(data);
        setError('');
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Failed to load complaints');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  if (items.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ p: 2 }} data-testid="complaints-empty">
        You have not filed any complaints yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 800, mx: 'auto' }} data-testid="complaints-list">
      {items.map((c) => (
        <Paper key={c.id} sx={{ p: 2 }} data-testid="complaint-row">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">
              #{c.id} · publication {c.publication_id}
            </Typography>
            <Chip
              label={c.status}
              color={STATUS_COLOR[c.status] ?? 'default'}
              size="small"
            />
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Reason:</strong> {c.reason}
          </Typography>
          {c.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {c.description}
            </Typography>
          )}
          {c.resolution_note && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
              Resolution: {c.resolution_note}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
