import React, { useState, useCallback } from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, MenuItem, Button, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import { IFacilityUpdates } from './model';

interface FacilityUpdatesTableProps {
  facilityUpdates: IFacilityUpdates[];
}

const FacilityUpdatesTable: React.FC<FacilityUpdatesTableProps> = ({ facilityUpdates }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [facilityList, setFacilityList] = useState(facilityUpdates);
  const [originalFacilityList, setOriginalFacilityList] = useState(JSON.parse(JSON.stringify(facilityUpdates))); // Deep copy of the original list
  const [newFacilityType, setNewFacilityType] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const allFacilityTypes = [
    'Lock Boxes',
    'Security or Surveillance',
    'Mailing or Billing Info',
    'Floor Plan Source',
    'Loss Prevention',
    'Other Information',
    'None'
  ];

  // const filteredFacilityTypes = allFacilityTypes.filter(
  //   (type) => !facilityList.some((facility) => facility.type === type)
  // );
  const filteredFacilityTypes = allFacilityTypes.filter(
    (type) => !facilityList.some((facility) => facility.label === type)
  );
  const toggleEdit = useCallback(() => {
    if (!isEditing) {
      setOriginalFacilityList(JSON.parse(JSON.stringify(facilityList))); // Deep copy before editing
    }
    setIsEditing(true);
  }, [isEditing, facilityList]);

  const handleDescriptionChange = useCallback((index: number, newDesc: string) => {
    setFacilityList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index].description = newDesc;
      return updatedList;
    });
  }, []);

  const handleSave = useCallback(() => {
    setOriginalFacilityList(JSON.parse(JSON.stringify(facilityList))); // Save current edits as the new original with deep copy
    setIsEditing(false);
    setSnackbarOpen(true); // Show snackbar on save
  }, [facilityList]);

  const handleAddFacility = useCallback(() => {
    if (newFacilityType && newDescription) {
      const newFacility = {
        type: newFacilityType.toLowerCase().replace(/ /g, ''),
        label: newFacilityType,
        description: newDescription,
      };

      setFacilityList((prevList) => [...prevList, newFacility]);
      setNewFacilityType('');
      setNewDescription('');
    }
  }, [newFacilityType, newDescription]);

  const handleUndo = useCallback(() => {
    // Reset to the original list using deep copy
    setFacilityList(JSON.parse(JSON.stringify(originalFacilityList)));
    // Clear new facility inputs
    setNewFacilityType('');
    setNewDescription('');
    console.log("Facility List after Undo:", facilityList);
    // Stay in edit mode
  }, [originalFacilityList]);

  return (
    <Grid container>
      <Grid item xs={12} container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Facility Updates</Typography>
        <IconButton onClick={toggleEdit}>
          {isEditing ? <SaveIcon onClick={handleSave}/> : <EditIcon />}
        </IconButton>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilityList.map((facility, index) => (
              <TableRow key={facility.type}>
                <TableCell>{facility.label}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={facility.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <Typography
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 200,
                        cursor: 'pointer'
                      }}
                      onClick={() => setIsEditing(true)}
                    >
                      {facility.description}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEditing && (
        <Grid container spacing={2} mt={2}>
                   <Grid item xs={4}>
            {filteredFacilityTypes.length > 0 ? (
              <TextField
                select
                label="Facility Type"
                value={newFacilityType}
                onChange={(e) => setNewFacilityType(e.target.value)}
                fullWidth
              >
                {filteredFacilityTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography>No facility types available to add</Typography>
            )}
          </Grid>


          <Grid item xs={4}>
            <TextField
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFacility}
              disabled={!newFacilityType || !newDescription || filteredFacilityTypes.length === 0}
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={2}>
            <Button variant="contained" color="secondary" onClick={handleUndo}>
              <UndoIcon /> Undo
            </Button>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Changes saved successfully"
      />
    </Grid>
  );
};

export default FacilityUpdatesTable;
