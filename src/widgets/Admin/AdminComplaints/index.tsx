import { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { api, ApiError } from '../../../shared/api';
import { ComplaintResponse } from '../../../shared/types/api';

const STATUS_OPTIONS = ['new', 'in_review', 'resolved', 'rejected'];
const STATUS_COLOR: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
  new: 'warning',
  in_review: 'default',
  resolved: 'success',
  rejected: 'error',
};

export default function AdminComplaints() {
  const [items, setItems] = useState<ComplaintResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { status: string; note: string }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.complaints.listAll();
      setItems(data);
      const next: Record<number, { status: string; note: string }> = {};
      data.forEach((c) => {
        next[c.id] = { status: c.status, note: c.resolution_note ?? '' };
      });
      setDrafts(next);
      setError('');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setDraft = (id: number, field: 'status' | 'note', value: string) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
  };

  const handleSave = async (id: number) => {
    setPendingId(id);
    try {
      const draft = drafts[id];
      await api.complaints.updateStatus(id, {
        status: draft.status,
        resolution_note: draft.note || undefined,
      });
      await load();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to update complaint');
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 900, mx: 'auto' }} data-testid="admin-complaints">
      <Typography variant="h6">Complaints from users</Typography>

      {error && (
        <Alert severity="error" data-testid="admin-complaints-error">
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Typography color="text.secondary" data-testid="admin-complaints-empty">
          No complaints to review.
        </Typography>
      ) : (
        items.map((c) => (
          <Paper key={c.id} sx={{ p: 2 }} data-testid="admin-complaint-row">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                #{c.id} · user {c.user_id} · publication {c.publication_id}
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

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                select
                label="Status"
                size="small"
                value={drafts[c.id]?.status ?? c.status}
                onChange={(e) => setDraft(c.id, 'status', e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Resolution note"
                size="small"
                value={drafts[c.id]?.note ?? ''}
                onChange={(e) => setDraft(c.id, 'note', e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                disabled={pendingId === c.id}
                onClick={() => handleSave(c.id)}
                data-testid={`admin-complaint-save-${c.id}`}
              >
                {pendingId === c.id ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}
