import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

// Dummy data for users and privileges
const users = [
  { id: 1, name: 'John Doe', privileges: [0, 2] }, // Has 'Read' and 'Admin'
  { id: 2, name: 'Jane Smith', privileges: [1] }, // Has 'Write'
];

const allPrivileges = [
  { id: 0, name: 'Read' },
  { id: 1, name: 'Write' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Delete' },
];

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.includes(value));
}

export default function PrivilegeTransferList() {
  const [checked, setChecked] = useState<readonly number[]>([]);
  const [left, setLeft] = useState<readonly number[]>([]); // Current privileges
  const [right, setRight] = useState<readonly number[]>([]); // Available privileges
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [initialLeft, setInitialLeft] = useState<readonly number[]>([]); // For undo

  useEffect(() => {
    if (selectedUser !== null) {
      const user = users.find((u) => u.id === selectedUser);
      if (user) {
        const currentPrivileges = user.privileges;
        const availablePrivileges = allPrivileges
          .filter((priv) => !currentPrivileges.includes(priv.id))
          .map((priv) => priv.id);

        setLeft(currentPrivileges);
        setRight(availablePrivileges);
        setInitialLeft(currentPrivileges); // Save initial state for undo
        setChecked([]);
      }
    }
  }, [selectedUser]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleUpdate = () => {
    const updatedUser = users.find((user) => user.id === selectedUser);
    if (updatedUser) {
      // Use the spread operator to create a mutable copy of the 'left' array
      updatedUser.privileges = [...left];  // Convert 'readonly number[]' to 'number[]'
      alert(`Privileges updated for ${updatedUser.name}`);
    }
  };

  const handleUndo = () => {
    setLeft(initialLeft);
    setRight(allPrivileges.filter((priv) => !initialLeft.includes(priv.id)).map((priv) => priv.id));
    setChecked([]);
  };

  const customList = (items: readonly number[], title: string) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: number) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={allPrivileges.find((priv) => priv.id === value)?.name}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ width: 500, margin: 'auto', mt: 4 }}>
      {/* User Selection Dropdown */}
      <Select
        value={selectedUser || ''}
        onChange={(e) => setSelectedUser(Number(e.target.value))}
        displayEmpty
        fullWidth
        variant="outlined"
      >
        <MenuItem value="" disabled>
          Select User
        </MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </Select>

      {/* Transfer List */}
      {selectedUser && (
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: 'center', alignItems: 'center', mt: 2 }}
        >
          <Grid item>{customList(left, 'Current Privileges')}</Grid>
          <Grid item>
            <Grid container direction="column" sx={{ alignItems: 'center' }}>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleAllRight}
                disabled={left.length === 0}
                aria-label="move all right"
              >
                ≫
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleAllLeft}
                disabled={right.length === 0}
                aria-label="move all left"
              >
                ≪
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList(right, 'Available Privileges')}</Grid>
        </Grid>
      )}

      {/* Update and Undo Buttons */}
      {selectedUser && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={handleUndo} variant="outlined">
            Undo
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </Box>
      )}
    </Box>
  );
}
