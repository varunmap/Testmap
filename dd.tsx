import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Pagination, CircularProgress } from '@mui/material';
import { sampleData,  } from './sampleData';
import {PolicyData} from './Types'
const PolicyDetails: React.FC = () => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Number of items per page

  const handleLocationClick = (index: number) => {
    setSelectedLocationIndex(index);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const selectedPolicy: PolicyData = sampleData[0];
  const locations = selectedPolicy.locations;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocations = locations.slice(startIndex, endIndex);

  const selectedLocation = paginatedLocations[selectedLocationIndex % itemsPerPage];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Dealerships</Typography>
          <List>
            {paginatedLocations.length === 0 ? (
              <ListItem>
                <ListItemText primary="No dealerships available" />
              </ListItem>
            ) : (
              paginatedLocations.map((location, index) => (
                <ListItem
                  key={location.locationInfo.locationId}
                  button
                  onClick={() => handleLocationClick(index + startIndex)}
                  selected={selectedLocationIndex === index + startIndex}
                >
                  <ListItemText primary={location.locationInfo.dealershipName} />
                </ListItem>
              ))
            )}
          </List>
          <Pagination
            count={Math.ceil(locations.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 2 }}
          />
        </Paper>
      </Box>
      <Box sx={{ width: '70%', padding: 2, overflowY: 'auto' }}>
        {selectedLocation ? (
          <>
            <Typography variant="h4">{selectedLocation.locationInfo.dealershipName}</Typography>
            <Typography variant="body1">{selectedLocation.locationInfo.addressLine1}</Typography>
            {selectedLocation.locationInfo.addressLine2 && (
              <Typography variant="body1">{selectedLocation.locationInfo.addressLine2}</Typography>
            )}
            <Typography variant="body1">
              {`${selectedLocation.locationInfo.city}, ${selectedLocation.locationInfo.state} ${selectedLocation.locationInfo.zip}`}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Facility Updates</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(selectedLocation.locationInfo.facilityUpdates).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2 }}>Premium Vehicles</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attribute</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(selectedLocation.premiumVehicles).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2 }}>Manufacturers Allocation</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Manufacturer</TableCell>
                    <TableCell>Allocation (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedLocation.manufacturersAllocation.map((allocation, index) => (
                    <TableRow key={index}>
                      <TableCell>{allocation.name}</TableCell>
                      <TableCell>{allocation.allocationPercentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2 }}>Inventory</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(selectedLocation.inventory).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2 }}>Documents</Typography>
            <List>
              {selectedLocation.documents.map((document) => (
                <ListItem key={document.uuid}>
                  <ListItemText>
                    <a href={`/documents/${document.uuid}`} target="_blank" rel="noopener noreferrer">
                      {document.fileName}
                    </a>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PolicyDetails;
