export const PAGE_LIMIT = 10;

export const DATETIME_FORMATS = {
  FULL: "DD MMMM YYYY HH:mm:ss",
  SHORT: "D MMM H:mm",
  DAY_MONTH: "DD MMM",
  DAY_MONTH_YEAR: "DD MMM YYYY",
};

export const DEPARTMENTS = ["LTD", "MTD", "TRD", "LOD", "MBD", "CDD", "CEO"];

export const PERMISSIONS = [
  "ADD_ROLE",
  "EDIT_ROLE",
  "DELETE_ROLE",
  "ADD_MACHINE",
  "EDIT_MACHINE",
  "DELETE_MACHINE",
  "ADD_MACHINE_CHECKLIST",
  "EDIT_MACHINE_CHECKLIST",
  "DELETE_MACHINE_CHECKLIST",
  "ADD_MACHINE_PERIODIC_MAINTENANCE",
  "EDIT_MACHINE_PERIODIC_MAINTENANCE",
  "DELETE_MACHINE_PERIODIC_MAINTENANCE",
  "ADD_MACHINE_SPARE_PR",
  "EDIT_MACHINE_SPARE_PR",
  "DELETE_MACHINE_SPARE_PR",
  "ADD_MACHINE_REPAIR",
  "EDIT_MACHINE_REPAIR",
  "DELETE_MACHINE_REPAIR",
  "ADD_MACHINE_BREAKDOWN",
  "EDIT_MACHINE_BREAKDOWN",
  "DELETE_MACHINE_BREAKDOWN",
  "ADD_MACHINE_ATTACHMENT",
  "EDIT_MACHINE_ATTACHMENT",
  "DELETE_MACHINE_ATTACHMENT",
  "ADD_TRANSPORTATION",
  "EDIT_TRANSPORTATION",
  "DELETE_TRANSPORTATION",
  "ADD_TRANSPORTATION_CHECKLIST",
  "EDIT_TRANSPORTATION_CHECKLIST",
  "DELETE_TRANSPORTATION_CHECKLIST",
  "ADD_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "ADD_TRANSPORTATION_SPARE_PR",
  "EDIT_TRANSPORTATION_SPARE_PR",
  "DELETE_TRANSPORTATION_SPARE_PR",
  "ADD_TRANSPORTATION_REPAIR",
  "EDIT_TRANSPORTATION_REPAIR",
  "DELETE_TRANSPORTATION_REPAIR",
  "ADD_TRANSPORTATION_BREAKDOWN",
  "EDIT_TRANSPORTATION_BREAKDOWN",
  "DELETE_TRANSPORTATION_BREAKDOWN",
  "ADD_TRANSPORTATION_ATTACHMENT",
  "EDIT_TRANSPORTATION_ATTACHMENT",
  "DELETE_TRANSPORTATION_ATTACHMENT",
  "ASSIGN_USER_TO_MACHINE",
  "UNASSIGN_USER_TO_MACHINE",
  "ASSIGN_USER_TO_TRANSPORTATION",
  "UNASSIGN_USER_TO_TRANSPORTATION",
  "EDIT_MACHINE_USAGE",
  "EDIT_TRANSPORTATION_USAGE",
  "ASSIGN_PERMISSION",
  "ADD_USER_WITH_ROLE",
  "EDIT_USER_ROLE",
  "EDIT_USER_LOCATION",
  "VIEW_ALL_MACHINES",
  "VIEW_ALL_VESSELS",
  "VIEW_ALL_VEHICLES",
  "VIEW_MACHINE",
  "VIEW_VESSEL",
  "VIEW_VEHICLE",
  "VIEW_ALL_ASSIGNED_MACHINES",
  "VIEW_ALL_ASSIGNED_VESSELS",
  "VIEW_ALL_ASSIGNED_VEHICLES",
  "VIEW_USERS",
  "VIEW_ROLES",
  "VIEW_DASHBOARD_MACHINERY_UTILIZATION",
  "VIEW_DASHBOARD_TRANSPORTS_UTILIZATION",
  "VIEW_DASHBOARD_MACHINERY_MAINTENANCE",
  "VIEW_DASHBOARD_TRANSPORTS_MAINTENANCE",
  "VIEW_DASHBOARD_MACHINERY_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_TRANSPORTS_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_MY_MACHINERY_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_MY_TRANSPORTS_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_STATUS_COUNT",
  "VERIFY_MACHINE_PERIODIC_MAINTENANCE",
  "VERIFY_TRANSPORTATION_PERIODIC_MAINTENANCE",
];

