import React, { useEffect, useState } from 'react';
import { Container, CircularProgress } from '@mui/material';
// import CustomTable from './CustomTable';
import Section from './Section';

interface ManufacturerData {
  manufacturer: string;
  percentage: number;
}

interface InventoryData {
  q1Description: string;
  q1NewInventory: number;
  q1UsedInventory: number;
  q2Description: string;
  q2NewInventory: number;
  q2UsedInventory: number;
  q3Description: string;
  q3NewInventory: number;
  q3UsedInventory: number;
  q4Description: string;
  q4NewInventory: number;
  q4UsedInventory: number;
  annualDescription: string;
  demoVehicles: number;
  shopRentals: number;
  companyOwnedVehicles: number;
}

interface FacilityUpdates {
  lockBoxes: string;
  lockBoxesDesc: string;
  securityOrSurveillance: string;
  securityOrSurveillanceDesc: string;
  mailingOrBillingInfo: string;
  mailingOrBillingInfoDesc: string;
  floorPlanSource: string;
  floorPlanSourceDesc: string;
  lossPrevention: string;
  lossPreventionDesc: string;
  otherInformation: string;
}

interface PremiumVehicles {
  over200K: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  wholesaleValue: string;
  ownedByDealership: string;
  storedAtDealership: string;
  howVehicleStored: string;
  primaryUseOfVehicle: string;
}

interface DealerData {
  name: string;
  manufacturerData: ManufacturerData[];
  inventoryData: InventoryData;
  facilityUpdates: FacilityUpdates;
  premiumVehicles: PremiumVehicles;
}

// Mock function to simulate data fetching
const fetchDealerData = (): Promise<DealerData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'Dealer A',
          manufacturerData: [
            { manufacturer: 'Toyota', percentage: 25 },
            { manufacturer: 'Ford', percentage: 10 },
            { manufacturer: 'Honda', percentage: 15 },
          ],
          inventoryData: {
            q1Description: 'Jan. - March 2023',
            q1NewInventory: 50,
            q1UsedInventory: 25,
            q2Description: 'April - June 2023',
            q2NewInventory: 40,
            q2UsedInventory: 50,
            q3Description: 'July - Sept. 2023',
            q3NewInventory: 75,
            q3UsedInventory: 40,
            q4Description: 'Oct. - Dec. 2023',
            q4NewInventory: 60,
            q4UsedInventory: 75,
            annualDescription: 'Total inventory',
            demoVehicles: 5,
            shopRentals: 3,
            companyOwnedVehicles: 8,
          },
          facilityUpdates: {
            lockBoxes: 'Yes',
            lockBoxesDesc: 'Secure lock boxes installed',
            securityOrSurveillance: 'Yes',
            securityOrSurveillanceDesc: '24/7 surveillance cameras',
            mailingOrBillingInfo: 'No',
            mailingOrBillingInfoDesc: '',
            floorPlanSource: 'ABC Bank',
            floorPlanSourceDesc: 'Floor plan financing with ABC Bank',
            lossPrevention: 'Yes',
            lossPreventionDesc: 'Loss prevention measures in place',
            otherInformation: 'none',
          },
          premiumVehicles: {
            over200K: 'No',
            vin: '1234567899',
            year: '2022',
            make: 'Toyota',
            model: 'Camry',
            wholesaleValue: '25000',
            ownedByDealership: 'Yes',
            storedAtDealership: 'Yes',
            howVehicleStored: 'Indoor storage',
            primaryUseOfVehicle: 'Test drives',
          },
        },
      ]);
    }, 1000);
  });
};

const DealerDetails: React.FC<{ dealerName: string }> = ({ dealerName }) => {
  const [dealer, setDealer] = useState<DealerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealerData().then((data) => {
      const foundDealer = data.find((dealer) => dealer.name === dealerName);
      setDealer(foundDealer || null);
      setLoading(false);
    });
  }, [dealerName]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!dealer) {
    return <div>No dealer data available</div>;
  }

  return (
    <Container>
      <Section title={`Manufacturer and Percentage for ${dealer.name}`}>
        <CustomTable data={dealer.manufacturerData} headers={['manufacturer', 'percentage']} />
      </Section>

      <Section title={`Inventory for ${dealer.name}`}>
        <CustomTable data={[dealer.inventoryData]} headers={Object.keys(dealer.inventoryData)} />
      </Section>

      <Section title="Facility Updates">
        <CustomTable data={[dealer.facilityUpdates]} headers={Object.keys(dealer.facilityUpdates)} />
      </Section>

      <Section title="Premium Vehicles">
        <CustomTable data={[dealer.premiumVehicles]} headers={Object.keys(dealer.premiumVehicles)} />
      </Section>
    </Container>
  );
};

export default DealerDetails;


import React from 'react';
import { Typography, Box } from '@mui/material';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <Box mb={4}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

export default Section;

