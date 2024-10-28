import React, { useState } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Select, MenuItem, InputLabel, FormControl, 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Grid, Typography, IconButton, Alert 
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import SSNInput from './SSNInput'
interface InsuredData {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  taxId: string;
}

interface InsuredProps {
  dialogTitle: string;
  buttonLabel: string;
  onSelectRecord: (data: InsuredData, target: string) => void;
  target: string;
}

const Insured: React.FC<InsuredProps> = ({ dialogTitle, buttonLabel, onSelectRecord, target }) => {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<InsuredData[]>([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ein, setEIN] = useState<string>('');

  const handleEINChange = (value: string) => {
    console.log('Raw EIN sent to backend:', value); // Raw EIN without dashes
    setEIN(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  // Utility to clean input by removing extra spaces and validating allowed characters
  const cleanInput = (input: string) => 
    input.replace(/\s+/g, ' ').trim().replace(/[^a-zA-Z0-9,./\\|\- ]/g, '');

  // Handle paste event to clean input
  const handlePaste = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('Text');
      setter(cleanInput(pastedText));
    };

  const handleSearch = () => {
    if (!validateSearch()) return;

    const mockData: InsuredData[] = [
      { id: '1', type: 'Entity', name: 'John Doe', address: '123 Street', city: 'New York', state: 'NY', zip: '10001', taxId: '123-45-6789' },
      { id: '2', type: 'Sub Lease', name: 'Jane Smith', address: '456 Avenue', city: 'San Francisco', state: 'CA', zip: '94105', taxId: '987-65-4321' }
    ];

    const filteredResults = mockData.filter(item =>
      (id ? item.id === id : true) &&
      (name ? item.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (type ? item.type.toLowerCase() === type.toLowerCase() : true) &&
      (taxId ? item.taxId === taxId : true) &&
      (address ? item.address.toLowerCase().includes(address.toLowerCase()) : true)
    );

    setSearchResults(filteredResults);
  };

  const validateSearch = () => {
    const isIdSearch = !!id;
    const isTypeSelected = !!type;

    if (!id && !name && !taxId && !address) {
      setError('Please enter a search criteria');
      return false;
    }

    if (isIdSearch && !isTypeSelected) {
      setError('Please select an entity type when searching by ID');
      return false;
    }

    const fields = [name, taxId, address].filter(Boolean).length;
    if (fields > 0 && (isIdSearch || isTypeSelected)) {
      setError('Please search using only one field');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSelect = (record: InsuredData) => {
    onSelectRecord(record, target);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <Add />
        <Typography variant="h6">{buttonLabel}</Typography>
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField 
                label="ID" 
                value={id} 
                onChange={(e) => setId(cleanInput(e.target.value))} 
                onPaste={handlePaste(setId)} 
                variant="outlined" 
                margin="dense" 
              />
            </Grid>
            <Grid item xs={4}>
            <SSNInput
        value={ein}
        onChange={handleEINChange}
        helperText="Enter your Business Tax ID (EIN)"
        error={ein.length > 0 && ein.length < 9} // Basic validation
      />
            </Grid>
            <Grid item xs={4}>
              <TextField 
                label="Name" 
                value={name} 
                onChange={(e) => setName(cleanInput(e.target.value))} 
                onPaste={handlePaste(setName)} 
                variant="outlined" 
                margin="dense" 
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="entity">Entity</MenuItem>
                  <MenuItem value="sublease">Sub Lease</MenuItem>
                  <MenuItem value="taxid">Tax ID</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button 
            variant="outlined" 
            startIcon={<Search />} 
            onClick={handleSearch} 
            sx={{ mt: 2 }}
          >
            Search
          </Button>

          {searchResults.length > 0 && (
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleSelect(row)}>
                        <Add />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Insured;
