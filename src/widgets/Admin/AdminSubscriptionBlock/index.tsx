import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { api, ApiError } from '../../../shared/api';

export default function AdminSubscriptionBlock() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBlock = async () => {
    setError('');
    setSuccess('');
    const id = Number(subscriptionId);
    if (!Number.isInteger(id) || id <= 0) {
      setError('Subscription ID must be a positive integer');
      return;
    }
    setPending(true);
    try {
      const result = await api.subscriptions.block(id, reason || undefined);
      setSuccess(
        `Subscription #${result.id} blocked. New status: "${result.status}"`,
      );
      setSubscriptionId('');
      setReason('');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to block subscription');
    } finally {
      setPending(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }} data-testid="admin-block-panel">
      <Typography variant="h6" gutterBottom>
        Block subscription
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Set a subscription to BLOCKED status. Auto-renew is disabled.
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Subscription ID"
          value={subscriptionId}
          onChange={(e) => setSubscriptionId(e.target.value)}
          type="number"
          required
          inputProps={{ 'data-testid': 'admin-block-id' }}
        />
        <TextField
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          inputProps={{ 'data-testid': 'admin-block-reason' }}
          fullWidth
        />

        {error && (
          <Alert severity="error" data-testid="admin-block-error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" data-testid="admin-block-success">
            {success}
          </Alert>
        )}

        <Box>
          <Button
            variant="contained"
            color="warning"
            onClick={handleBlock}
            disabled={pending || !subscriptionId.trim()}
            data-testid="admin-block-submit"
          >
            {pending ? <CircularProgress size={20} /> : 'Block subscription'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
