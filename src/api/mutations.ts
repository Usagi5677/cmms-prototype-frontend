import { gql } from "@apollo/client";

export const CREATE_MACHINE = gql`
  mutation (
    $machineNumber: String
    $model: String
    $typeId: Int
    $zone: String
    $location: String
    $currentRunning: Int
    $lastService: Int
    $registeredDate: Date
    $measurement: String
  ) {
    createMachine(
      machineNumber: $machineNumber
      model: $model
      typeId: $typeId
      zone: $zone
      location: $location
      currentRunning: $currentRunning
      lastService: $lastService
      registeredDate: $registeredDate
      measurement: $measurement
    )
  }
`;

export const EDIT_MACHINE = gql`
  mutation (
    $id: Int!
    $machineNumber: String
    $model: String
    $typeId: Int
    $zone: String
    $location: String
    $currentRunning: Int
    $lastService: Int
    $registeredDate: Date
    $measurement: String
  ) {
    editMachine(
      id: $id
      machineNumber: $machineNumber
      model: $model
      typeId: $typeId
      zone: $zone
      location: $location
      currentRunning: $currentRunning
      lastService: $lastService
      registeredDate: $registeredDate
      measurement: $measurement
    )
  }
`;

export const DELETE_MACHINE = gql`
  mutation ($machineId: Int!) {
    removeMachine(machineId: $machineId)
  }
`;

export const SET_MACHINE_PERIODIC_MAINTENANCE_STATUS = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setMachinePeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;

export const DELETE_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deleteMachinePeriodicMaintenance(id: $id)
  }