export const MACHINE_ADD_PERMISSIONS = [
  "ADD_MACHINE",
  "ADD_MACHINE_CHECKLIST",
  "ADD_MACHINE_PERIODIC_MAINTENANCE",
  "ADD_MACHINE_SPARE_PR",
  "ADD_MACHINE_REPAIR",
  "ADD_MACHINE_BREAKDOWN",
  "ADD_MACHINE_ATTACHMENT",
];

export const MACHINE_EDIT_PERMISSIONS = [
  "EDIT_MACHINE",
  "EDIT_MACHINE_CHECKLIST",
  "EDIT_MACHINE_PERIODIC_MAINTENANCE",
  "EDIT_MACHINE_SPARE_PR",
  "EDIT_MACHINE_REPAIR",
  "EDIT_MACHINE_BREAKDOWN",
  "EDIT_MACHINE_ATTACHMENT",
];
export const MACHINE_DELETE_PERMISSIONS = [
  "DELETE_MACHINE",
  "DELETE_MACHINE_CHECKLIST",
  "DELETE_MACHINE_PERIODIC_MAINTENANCE",
  "DELETE_MACHINE_SPARE_PR",
  "DELETE_MACHINE_REPAIR",
  "DELETE_MACHINE_BREAKDOWN",
  "DELETE_MACHINE_ATTACHMENT",
];

export const MACHINE_VIEW_PERMISSIONS = [
  "VIEW_ALL_MACHINES",
  "VIEW_MACHINE",
  "VIEW_ALL_ASSIGNED_MACHINES",
];

export const MACHINE_MISC_PERMISSIONS = [
  "ASSIGN_USER_TO_MACHINE",
  "UNASSIGN_USER_TO_MACHINE",
  "EDIT_MACHINE_USAGE",
  "VERIFY_MACHINE_PERIODIC_MAINTENANCE",
];


export const TRANSPORTATION_ADD_PERMISSIONS = [
  "ADD_TRANSPORTATION",
  "ADD_TRANSPORTATION_CHECKLIST",
  "ADD_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "ADD_TRANSPORTATION_SPARE_PR",
  "ADD_TRANSPORTATION_REPAIR",
  "ADD_TRANSPORTATION_BREAKDOWN",
  "ADD_TRANSPORTATION_ATTACHMENT",
];

export const TRANSPORTATION_EDIT_PERMISSIONS = [
  "EDIT_TRANSPORTATION",
  "EDIT_TRANSPORTATION_CHECKLIST",
  "EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "EDIT_TRANSPORTATION_SPARE_PR",
  "EDIT_TRANSPORTATION_REPAIR",
  "EDIT_TRANSPORTATION_BREAKDOWN",
  "EDIT_TRANSPORTATION_ATTACHMENT",
  "EDIT_TRANSPORTATION_USAGE",
];

export const TRANSPORTATION_DELETE_PERMISSIONS = [
  "DELETE_TRANSPORTATION",
  "DELETE_TRANSPORTATION_CHECKLIST",
  "DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE",
  "DELETE_TRANSPORTATION_SPARE_PR",
  "DELETE_TRANSPORTATION_REPAIR",
  "DELETE_TRANSPORTATION_BREAKDOWN",
  "DELETE_TRANSPORTATION_ATTACHMENT",
];

export const TRANSPORTATION_VIEW_PERMISSIONS = [
  "VIEW_ALL_VESSELS",
  "VIEW_ALL_VEHICLES",
  "VIEW_VESSEL",
  "VIEW_VEHICLE",
  "VIEW_ALL_ASSIGNED_VESSELS",
  "VIEW_ALL_ASSIGNED_VEHICLES",
];

