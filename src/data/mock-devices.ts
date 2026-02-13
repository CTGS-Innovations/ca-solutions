import { Device } from "@/types";

export const mockDevices: Device[] = [
  {
    id: "dev-001",
    type: "laptop",
    make: "Dell",
    model: "Latitude 5530",
    serial: "DL5530-X9K2M",
    conditionNotes: "Small scratch on lid, otherwise good condition",
  },
  {
    id: "dev-002",
    type: "laptop",
    make: "Apple",
    model: 'MacBook Pro 14"',
    serial: "C02YN1QAML7H",
    conditionNotes: "Pristine condition, includes charger",
  },
  {
    id: "dev-003",
    type: "desktop",
    make: "HP",
    model: "Pavilion Desktop TP01",
    serial: "HP-TP01-8832K",
    conditionNotes: "Dust buildup, missing side panel screw",
  },
  {
    id: "dev-004",
    type: "tablet",
    make: "Microsoft",
    model: "Surface Pro 9",
    serial: "MS-SP9-44R2N",
    conditionNotes: "Type Cover included, minor screen smudges",
  },
];
