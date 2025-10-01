import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await register(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom>Create Account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" value={form.email} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={handleChange} />
          <Button fullWidth sx={{ mt: 2 }} variant="contained" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  )
}
