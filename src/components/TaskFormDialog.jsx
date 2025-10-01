import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

const empty = { title: '', description: '', due_date: '', status: 'Pending' }

export default function TaskFormDialog({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initialData ? { ...initialData } : empty)
    setErrors({})
  }, [initialData, open])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.due_date) e.due_date = 'Due date is required'
    if (form.status !== 'Pending' && form.status !== 'Completed') e.status = 'Invalid status'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSave(form)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form.id ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Due Date"
            name="due_date"
            type="date"
            value={form.due_date?.slice(0, 10) || ''}
            onChange={handleChange}
            error={!!errors.due_date}
            helperText={errors.due_date}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            error={!!errors.status}
            helperText={errors.status}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {form.id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
