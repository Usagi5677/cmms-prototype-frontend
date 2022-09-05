import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { ChangeEvent } from "react";

export enum EntityStatus {
  Working = "Working",
  Critical = "Critical",
  Breakdown = "Breakdown",
  Dispose = "Dispose",
}

export enum RepairStatus {
  Done = "Done",
  Pending = "Pending",
}

export enum BreakdownStatus {
  Done = "Done",
  Pending = "Pending",
  Breakdown = "Breakdown",
}

export enum SparePRStatus {
  Done = "Done",
  Pending = "Pending",
}

export enum PeriodicMaintenanceStatus {
  Done = "Done",
  Pending = "Pending",
  Missed = "Missed",
}

export interface SearchOptionProps {
  searchValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  width?: number | string;
  rounded?: boolean;
}
export interface LocationOptionProps {
  setLocationId: any;
  width?: number | string;
  rounded?: boolean;
}

export interface DefaultStringArrayOptionProps {
  onChange?: (val: string[]) => void;
  width?: number | string;
  rounded?: boolean;
  multiple?: boolean;
}

export interface EntityStatusOptionProps {
  onChange?: (val: EntityStatus[]) => void;
  value: EntityStatus[] | null;
  margin?: string;
  width?: number | string;
  rounded?: boolean;
}
export interface TypeSelectorOptionProps {
  entityType?: "Machine" | "Vehicle" | "Vessel";
  setTypeId: any;
  currentId?: number;
  currentName?: string;
  rounded?: boolean;
  multiple?: boolean;
  width?: number | string;
}

export interface DefaultBooleanOptionProps {
  onChange?: (val: CheckboxChangeEvent) => void;
  flag?: boolean;
  name?: string;
}

export interface SearchReadingOptionProps {
  searchValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  width?: number | string;
  rounded?: boolean;
}
export interface FilterOptionProps {
  searchOptions?: SearchOptionProps;
  locationOptions?: LocationOptionProps;
  entityStatusOptions?: EntityStatusOptionProps;
  typeSelectorOptions?: TypeSelectorOptionProps;
  zoneOptions?: DefaultStringArrayOptionProps;
  departmentOptions?: DefaultStringArrayOptionProps;
  brandOptions?: DefaultStringArrayOptionProps;
  engineOptions?: DefaultStringArrayOptionProps;
  assignedOptions?: DefaultBooleanOptionProps;
  assignedToMeOptions?: DefaultBooleanOptionProps;
  measurementOptions?: DefaultStringArrayOptionProps;
  lteCurrentRunningOptions?: SearchReadingOptionProps;
  gteCurrentRunningOptions?: SearchReadingOptionProps;
  lteLastServiceOptions?: SearchReadingOptionProps;
  gteLastServiceOptions?: SearchReadingOptionProps;
  isIncompleteChecklistTaskOptions?: DefaultBooleanOptionProps;
}
