// File: src/components/CustomTable.tsx
import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material"

export interface Column {
  field: string
  headerName: string
  align?: "left" | "right" | "center"
}

interface RowData {
  [key: string]: any
}

export interface Action {
  name?: string
  color?: "default" | "primary" | "secondary" | "inherit"
  icon: React.ReactNode
  tooltip: string
}

interface PaginationProps {
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
}

interface CustomTableProps {
  columns: Column[]
  data: RowData[]
  actions?: Action[]
  onActionClick: (action: Action, row: any) => void
  pagination?: PaginationProps
  isDeletingId?: string | null
  isLoading?: boolean
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  actions,
  onActionClick,
  pagination,
  isDeletingId = null,
  isLoading = false,
}) => {
  const [tableData, setTableData] = useState(Array.isArray(data) ? data : [])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.rowsPerPage || 7)
  const [searchColumn, setSearchColumn] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    setTableData(Array.isArray(data) ? data : [])
  }, [data])

  const formatCell = (value: any, field: string) => {
    if (value === undefined || value === null) return "-"
    if (typeof value === "boolean") return value ? "Si" : "No"
    
    // Formateo especial para campos específicos
    if (field === 'approvalStatus') {
      switch (value) {
        case 'APPROVED':
          return 'Aprobado'
        case 'PENDING':
          return 'Pendiente'
        case 'REJECTED':
          return 'Rechazado'
        default:
          return value
      }
    }
    
    if (field === 'role' && Array.isArray(value)) {
      return value.join(', ')
    }
    
    return String(value)
  }

  const filteredData = useMemo(() => {
    // Asegurar que tableData sea siempre un array
    const dataArray = Array.isArray(tableData) ? tableData : []
    
    if (!searchColumn || !searchTerm) return dataArray
    return dataArray.filter((row) => {
      let value = ""
      if (searchColumn.includes(".")) {
        const [parent, child] = searchColumn.split(".")
        value = row[parent] && row[parent][child] !== undefined ? row[parent][child] : ""
      } else {
        value = row[searchColumn] !== undefined ? row[searchColumn] : ""
      }
      
      // Buscar tanto en el valor original como en el formateado
      const originalValue = String(value).toLowerCase()
      const formattedValue = formatCell(value, searchColumn).toLowerCase()
      const searchTermLower = searchTerm.toLowerCase()
      
      return originalValue.includes(searchTermLower) || formattedValue.includes(searchTermLower)
    })
  }, [searchColumn, searchTerm, tableData])

  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0)
  }

  const handleConfirmChanges = () => {
    setIsModified(false)
  }

  const isProcessing = isLoading || isDeletingId !== null

  return (
    <Box>
      {/* Búsqueda */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, borderRadius: 2, bg: 'secondary.lightest' }}>
        <TextField
          select
          label="Buscar por"
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          sx={{ minWidth: 200 }}
          disabled={isProcessing}
        >
          {columns.map(col => (
            <MenuItem key={col.field} value={col.field}>{col.headerName}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Valor a buscar"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          disabled={isProcessing}
        />
      </Box>
      {/* Confirmar */}
      {isModified && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            onClick={handleConfirmChanges}
            disabled={isProcessing}
          >
            Confirmar cambios
          </Button>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.field}
                  align={col.align || 'center'}
                  sx={{ fontWeight: 'bold', bgcolor: '#A81109', color: '#F9F7F2' }}
                >{col.headerName}</TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#A81109', color: '#F9F7F2' }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, idx) => {
              const isEven = idx % 2 === 0
              const rowBg = isEven ? '#F9F7F2' : '#FFFFFF'
              const deleting = isDeletingId === row.id
              return (
                <TableRow key={idx} sx={{ bgcolor: rowBg, opacity: deleting ? 0.5 : 1 }}>
                  {columns.map(col => {
                    let val = col.field.includes('.')
                      ? row[col.field.split('.')[0]]?.[col.field.split('.')[1]]
                      : row[col.field]
                    return (
                      <TableCell key={col.field} align={col.align || 'left'}>
                        {formatCell(val, col.field)}
                      </TableCell>
                    )
                  })}
                  {actions && (
                    <TableCell align="center">
                      {deleting ? (
                        <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
                      ) : (
                        actions.map((action, i) => (
                          <Tooltip key={i} title={action.tooltip} arrow>
                            <IconButton
                              color={action.color || 'default'}
                              size="small"
                              onClick={() => onActionClick(action, row)}
                              disabled={isProcessing}
                              sx={{ m: 0.5 }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions || [7, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={isProcessing}
        />
      )}
    </Box>
  )
}

export default CustomTable