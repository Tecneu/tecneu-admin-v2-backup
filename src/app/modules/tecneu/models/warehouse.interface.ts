export interface Warehouse {
  status: string;
  _id: string;
  name: string;
  business_id: string;
  zip_code_id: string;
  neighborhood: string;
  street: string;
  ex_number: string;
  in_number?: any;
}

export interface GetWarehouses {
  warehouses: Warehouse[];
  default_warehouse_id: string;
}

export interface Bin {
  _id: string;
  bin: number;
  level: number;
  tecneu_warehouse_bay_id: string;
}

export interface Bay {
  _id: string;
  bay: number;
  levels: number;
  tecneu_warehouse_rack_id: string;
  bins: Bin[];
}

export interface Rack {
  _id: string;
  rack: string;
  tecneu_warehouse_id: string;
  bays: Bay[];
}

export interface GetWarehouseLocations extends Warehouse {
  status: string;
  _id: string;
  name: string;
  business_id: string;
  zip_code_id: string;
  neighborhood: string;
  street: string;
  ex_number: string;
  racks: Rack[];
}
