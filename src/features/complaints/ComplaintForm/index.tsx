import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { api, ApiError } from '../../../shared/api';
import { PublicationResponse } from '../../../shared/types/api';

interface ComplaintFormProps {
  onSuccess?: () => void;
}

export default function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [publicationId, setPublicationId] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.publications
      .list()
      .then(setPublications)
      .catch(() => setError('Failed to load publications'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (typeof publicationId !== 'number') {
      setError('Please select a publication');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.complaints.submit({
        publication_id: publicationId,
        reason: reason.trim(),
        description: description.trim() || undefined,
      });
      setSuccess(`Complaint #${result.id} created with status "${result.status}"`);
      setReason('');
      setDescription('');
      setPublicationId('');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to submit complaint');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      data-testid="complaint-form"
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        File a complaint
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Report an issue with a publication. The administrator will review it.
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          label="Publication"
          value={publicationId}
          onChange={(e) => setPublicationId(Number(e.target.value))}
          required
          fullWidth
          inputProps={{ 'data-testid': 'complaint-publication-select' }}
        >
          {publications.map((pub) => (
            <MenuItem key={pub.id} value={pub.id}>
              {pub.title}
              {pub.publisher ? ` — ${pub.publisher}` : ''}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          inputProps={{ maxLength: 200, 'data-testid': 'complaint-reason' }}
          fullWidth
        />

        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          maxRows={8}
          inputProps={{ maxLength: 2000, 'data-testid': 'complaint-description' }}
          fullWidth
        />

        {error && (
          <Alert severity="error" data-testid="complaint-error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" data-testid="complaint-success">
            {success}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          data-testid="complaint-submit"
        >
          {submitting ? <CircularProgress size={20} /> : 'Submit complaint'}
        </Button>
      </Stack>
    </Box>
  );
}
