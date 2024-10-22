// App.tsx

import React from 'react';
import CustomTable from './CustomTable';

const columns = [
  { id: 'name', label: 'Name', minWidth: 100, sortable: true, filterable: true },
  { id: 'age', label: 'Age', minWidth: 50, sortable: true },
  { id: 'email', label: 'Email', minWidth: 150, filterable: true },
  {
    id: 'balance',
    label: 'Balance',
    minWidth: 100,
    render: (value: number) => `$${value.toFixed(2)}`,
    sortable:true
  },
];

const data: any[] = [
  // { name: 'Alice', age: 25, email: 'alice@example.com', balance: 1000 },
  // { name: 'Jack', age: 30, email: 'bob@example.com', balance: 2000 },
  // { name: 'Charlie', age: 35, email: 'charlie@example.com', balance: 3000 },
];

const App: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <CustomTable columns={columns} data={data} />
  </div>
);

export default App;


// CustomTable.tsx

import React, { useState, useMemo, ChangeEvent, ReactNode } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, Paper, TextField, Typography
} from '@mui/material';

type Order = 'asc' | 'desc';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any) => ReactNode;
}

interface CustomTableProps<T> {
  columns: Column[];
  data: T[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  enablePagination?: boolean;
}

const CustomTable = <T,>({
  columns,
  data,
  pageSizeOptions = [5, 10, 25],
  initialPageSize = 5,
  enablePagination = true,
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters({ ...filters, [columnId]: value });
  };

  const sortedData = useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[orderBy as keyof T];
      const bValue = b[orderBy as keyof T];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        const cellValue = row[key as keyof T];
        const stringValue = cellValue !== null && cellValue !== undefined
          ? String(cellValue)
          : ''; // Safe conversion

        return stringValue.toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [filters, sortedData]);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = enablePagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData;

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                  {column.filterable && (
                    <TextField
                      variant="standard"
                      size="small"
                      placeholder={`Filter ${column.label}`}
                      onChange={(e) => handleFilterChange(column.id, e.target.value)}
                      fullWidth
                      margin="dense"
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render
                        ? column.render(row[column.id as keyof T])
                        : (row[column.id as keyof T] as unknown as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body1">No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default CustomTable;
