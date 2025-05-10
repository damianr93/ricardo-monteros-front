import React, { useState, useMemo, useEffect } from "react";
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
} from "@mui/material";

export interface Column {
  field: string;
  headerName: string;
  align?: "left" | "right" | "center";
}

interface RowData {
  [key: string]: any;
}

export interface Action {
  name?: string;
  color?: "default" | "primary" | "secondary" | "inherit";
  icon: React.ReactNode;
  tooltip: string
}

interface PaginationProps {
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
}

interface CustomTableProps {
  columns: Column[];
  data: RowData[];
  actions?: Action[];
  onActionClick: (action: Action, row: any) => void;
  pagination?: PaginationProps;
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, actions, onActionClick, pagination }) => {
  const [tableData, setTableData] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.rowsPerPage || 7);
  const [searchColumn, setSearchColumn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchColumn || !searchTerm) return tableData;
    return tableData.filter((row) => {
      let value = "";
      if (searchColumn.includes(".")) {
        const [parent, child] = searchColumn.split(".");
        value = row[parent] && row[parent][child] ? row[parent][child] : "";
      } else {
        value = row[searchColumn] || "";
      }
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchColumn, searchTerm, tableData]);

  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleConfirmChanges = () => {
    console.log("Nuevos choferes:", tableData);
    setIsModified(false);
  };

  // Helper function to format cell values
  const formatCellValue = (value: any): string => {
    if (value === undefined || value === null) {
      return "-";
    }
    
    // Handle boolean values - convert to "Si" or "No"
    if (typeof value === "boolean") {
      return value ? "Si" : "No";
    }
    
    return String(value);
  };

  return (
    <Box>
      {/* Filtros de búsqueda */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          p: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          select
          label="Buscar por"
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {columns.map((column) => (
            <MenuItem key={column.field} value={column.field}>
              {column.headerName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Valor a buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {/* Botón de confirmar cambios */}
      {isModified && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end", pr: 2 }}>
          <Button variant="contained" color="primary" onClick={handleConfirmChanges}>
            Confirmar cambios
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "center"}
                  sx={{ fontWeight: "bold", backgroundColor: "rgba(110, 40, 99, 0.83)", color: "rgba(255, 250, 254, 0.83)" }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {actions && <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "rgba(110, 40, 99, 0.83)",
                  color: "rgba(255, 250, 254, 0.83)"
                }}>
                Acciones
              </TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIndex) => {
              const isEvenRow = rowIndex % 2 === 0;
              const rowStyle = {
                backgroundColor: isEvenRow ? "#f5f5f5" : "#ffffff", // Alterna entre gris claro y blanco
              };

              return (
                <TableRow key={rowIndex} sx={rowStyle}>
                  {columns.map((column) => {
                    let value;
                    
                    if (column.field.includes(".")) {
                      const [parent, child] = column.field.split(".");
                      value = row[parent] && row[parent][child] !== undefined 
                        ? row[parent][child] 
                        : null;
                    } else {
                      value = row[column.field] !== undefined ? row[column.field] : null;
                    }
                    
                    // Format the value (including boolean handling)
                    const displayValue = formatCellValue(value);

                    return (
                      <TableCell key={`${rowIndex}-${column.field}`} align={column.align || "left"}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                  {actions && (
                    <TableCell
                      align="center"
                    >
                      {actions.map((action, actionIndex) => (
                        <Tooltip key={actionIndex} title={action.tooltip || ""} arrow>
                          <IconButton
                            color={action.color || "default"}
                            size="small"
                            onClick={() => onActionClick(action, row)}
                            sx={{ m: 0.5 }}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              );
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
        />
      )}
    </Box>
  );
};

export default CustomTable;