export const TRANSPORTATION_MISC_PERMISSIONS = [
  "ASSIGN_USER_TO_TRANSPORTATION",
  "UNASSIGN_USER_TO_TRANSPORTATION",
  "EDIT_TRANSPORTATION_USAGE",
  "VERIFY_TRANSPORTATION_PERIODIC_MAINTENANCE",
];


export const DASHBOARD_PERMISSIONS = [
  "VIEW_DASHBOARD_MACHINERY_UTILIZATION",
  "VIEW_DASHBOARD_TRANSPORTS_UTILIZATION",
  "VIEW_DASHBOARD_MACHINERY_MAINTENANCE",
  "VIEW_DASHBOARD_TRANSPORTS_MAINTENANCE",
  "VIEW_DASHBOARD_MACHINERY_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_TRANSPORTS_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_MY_MACHINERY_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_MY_TRANSPORTS_PERIODIC_MAINTENANCE_TASK",
  "VIEW_DASHBOARD_STATUS_COUNT",
];

export const ROLE_PERMISSIONS = [
  "ADD_ROLE",
  "EDIT_ROLE",
  "DELETE_ROLE",
  "VIEW_ROLES",
  "ASSIGN_PERMISSION",
];

export const USER_PERMISSIONS = [
  "ADD_USER_WITH_ROLE",
  "EDIT_USER_ROLE",
  "EDIT_USER_LOCATION",
  "VIEW_USERS",
];