`;

export const ADD_MACHINE_SPARE_PR = gql`
  mutation (
    $machineId: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    addMachineSparePR(
      machineId: $machineId
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const EDIT_MACHINE_SPARE_PR = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    editMachineSparePR(
      id: $id
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const DELETE_MACHINE_SPARE_PR = gql`
  mutation ($id: Int!) {
    deleteMachineSparePR(id: $id)
  }
`;

export const SET_MACHINE_SPARE_PR_STATUS = gql`
  mutation ($id: Int!, $status: SparePRStatus!) {
    setMachineSparePRStatus(id: $id, status: $status)
  }
`;

export const ADD_MACHINE_REPAIR = gql`
  mutation ($machineId: Int!, $title: String!, $description: String!) {
    addMachineRepair(
      machineId: $machineId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_MACHINE_REPAIR = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editMachineRepair(id: $id, title: $title, description: $description)
  }
`;

export const DELETE_MACHINE_REPAIR = gql`
  mutation ($id: Int!) {
    deleteMachineRepair(id: $id)
  }
`;

export const SET_MACHINE_REPAIR_STATUS = gql`
  mutation ($id: Int!, $status: RepairStatus!) {
    setMachineRepairStatus(id: $id, status: $status)
  }
`;

export const ADD_MACHINE_BREAKDOWN = gql`
  mutation ($machineId: Int!, $title: String!, $description: String!) {
    addMachineBreakdown(
      machineId: $machineId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_MACHINE_BREAKDOWN = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $estimatedDateOfRepair: Date!
  ) {
    editMachineBreakdown(
      id: $id
      title: $title
      description: $description
      estimatedDateOfRepair: $estimatedDateOfRepair
    )
  }
`;

export const DELETE_MACHINE_BREAKDOWN = gql`
  mutation ($id: Int!) {
    deleteMachineBreakdown(id: $id)
  }
`;

export const SET_MACHINE_BREAKDOWN_STATUS = gql`
  mutation ($id: Int!, $status: BreakdownStatus!) {
    setMachineBreakdownStatus(id: $id, status: $status)
  }
`;

export const SET_MACHINE_STATUS = gql`
  mutation ($machineId: Int!, $status: MachineStatus!) {
    setMachineStatus(machineId: $machineId, status: $status)
  }
`;

export const DELETE_MACHINE_ATTACHMENT = gql`
  mutation ($id: Int!) {
    removeMachineAttachment(id: $id)
  }
`;

export const EDIT_MACHINE_ATTACHMENT = gql`
  mutation ($id: Int!, $description: String!) {
    editMachineAttachment(id: $id, description: $description)
  }
`;

export const CREATE_TRANSPORTATION = gql`
  mutation (
    $machineNumber: String
    $model: String
    $typeId: Int
    $department: String
    $location: String
    $engine: String
    $measurement: String
    $transportType: String
    $currentMileage: Int
    $lastServiceMileage: Int
    $registeredDate: Date
  ) {
    createTransportation(
      machineNumber: $machineNumber
      model: $model
      typeId: $typeId
      department: $department
      location: $location
      engine: $engine
      measurement: $measurement
      transportType: $transportType
      currentMileage: $currentMileage
      lastServiceMileage: $lastServiceMileage
      registeredDate: $registeredDate
    )
  }
`;

export const EDIT_TRANSPORTATION = gql`
  mutation (
    $id: Int!
    $machineNumber: String
    $model: String
    $typeId: Int
    $department: String
    $location: String
    $engine: String
    $measurement: String
    $transportType: String
    $currentMileage: Int
    $lastServiceMileage: Int
    $registeredDate: Date
  ) {
    editTransportation(
      id: $id
      machineNumber: $machineNumber
      model: $model
      typeId: $typeId
      department: $department
      location: $location
      engine: $engine
      measurement: $measurement
      transportType: $transportType
      currentMileage: $currentMileage
      lastServiceMileage: $lastServiceMileage
      registeredDate: $registeredDate
    )
  }
`;

export const DELETE_TRANSPORTATION = gql`
  mutation ($transportationId: Int!) {
    removeTransportation(transportationId: $transportationId)
  }
`;

export const SET_TRANSPORTATION_STATUS = gql`
  mutation ($transportationId: Int!, $status: TransportationStatus!) {
    setTransportationStatus(
      transportationId: $transportationId
      status: $status
    )
  }
`;

export const ADD_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation (
    $transportationId: Int!
    $title: String!
    $measurement: String!
    $value: Int!
    $startDate: Date!
    $tasks: [String!]
  ) {
    addTransportationPeriodicMaintenance(
      transportationId: $transportationId
      title: $title
      measurement: $measurement
      value: $value
      startDate: $startDate
      tasks: $tasks
    )
  }
`;

export const SET_TRANSPORTATION_PERIODIC_MAINTENANCE_STATUS = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setTransportationPeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;

export const EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation (
    $id: Int!
    $title: String!
    $measurement: String!
    $value: Int!
    $startDate: Date!
  ) {
    editTransportationPeriodicMaintenance(
      id: $id
      title: $title
      measurement: $measurement
      value: $value
      startDate: $startDate
    )
  }
`;

export const DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deleteTransportationPeriodicMaintenance(id: $id)
  }
`;

export const ADD_TRANSPORTATION_SPARE_PR = gql`
  mutation (
    $transportationId: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    addTransportationSparePR(
      transportationId: $transportationId
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const EDIT_TRANSPORTATION_SPARE_PR = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    editTransportationSparePR(
      id: $id
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const DELETE_TRANSPORTATION_SPARE_PR = gql`
  mutation ($id: Int!) {
    deleteTransportationSparePR(id: $id)
  }
`;

export const SET_TRANSPORTATION_SPARE_PR_STATUS = gql`
  mutation ($id: Int!, $status: SparePRStatus!) {
    setTransportationSparePRStatus(id: $id, status: $status)
  }
`;

export const ADD_TRANSPORTATION_REPAIR = gql`
  mutation ($transportationId: Int!, $title: String!, $description: String!) {
    addTransportationRepair(
      transportationId: $transportationId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_TRANSPORTATION_REPAIR = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editTransportationRepair(id: $id, title: $title, description: $description)
  }
`;

export const DELETE_TRANSPORTATION_REPAIR = gql`
  mutation ($id: Int!) {
    deleteTransportationRepair(id: $id)
  }
`;

export const SET_TRANSPORTATION_REPAIR_STATUS = gql`
  mutation ($id: Int!, $status: RepairStatus!) {
    setTransportationRepairStatus(id: $id, status: $status)
  }
`;

export const ADD_TRANSPORTATION_BREAKDOWN = gql`
  mutation ($transportationId: Int!, $title: String!, $description: String!) {
    addTransportationBreakdown(
      transportationId: $transportationId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_TRANSPORTATION_BREAKDOWN = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $estimatedDateOfRepair: Date!
  ) {
    editTransportationBreakdown(
      id: $id
      title: $title
      description: $description
      estimatedDateOfRepair: $estimatedDateOfRepair
    )
  }
`;

export const DELETE_TRANSPORTATION_BREAKDOWN = gql`
  mutation ($id: Int!) {
    deleteTransportationBreakdown(id: $id)
  }
`;

export const SET_TRANSPORTATION_BREAKDOWN_STATUS = gql`
  mutation ($id: Int!, $status: BreakdownStatus!) {
    setTransportationBreakdownStatus(id: $id, status: $status)
  }
`;

export const EDIT_TRANSPORTATION_ATTACHMENT = gql`
  mutation ($id: Int!, $description: String!) {
    editTransportationAttachment(id: $id, description: $description)
  }
`;

export const DELETE_TRANSPORTATION_ATTACHMENT = gql`
  mutation ($id: Int!) {
    removeTransportationAttachment(id: $id)
  }
`;

export const ADD_ROLE = gql`
  mutation ($name: String!) {
    addRole(name: $name)
  }
`;

export const EDIT_ROLE = gql`
  mutation ($id: Int!, $name: String!) {
    editRole(id: $id, name: $name)
  }
`;

export const DELETE_ROLE = gql`
  mutation ($id: Int!) {
    removeRole(id: $id)
  }
`;

export const ASSIGN_PERMISSION = gql`
  mutation ($roleId: Int!, $permissions: [String!]!) {
    assignPermission(roleId: $roleId, permissions: $permissions)
  }
`;

export const ADD_USER_ROLE = gql`
  mutation ($userId: Int!, $roles: [Int!]!) {
    addUserRole(userId: $userId, roles: $roles)
  }
`;

export const REMOVE_USER_ROLE = gql`
  mutation ($userId: Int!, $roleId: Int!) {
    removeUserRole(userId: $userId, roleId: $roleId)
  }
`;

export const ADD_APP_USER = gql`
  mutation addAppUser($userId: String!, $roles: [Int!]!) {
    addAppUser(userId: $userId, roles: $roles)
  }
`;

export const READ_ONE_NOTIFICATION = gql`
  mutation readNotification($notificationId: Int!) {
    readNotification(notificationId: $notificationId)
  }
`;

export const READ_ALL_NOTIFICATIONS = gql`
  mutation readAllNotifications {
    readAllNotifications
  }
`;

export const EDIT_MACHINE_USAGE = gql`
  mutation ($id: Int!, $currentRunning: Int!, $lastService: Int!) {
    editMachineUsage(
      id: $id
      currentRunning: $currentRunning
      lastService: $lastService
    )
  }
`;

export const EDIT_TRANSPORTATION_USAGE = gql`
  mutation ($id: Int!, $currentMileage: Int!, $lastServiceMileage: Int!) {
    editTransportationUsage(
      id: $id
      currentMileage: $currentMileage
      lastServiceMileage: $lastServiceMileage
    )
  }
`;

export const ADD_MACHINE_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($parentTaskId: Int, $periodicMaintenanceId: Int!, $name: String!) {
    createMachinePeriodicMaintenanceTask(
      parentTaskId: $parentTaskId
      periodicMaintenanceId: $periodicMaintenanceId
      name: $name
    )
  }
`;

export const TOGGLE_MACHINE_PM_TASK = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleMachinePMTask(id: $id, complete: $complete)
  }
`;

export const DELETE_MACHINE_PM_TASK = gql`
  mutation ($id: Int!) {
    deleteMachinePMTask(id: $id)
  }
`;

export const ADD_TRANSPORTATION_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($parentTaskId: Int, $periodicMaintenanceId: Int!, $name: String!) {
    createTransportationPeriodicMaintenanceTask(
      parentTaskId: $parentTaskId
      periodicMaintenanceId: $periodicMaintenanceId
      name: $name
    )
  }
`;

export const TOGGLE_TRANSPORTATION_PM_TASK = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleTransportationPMTask(id: $id, complete: $complete)
  }
`;

export const DELETE_TRANSPORTATION_PM_TASK = gql`
  mutation ($id: Int!) {
    deleteTransportationPMTask(id: $id)
  }
`;

export const TOGGLE_VERIFY_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!, $verify: Boolean!) {
    toggleVerifyMachinePeriodicMaintenance(id: $id, verify: $verify)
  }
`;

export const TOGGLE_VERIFY_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!, $verify: Boolean!) {
    toggleVerifyTransportationPeriodicMaintenance(id: $id, verify: $verify)
  }
`;

export const CREATE_CHECKLIST_TEMPLATE = gql`
  mutation createChecklistTemplate($input: CreateChecklistTemplateInput!) {
    createChecklistTemplate(createChecklistTemplateInput: $input)
  }
`;

export const DELETE_CHECKLIST_TEMPLATE = gql`
  mutation removeChecklistTemplate($id: Int!) {
    removeChecklistTemplate(id: $id)
  }
`;

export const EDIT_CHECKLIST_TEMPLATE = gql`
  mutation updateChecklistTemplate($input: UpdateChecklistTemplateInput!) {
    updateChecklistTemplate(updateChecklistTemplateInput: $input)
  }
`;

export const ADD_CHECKLIST_TEMPLATE_ITEM = gql`
  mutation addChecklistTemplateItem($id: Int!, $name: String!, $entityId: Int) {
    addChecklistTemplateItem(id: $id, name: $name, entityId: $entityId)
  }
`;

export const REMOVE_CHECKLIST_TEMPLATE_ITEM = gql`
  mutation removeChecklistTemplateItem(
    $id: Int!
    $templateId: Int
    $entityId: Int
  ) {
    removeChecklistTemplateItem(
      id: $id
      templateId: $templateId
      entityId: $entityId
    )
  }
`;

export const CHANGE_CHECKLIST_TEMPLATE = gql`
  mutation changeChecklistTemplate($input: ChangeChecklistTemplateInput!) {
    changeChecklistTemplate(input: $input)
  }
`;

export const TOGGLE_CHECKLIST_ITEM = gql`
  mutation toggleChecklistItem($id: Int!, $complete: Boolean!) {
    toggleChecklistItem(id: $id, complete: $complete)
  }
`;

export const UPDATE_WORKING_HOURS = gql`
  mutation updateWorkingHours($id: Int!, $newHrs: Int!) {
    updateWorkingHours(id: $id, newHrs: $newHrs)
  }
`;

export const UPDATE_READING = gql`
  mutation updateReading($id: Int!, $reading: Int!) {
    updateReading(id: $id, reading: $reading)
  }
`;

export const ADD_CHECKLIST_COMMENT = gql`
  mutation addChecklistComment($checklistId: Int!, $comment: String!) {
    addChecklistComment(checklistId: $checklistId, comment: $comment)
  }
`;

export const REMOVE_CHECKLIST_COMMENT = gql`
  mutation removeChecklistComment($id: Int!) {
    removeChecklistComment(id: $id)
  }
`;

export const EDIT_USER_LOCATION = gql`
  mutation ($id: Int!, $locationId: Int) {
    editUserLocation(id: $id, locationId: $locationId)
  }
`;

export const TOGGLE_PERMISSION = gql`
  mutation ($roleId: Int!, $permission: String!, $complete: Boolean!) {
    togglePermission(
      roleId: $roleId
      permission: $permission
      complete: $complete
    )
  }
`;

export const EDIT_MACHINE_LOCATION = gql`
  mutation ($id: Int!, $location: String!) {
    editMachineLocation(id: $id, location: $location)
  }
`;

export const EDIT_TRANSPORTATION_LOCATION = gql`
  mutation ($id: Int!, $location: String!) {
    editTransportationLocation(id: $id, location: $location)
  }
`;

export const CREATE_TYPE = gql`
  mutation createType($input: CreateTypeInput!) {
    createType(createTypeInput: $input)
  }
`;

export const DELETE_TYPE = gql`
  mutation removeType($id: Int!) {
    removeType(id: $id)
  }
`;

export const EDIT_TYPE = gql`
  mutation updateType($input: UpdateTypeInput!) {
    updateType(updateTypeInput: $input)
  }
`;

export const CREATE_LOCATION = gql`
  mutation createLocation($input: CreateLocationInput!) {
    createLocation(input: $input)
  }
`;

export const DELETE_LOCATION = gql`
  mutation removeLocation($id: Int!) {
    removeLocation(id: $id)
  }
`;

export const EDIT_LOCATION = gql`
  mutation updateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input)
  }
`;

export const CREATE_KEY = gql`
  mutation createApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input)
  }
`;

export const DEACTIVATE_KEY = gql`
  mutation deactivateApiKey($id: Int!) {
    deactivateApiKey(id: $id)
  }
`;

export const EDIT_KEY = gql`
  mutation editKey($input: EditApiKeyInput!) {
    editKey(input: $input)
  }
`;

export const CREATE_ZONE = gql`
  mutation createZone($input: CreateZoneInput!) {
    createZone(input: $input)
  }
`;

export const DELETE_ZONE = gql`
  mutation removeZone($id: Int!) {
    removeZone(id: $id)
  }
`;

export const EDIT_ZONE = gql`
  mutation updateZone($input: UpdateZoneInput!) {
    updateZone(input: $input)
  }
`;

export const CREATE_ENTITY = gql`
  mutation (
    $typeId: Int
    $machineNumber: String
    $model: String
    $department: String
    $zone: String
    $locationId: Int
    $engine: String
    $measurement: String
    $currentRunning: Int
    $lastService: Int
    $registeredDate: Date
  ) {
    createEntity(
      typeId: $typeId
      machineNumber: $machineNumber
      model: $model
      department: $department
      zone: $zone
      locationId: $locationId
      engine: $engine
      measurement: $measurement
      currentRunning: $currentRunning
      lastService: $lastService
      registeredDate: $registeredDate
    )
  }
`;

export const EDIT_ENTITY = gql`
  mutation (
    $id: Int!
    $typeId: Int
    $machineNumber: String
    $model: String
    $department: String
    $zone: String
    $locationId: Int
    $engine: String
    $measurement: String
    $registeredDate: Date
  ) {
    editEntity(
      id: $id
      typeId: $typeId
      machineNumber: $machineNumber
      model: $model
      department: $department
      zone: $zone
      locationId: $locationId
      engine: $engine
      measurement: $measurement
      registeredDate: $registeredDate
    )
  }
`;

export const DELETE_ENTITY = gql`
  mutation ($entityId: Int!) {
    removeEntity(entityId: $entityId)
  }
`;

export const SET_ENTITY_STATUS = gql`
  mutation ($entityId: Int!, $status: String!) {
    setEntityStatus(entityId: $entityId, status: $status)
  }
`;

export const CREATE_PERIODIC_MAINTENANCE = gql`
  mutation (
    $name: String!
    $measurement: String!
    $value: Int!
    $previousMeterReading: Int
    $currentMeterReading: Int
  ) {
    createPeriodicMaintenance(
      name: $name
      measurement: $measurement
      value: $value
      previousMeterReading: $previousMeterReading
      currentMeterReading: $currentMeterReading
    )
  }
`;

//not using
export const ADD_ENTITY_PERIODIC_MAINTENANCE = gql`
  mutation (
    $entityId: Int!
    $title: String!
    $measurement: String!
    $value: Int!
    $startDate: Date!
    $tasks: [String!]
  ) {
    addEntityPeriodicMaintenance(
      entityId: $entityId
      title: $title
      measurement: $measurement
      value: $value
      startDate: $startDate
      tasks: $tasks
    )
  }
`;

export const SET_ENTITY_PERIODIC_MAINTENANCE_STATUS = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setEntityPeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;

export const EDIT_PERIODIC_MAINTENANCE = gql`
  mutation (
    $id: Int!
    $name: String!
    $measurement: String
    $value: Int
    $previousMeterReading: Int
    $currentMeterReading: Int
  ) {
    editPeriodicMaintenance(
      id: $id
      name: $name
      measurement: $measurement
      value: $value
      previousMeterReading: $previousMeterReading
      currentMeterReading: $currentMeterReading
    )
  }
`;

//not using
export const EDIT_ENTITY_PERIODIC_MAINTENANCE = gql`
  mutation (
    $id: Int!
    $title: String!
    $measurement: String!
    $value: Int!
    $startDate: Date!
  ) {
    editEntityPeriodicMaintenance(
      id: $id
      title: $title
      measurement: $measurement
      value: $value
      startDate: $startDate
    )
  }
`;

export const DELETE_ENTITY_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deleteEntityPeriodicMaintenance(id: $id)
  }
`;

export const ADD_ENTITY_SPARE_PR = gql`
  mutation (
    $entityId: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    addEntitySparePR(
      entityId: $entityId
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const EDIT_ENTITY_SPARE_PR = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    editEntitySparePR(
      id: $id
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const DELETE_ENTITY_SPARE_PR = gql`
  mutation ($id: Int!) {
    deleteEntitySparePR(id: $id)
  }
`;

export const SET_ENTITY_SPARE_PR_STATUS = gql`
  mutation ($id: Int!, $status: SparePRStatus!) {
    setEntitySparePRStatus(id: $id, status: $status)
  }
`;

export const ADD_ENTITY_REPAIR_REQUEST = gql`
  mutation (
    $entityId: Int!
    $internal: Boolean
    $projectName: String
    $location: String
    $reason: String
    $additionalInfo: String
    $attendInfo: String
    $operatorId: Int
    $supervisorId: Int
    $projectManagerId: Int
  ) {
    addEntityRepairRequest(
      entityId: $entityId
      internal: $internal
      projectName: $projectName
      location: $location
      reason: $reason
      additionalInfo: $additionalInfo
      attendInfo: $attendInfo
      operatorId: $operatorId
      supervisorId: $supervisorId
      projectManagerId: $projectManagerId
    )
  }
`;

export const EDIT_ENTITY_REPAIR_REQUEST = gql`
  mutation (
    $id: Int!
    $internal: Boolean
    $projectName: String
    $location: String
    $reason: String
    $additionalInfo: String
    $attendInfo: String
    $operatorId: Int
    $supervisorId: Int
    $projectManagerId: Int
  ) {
    editEntityRepairRequest(
      id: $id
      internal: $internal
      projectName: $projectName
      location: $location
      reason: $reason
      additionalInfo: $additionalInfo
      attendInfo: $attendInfo
      operatorId: $operatorId
      supervisorId: $supervisorId
      projectManagerId: $projectManagerId
    )
  }
`;

export const DELETE_ENTITY_REPAIR_REQUEST = gql`
  mutation ($id: Int!) {
    deleteEntityRepairRequest(id: $id)
  }
`;

export const ADD_ENTITY_BREAKDOWN = gql`
  mutation ($entityId: Int!, $title: String!, $description: String!) {
    addEntityBreakdown(
      entityId: $entityId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_ENTITY_BREAKDOWN = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $estimatedDateOfRepair: Date!
  ) {
    editEntityBreakdown(
      id: $id
      title: $title
      description: $description
      estimatedDateOfRepair: $estimatedDateOfRepair
    )
  }
`;

export const DELETE_ENTITY_BREAKDOWN = gql`
  mutation ($id: Int!) {
    deleteEntityBreakdown(id: $id)
  }
`;

export const SET_ENTITY_BREAKDOWN_STATUS = gql`
  mutation ($id: Int!, $status: BreakdownStatus!) {
    setEntityBreakdownStatus(id: $id, status: $status)
  }
`;

export const EDIT_ENTITY_ATTACHMENT = gql`
  mutation ($id: Int!, $description: String!) {
    editEntityAttachment(id: $id, description: $description)
  }
`;

export const DELETE_ENTITY_ATTACHMENT = gql`
  mutation ($id: Int!) {
    removeEntityAttachment(id: $id)
  }
`;

export const ASSIGN_USER_TO_ENTITY = gql`
  mutation ($entityId: Int!, $type: String!, $userIds: [Int!]!) {
    assignUserToEntity(entityId: $entityId, type: $type, userIds: $userIds)
  }
`;

export const UNASSIGN_USER_FROM_ENTITY = gql`
  mutation ($entityId: Int!, $type: String!, $userId: Int!) {
    unassignUserFromEntity(entityId: $entityId, type: $type, userId: $userId)
  }
`;

export const ADD_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($parentTaskId: Int, $periodicMaintenanceId: Int!, $name: String!) {
    createPeriodicMaintenanceTask(
      parentTaskId: $parentTaskId
      periodicMaintenanceId: $periodicMaintenanceId
      name: $name
    )
  }
`;

//not using
export const ADD_ENTITY_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($parentTaskId: Int, $periodicMaintenanceId: Int!, $name: String!) {
    createEntityPeriodicMaintenanceTask(
      parentTaskId: $parentTaskId
      periodicMaintenanceId: $periodicMaintenanceId
      name: $name
    )
  }
`;

export const TOGGLE_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    togglePeriodicMaintenanceTask(id: $id, complete: $complete)
  }
`;

export const DELETE_PERIODIC_MAINTENANCE_TASK = gql`
  mutation ($id: Int!) {
    deletePeriodicMaintenanceTask(id: $id)
  }
`;

export const DELETE_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deletePeriodicMaintenance(id: $id)
  }
`;

export const ASSIGN_PERIODIC_MAINTENANCE_TEMPLATE = gql`
  mutation ($entityId: Int!, $originId: Int!) {
    assignPeriodicMaintenanceTemplate(entityId: $entityId, originId: $originId)
  }
`;

//not using
export const TOGGLE_ENTITY_PM_TASK = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleEntityPMTask(id: $id, complete: $complete)
  }
`;

//not using
export const DELETE_ENTITY_PM_TASK = gql`
  mutation ($id: Int!) {
    deleteEntityPMTask(id: $id)
  }
`;

export const TOGGLE_VERIFY_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!, $verify: Boolean!) {
    toggleVerifyPeriodicMaintenance(id: $id, verify: $verify)
  }
`;

//not using
export const TOGGLE_VERIFY_ENTITY_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!, $verify: Boolean!) {
    toggleVerifyEntityPeriodicMaintenance(id: $id, verify: $verify)
  }
`;

export const ADD_PERIODIC_MAINTENANCE_COMMENT = gql`
  mutation addPeriodicMaintenanceComment(
    $type: String!
    $periodicMaintenanceId: Int!
    $taskId: Int
    $text: String!
  ) {
    addPeriodicMaintenanceComment(
      type: $type
      periodicMaintenanceId: $periodicMaintenanceId
      taskId: $taskId
      text: $text
    )
  }
`;

export const DELETE_PERIODIC_MAINTENANCE_COMMENT = gql`
  mutation removePeriodicMaintenanceComment($id: Int!) {
    removePeriodicMaintenanceComment(id: $id)
  }
`;

export const PERIODIC_MAINTENANCE_UPDATE_READING = gql`
  mutation updatePeriodicMaintenanceReading($id: Int!, $reading: Int!) {
    updatePeriodicMaintenanceReading(id: $id, reading: $reading)
  }
`;
export const ADD_CHECKLIST_ITEM_ISSUE = gql`
  mutation addChecklistIssue(
    $checklistId: Int!
    $itemId: Int!
    $comment: String!
  ) {
    addChecklistIssue(
      checklistId: $checklistId
      itemId: $itemId
      comment: $comment
    )
  }
`;

export const TOGGLE_APPROVE_ENTITY_REPAIR_REQUEST = gql`
  mutation ($id: Int!, $approve: Boolean!) {
    toggleApproveEntityRepairRequest(id: $id, approve: $approve)
  }
`;

export const TOGGLE_COMPLETE_ENTITY_REPAIR_REQUEST = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleCompleteEntityRepairRequest(id: $id, complete: $complete)
  }
`;

export const UPSERT_PM_NOTIFICATION_REMINDER = gql`
  mutation upsertPMNotificationReminder(
    $periodicMaintenanceId: Int
    $type: String
    $hour: Int
    $kilometer: Int
    $day: Int
    $week: Int
    $month: Int
  ) {
    upsertPMNotificationReminder(
      periodicMaintenanceId: $periodicMaintenanceId
      type: $type
      hour: $hour
      kilometer: $kilometer
      day: $day
      week: $week
      month: $month
    )
  }
`;

export const BULK_ASSIGN = gql`
  mutation bulkAssign($input: BulkAssignInput!) {
    bulkAssign(input: $input)
  }
`;
