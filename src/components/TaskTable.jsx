import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TaskTable({ tasks, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.title}</TableCell>
              <TableCell sx={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.description}
              </TableCell>
              <TableCell>{new Date(t.due_date).toISOString().slice(0,10)}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(t)} aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(t)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {!tasks.length && (
            <TableRow>
              <TableCell colSpan={5} align="center">No tasks found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
