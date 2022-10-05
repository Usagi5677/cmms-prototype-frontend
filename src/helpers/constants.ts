export const PAGE_LIMIT = 10;

export const DATETIME_FORMATS = {
  FULL: "DD MMMM YYYY HH:mm:ss",
  SHORT: "D MMM H:mm",
  DAY_MONTH: "DD MMM",
  DAY_MONTH_YEAR: "DD MMM YYYY",
  TIME: "HH:mm",
};

export const DEPARTMENTS = [
  "LTD",
  "MTD",
  "TRD",
  "LOD",
  "MBD",
  "CDD",
  "CEO",
  "MTND",
  "RMD",
  "BDAD",
  "Corporate",
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
  "Sh. Bileffahi",
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
  "R. Ungoofaaru",
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
  "Thilafushi Repair Yard",
  "GMTL",
  "S. Hulhumeedhoo",
  "K. Thilafushi",
  "K. Bandos",
  "Precast/Thilafushi",
  "K. Kuda Giri Picnic Island",
  "Lh. Felivaru",
  "Barge (Atha)",
  "Kurimagu 12 (Dh. Hulhudheli)",
  "K. Kuda Giri",
  "K. Girifushi",
  "Hulhumalé Bus Depot",
  "Thilafushi Carriageway",
  "Barge (Kurimagu 4)",
  "Warehouse",
  "Gulf Lagoon (J2)",
  "Jarrafa2",
  "Jarraafa-IV (J-4)",
];

export const ENTITY_TYPES = ["Machine", "Vehicle", "Vessel", "Sub Entity"];

export const REPAIR_LOCATION = ["Site", "Workshop"];

export const ENTITY_ASSIGNMENT_TYPES = ["Admin", "Engineer", "Technician", "User"] as const;

export const BRAND = [
  "CAT",
  "KRISHNA",
  "VINEYAK",
  "ISUZU",
  "UD",
  "Winget 200T",
  "Winget 100T",
  "Winget 400R",
  "Winget 500R",
  "XCMG-XS123",
  "KOBELCO",
  "XCMG",
  "XCMG-XD102",
  "NISSAN",
  "NISSAN UD",
  "DONG FENG",
  "FUSO",
  "MAN",
  "ASHOK LAYLAND",
  "Bharat Benz",
  "AUSA",
  "XCMG-GR1603",
  "Wave 110S",
  "wave 125s",
  "Yamaha NT",
  "Yamaha",
  "HONDA",
  "DENYO",
  "POWERIKA/Isuzu6BD1GL-01Denyo",
  "Yanmar",
  "MCWEL",
  "TOYOTA",
  "XCMG/XP163",
  "XCMG-RP453L",
  "SURELA",
  "JCB /VM330",
  "Greave Cotton Ltd",
  "Vinayak",
  "JCB",
  "SUZUKI",
  "CATERPILLAR",
  "VOLVO",
  "LANKA ASHOK LEYLAND",
  "YUTONG",
  "MAZDA",
  "YAMAHA 250HP",
  "SUZUKI 325HP",
  "YANMAR 250 HP",
  "DUSSAN ENGINE",
];

export const ENGINE = ["STBD", "CTR", "PORT"];

// 10 MB
export const MAX_FILE_SIZE = 10 * 1000000;
