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
  completed = "Completed",
  ongoing = "Ongoing",
  overdue = "Overdue",
  upcoming = "Upcoming",
}

export interface SearchOptionProps {
  searchValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  width?: number | string;
  rounded?: boolean;
}
export interface DefaultNumberArrayOptionProps {
  setId: any;
  currentId?: number | number[];
  width?: number | string;
  rounded?: boolean;
}

export interface DefaultStringArrayOptionProps {
  onChange?: (val: string[]) => void;
  width?: number | string;
  rounded?: boolean;
  multiple?: boolean;
  value?: string[];
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
  currentId?: number | number[];
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
  locationOptions?: DefaultNumberArrayOptionProps;
  entityStatusOptions?: EntityStatusOptionProps;
  typeSelectorOptions?: TypeSelectorOptionProps;
  zoneOptions?: DefaultNumberArrayOptionProps;
  divisionOptions?: DefaultNumberArrayOptionProps;
  brandOptions?: DefaultStringArrayOptionProps;
  assignedOptions?: DefaultBooleanOptionProps;
  assignedToMeOptions?: DefaultBooleanOptionProps;
  measurementOptions?: DefaultStringArrayOptionProps;
  lteCurrentRunningOptions?: SearchReadingOptionProps;
  gteCurrentRunningOptions?: SearchReadingOptionProps;
  lteLastServiceOptions?: SearchReadingOptionProps;
  gteLastServiceOptions?: SearchReadingOptionProps;
  lteInterServiceOptions?: SearchReadingOptionProps;
  gteInterServiceOptions?: SearchReadingOptionProps;
  isIncompleteChecklistTaskOptions?: DefaultBooleanOptionProps;
  entityTypeOptions?: DefaultStringArrayOptionProps;
}