export const ISLANDS = [
  "HA. Thuraakunu",
  "HA. Uligamu",
  "HA. Molhadhoo",
  "HA. Hoarafushi",
  "HA. Ihavandhoo",
  "HA. Kelaa",
  "HA. Vashafaru",
  "HA. Dhidhdhoo",
  "HA. Filladhoo",
  "HA. Maarandhoo",
  "HA. Thakandhoo",
  "HA. Utheemu",
  "HA. Muraidhoo",
  "HA. Baarah",
  "HDh. Faridhoo",
  "HDh. Hanimaadhoo",
  "HDh. Finey",
  "HDh. Naivaadhoo",
  "HDh. Nellaidhoo",
  "HDh. Hirimaradhoo",
  "HDh. Nolhivaranfaru",
  "HDh. Nolhivaramu",
  "HDh. Kuribi",
  "HDh. Kuburudhoo",
  "HDh. Kulhudhuffushi",
  "HDh. Kumundhoo",
  "HDh. Neykurendhoo",
  "HDh. Vaikaradhoo",
  "HDh. Maavaidhoo",
  "HDh. Makunudhoo",
  "Sh. Noomaraa",
  "Sh. Kanditheemu",
  "Sh. Goidhoo",
  "Sh. Feydhoo",
  "Sh. Feevah",
  "Sh. Bilehffahi",
  "Sh. Foakaidhoo",
  "Sh. Narudhoo",
  "Sh. Milandhoo",
  "Sh. Maroshi",
  "Sh. Lhaimagu",
  "Sh. Funadhoo",
  "Sh. Komandoo",
  "Sh. Maaugoodhoo",
  "N. Henbadhoo",
  "N. Kendhikulhudhoo",
  "N. Velidhoo",
  "N. Maalhendhoo",
  "N. Kudafari",
  "N. Landhoo",
  "N. Maafaru",
  "N. Lhohi",
  "N. Miladhoo",
  "N. Magoodhoo",
  "N. Manadhoo",
  "N. Holhudhoo",
  "N. Fodhdhoo",
  "R. Alifushi",
  "R. Vaadhoo",
  "R. Rasgetheemu",
  "R. Angolhitheemu",
  "R. Hulhudhuffaaru",
  "R. Ugoofaaru",
  "R. Dhuvaafaru",
  "R. Maakurathu",
  "R. Rasmaadhoo",
  "R. Innamaadhoo",
  "R. Maduvvari",
  "R. Inguraidhoo",
  "R. Meedhoo",
  "R. Fainu",
  "R. Kinolhas",
  "B. Kudarikilu",
  "B. Kamadhoo",
  "B. Kendhoo",
  "B. Kihaadhoo",
  "B. Dhonfanu",
  "B. Dharavandhoo",
  "B. Maalhos",
  "B. Eydhafushi",
  "B. Thulhaadhoo",
  "B. Hithaadhoo",
  "B. Fulhadhoo",
  "B. Fehendhoo",
  "B. Goidhoo",
  "Lh. Hinnavaru",
  "Lh. Naifaru",
  "Lh. Kurendhoo",
  "Lh. Olhuvelifushi",
  "K. Kaashidhoo",
  "K. Gaafaru",
  "K. Dhiffushi",
  "K. Thulusdhoo",
  "K. Huraa",
  "K. Himmafushi",
  "K. Maafushi",
  "K. Gulhi",
  "K. Guraidhoo",
  "AA. Thoddoo",
  "AA. Rasdhoo",
  "AA. Ukulhas",
  "AA. Bodufolhudhoo",
  "AA. Mathiveri",
  "AA. Feridhoo",
  "AA. Maalhos",
  "AA. Himandhoo",
  "ADh. Hangnaameedhoo",
  "ADh. Omadhoo",
  "ADh. Mahibadhoo",
  "ADh. Kunburudhoo",
  "ADh. Dhangethi",
  "ADh. Dhigurah",
  "ADh. Dhidhdhoo",
  "ADh. Maamigili",
  "ADh. Fenfushi",
  "ADh. Mandhoo",
  "V. Fulidhoo",
  "V. Thinadhoo",
  "V. Felidhoo",
  "V. Keyodhoo",
  "V. Rakeedhoo",
  "M. Dhiggaru",
  "M. Maduvvari",
  "M. Raimandhoo",
  "M. Veyvah",
  "M. Mulah",
  "M. Muli",
  "M. Naalaafushi",
  "M. Kolhufushi",
  "F. Feeali",
  "F. Bileddhoo",
  "F. Magoodhoo",
  "F. Dharaboodhoo",
  "F. Nilandhoo",
  "Dh. Meedhoo",
  "Dh. Bandidhoo",
  "Dh. Rinbudhoo",
  "Dh. Hulhudheli",
  "Dh. Maaenboodhoo",
  "Dh. Kudahuvadhoo",
  "Th. Buruni",
  "Th. Vilufushi",
  "Th. Madifushi",
  "Th. Dhiyamigili",
  "Th. Guraidhoo",
  "Th. Kandoodhoo",
  "Th. Vandhoo",
  "Th. Hirilandhoo",
  "Th. Gaadhiffushi",
  "Th. Thimarafushi",
  "Th. Veymandoo",
  "Th. Kinbidhoo",
  "Th. Omadhoo",
  "L. Isdhoo",
  "L. Dhanbidhoo",
  "L. Maabaidhoo",
  "L. Mundoo",
  "L. Gan",
  "L. Kalaidhoo",
  "L. Maavah",
  "L. Fonadhoo",
  "L. Maamendhoo",
  "L. Hithadhoo",
  "L. Kunahandhoo",
  "GA. Kolamaafushi",
  "GA. Villingili",
  "GA. Maamendhoo",
  "GA. Nilandhoo",
  "GA. Dhaandhoo",
  "GA. Dhevvadhoo",
  "GA. Kondey",
  "GA. Gemanafushi",
  "GA. Kanduhulhudhoo",
  "GDh. Thinadhoo",
  "GDh. Madaveli",
  "GDh. Hoadedhdhoo",
  "GDh. Nadellaa",
  "GDh. Gadhdhoo",
  "GDh. Rathafandhoo",
  "GDh. Vaadhoo",
  "GDh. Fiyoari",
  "GDh. Faresmaathoda",
  "Gn. Fuvahmulah",
  "S. Hulhudhoo",
  "S. Hithadhoo",
  "S. Maradhoo",
  "S. Feydhoo",
  "S. Meedhoo",
  "S. Maradhoofeydhoo",
  "K. Malé",
  "Hulhumalé",
];
