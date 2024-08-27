import React, { useState, ChangeEvent } from 'react';
import { Grid, Typography, List, ListItemText, Button, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { DealerData, InventoryData } from './model'; // Import the interfaces

interface InventorySectionProps {
  dealer: DealerData;
}

const InventorySection: React.FC<InventorySectionProps> = ({ dealer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryData>(dealer.inventoryData);
  const [originalData, setOriginalData] = useState<InventoryData>(dealer.inventoryData);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setOriginalData(inventoryData); // Save original data before editing
    }
  };

  const handleSave = () => {
    // Logic to save inventory data (e.g., API call)
    setIsEditing(false);
  };

  const handleUndo = () => {
    setInventoryData(originalData); // Restore original data
   // setIsEditing(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInventoryData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  const renderInventoryField = (
    quarter: string,
    type: 'NewInventory' | 'UsedInventory',
    descriptionKey: keyof InventoryData
  ) => (
    <ListItemText
      key={quarter}
      primary={inventoryData[descriptionKey]}
      secondary={
        isEditing ? (
          <TextField
            name={`${quarter}${type}`}
            value={inventoryData[`${quarter}${type}` as keyof InventoryData]}
            onChange={handleChange}
            type="number"
            size="small"
            
          />
        ) : (
          inventoryData[`${quarter}${type}` as keyof InventoryData]
        )
      }
    />
  );

  const renderInventoryGrid = (item: keyof InventoryData, label: string) => (
    <Grid item xs={4} key={item}>
      <Typography variant="h6" align="center">
        {label}
      </Typography>
      <List>
        <ListItemText
          primary={inventoryData.annualDescription}
          secondary={
            isEditing ? (
              <TextField
                name={item}
                value={inventoryData[item]}
                onChange={handleChange}
                type="number"
                size="small"
                fullWidth
              />
            ) : (
              inventoryData[item]
            )
          }
        />
      </List>
    </Grid>
  );

  return (
    < >
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" align="center" sx={{ flexGrow: 1 }}>
          Inventory
        </Typography>
        <IconButton onClick={toggleEdit} color="primary">
           <EditIcon />
        </IconButton>
      </Grid>

      <Typography variant="h6" align="center">New Inventory</Typography>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {['q1', 'q2', 'q3', 'q4'].map((quarter) =>
          renderInventoryField(quarter, 'NewInventory', `${quarter}Description` as keyof InventoryData)
        )}
      </List>

      <Typography variant="h6" align="center">Used Inventory</Typography>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {['q1', 'q2', 'q3', 'q4'].map((quarter) =>
          renderInventoryField(quarter, 'UsedInventory', `${quarter}Description` as keyof InventoryData)
        )}
      </List>

      <Grid container spacing={2}>
        {[
          { key: 'demoVehicles', label: 'DEMO VEHICLES' },
          { key: 'companyOwnedVehicles', label: 'COMPANY OWNED VEHICLES' },
          { key: 'shopRentals', label: 'SHOP RENTALS' },
        ].map((item) => renderInventoryGrid(item.key as keyof InventoryData, item.label))}
      </Grid>

      {isEditing && (
        <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleUndo}>
              Undo
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default InventorySection;
