// src/types.ts

export interface DealerContactInfo {
    fullName: string;
    positionTitle: string;
    phoneNumber: string;
    faxNumber: string;
    emailId: string;
  }
  
  export interface FacilityUpdates {
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
  
  export interface LocationInfo {
    locationId: string;
    dealershipName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    facilityUpdates: FacilityUpdates;
  }
  
  export interface PremiumVehicles {
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
  
  export interface Inventory {
    q1Description: string;
    q1NewInventory: string;
    q1UsedInventory: string;
    q2Description: string;
    q2NewInventory: string;
    q2UsedInventory: string;
    q3Description: string;
    q3NewInventory: string;
    q3UsedInventory: string;
    q4Description: string;
    q4NewInventory: string;
    q4UsedInventory: string;
    annualDescription: string;
    demoVehicles: string;
    shopRentals: string;
    companyOwnedVehicles: string;
  }
  
  export interface Location {
    locationInfo: LocationInfo;
    premiumVehicles: PremiumVehicles;
    manufacturersAllocation: Array<{ name: string; allocationPercentage: string }>;
    inventory: Inventory;
    documents: Array<{ uuid: string; fileName: string }>;
  }
  
  export interface PolicyData {
    renewalPolicySummary: {
      pdn: string;
      policyNumber: string;
      policyId: string;
      userId: string;
      dealerContactInfo: DealerContactInfo;
    };
    locations: Location[];
  }
  
