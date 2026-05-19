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
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

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

interface CustomTableProps {
  columns: Column[]
  data: RowData[]
  actions?: Action[]
  onActionClick: (action: Action, row: any) => void
  pagination?: { rowsPerPage?: number; rowsPerPageOptions?: number[] }
  isDeletingId?: string | null
  isLoading?: boolean
  searchPlaceholder?: string
  hideSearch?: boolean
}

const formatCell = (value: any, field: string): string => {
  if (value === undefined || value === null) return "-"
  if (typeof value === "boolean") return value ? "Sí" : "No"
  if (field === "approvalStatus") {
    const map: Record<string, string> = { APPROVED: "Aprobado", PENDING: "Pendiente", REJECTED: "Rechazado" }
    return map[value] ?? value
  }
  if (field === "role" && Array.isArray(value)) return value.join(", ")
  return String(value)
}

const getNestedValue = (row: RowData, field: string) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".")
    return row[parent]?.[child]
  }
  return row[field]
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  actions,
  onActionClick,
  pagination,
  isDeletingId = null,
  isLoading = false,
  searchPlaceholder = "Buscar...",
  hideSearch = false,
}) => {
  const [tableData, setTableData] = useState<RowData[]>(Array.isArray(data) ? data : [])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.rowsPerPage ?? 10)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setTableData(Array.isArray(data) ? data : [])
    setPage(0)
  }, [data])

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData
    const term = searchTerm.trim().toLowerCase()
    return tableData.filter((row) =>
      columns.some((col) => {
        const raw = getNestedValue(row, col.field)
        return formatCell(raw, col.field).toLowerCase().includes(term)
      })
    )
  }, [searchTerm, tableData, columns])

  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData

  const isProcessing = isLoading || isDeletingId !== null

  return (
    <Box>
      {!hideSearch && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
            disabled={isProcessing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
        </Box>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 480, overflow: "auto", borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align ?? "left"}
                  sx={{ fontWeight: 700, bgcolor: "#A81109", color: "#F9F7F2", whiteSpace: "nowrap" }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#A81109", color: "#F9F7F2" }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  {searchTerm ? `Sin resultados para "${searchTerm}"` : "Sin datos"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => {
                const deleting = isDeletingId === row.id
                return (
                  <TableRow
                    key={idx}
                    sx={{ bgcolor: idx % 2 === 0 ? "#F9F7F2" : "#FFFFFF", opacity: deleting ? 0.5 : 1 }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.field} align={col.align ?? "left"} sx={{ fontSize: "0.8rem" }}>
                        {formatCell(getNestedValue(row, col.field), col.field)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="center">
                        {deleting ? (
                          <CircularProgress size={20} sx={{ color: "secondary.main" }} />
                        ) : (
                          actions.map((action, i) => (
                            <Tooltip key={i} title={action.tooltip} arrow>
                              <IconButton
                                color={action.color ?? "default"}
                                size="small"
                                onClick={() => onActionClick(action, row)}
                                disabled={isProcessing}
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
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions ?? [10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          disabled={isProcessing}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}
    </Box>
  )
}

export default CustomTable
