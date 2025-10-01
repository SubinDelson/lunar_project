import React, { useEffect, useMemo, useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Navbar from '../components/Navbar.jsx'
import TaskFormDialog from '../components/TaskFormDialog.jsx'
import TaskTable from '../components/TaskTable.jsx'
import api from '../api/axios'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('All')

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks
    return tasks.filter(t => t.status === filter)
  }, [tasks, filter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleEdit = (task) => {
    setEditing(task)
    setDialogOpen(true)
  }

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return
    try {
      await api.delete(`/tasks/${task.id}`)
      setTasks(prev => prev.filter(t => t.id !== task.id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  const handleSave = async (form) => {
    try {
      if (editing) {
        const { data } = await api.put(`/tasks/${editing.id}`, form)
        setTasks(prev => prev.map(t => t.id === editing.id ? data : t))
      } else {
        const { data } = await api.post('/tasks', form)
        setTasks(prev => [data, ...prev])
      }
      setDialogOpen(false)
    } catch (err) {
      alert(err?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Your Tasks</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Filter by status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <Button variant="contained" onClick={handleAdd}>Add Task</Button>
            </Stack>
          </Stack>
        </Paper>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TaskTable tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </Container>

      <TaskFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />
    </Box>
  )
}
