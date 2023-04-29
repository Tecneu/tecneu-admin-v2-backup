interface Paging {
  offset: number;
  limit: number;
  items: number;
  total: number;
}

interface AvailableQuantity {
  available_quantity: number;
  tecneu_warehouse_id: string;
}

export interface Variation {
  picture_ids: string[];
  _id: string;
  sku: string;
  available_quantity: AvailableQuantity[];
  attribute_name: string;
  value_name: string;
  cost: number;
}

interface Price {
  price: number;
  price_type: string;
}

export interface Picture {
  id: string;
  url: string;
  size?: string;
}

interface TecneuWarehouseBinsInfo {
  _id: string;
  bin: number;
  level: number;
  tecneu_warehouse_bay_id: TecneuWarehouseBayId;
}

interface WeightDetails {
  weight: number;
  unit: string;
}

export interface TecneuItem {
  status: string;
  tecneu_warehouse_bin_ids: string[];
  _id: string;
  business_id: string;
  title: string;
  sku: string;
  available_quantity: AvailableQuantity[];
  variations: Variation[];
  prices: Price[];
  cost: number;
  thumbnail_id: string;
  thumbnail: string;
  pictures: Picture[];
  weight_details: WeightDetails;
  tecneu_warehouse_bins_info: TecneuWarehouseBinsInfo[];
}

export interface GetTecneuItemsInterface {
  paging: Paging;
  items: TecneuItem[];
}

export interface ItemsTreeDataInterface {
  expandable: boolean,
  level: number,
  isExpanded?: boolean;
  item?: Partial<TecneuItem>;
  costs_and_profits?: Record<string, any>;
  variation?: Partial<Variation>;
}

export interface TecneuWarehouseRackId {
  _id: string;
  rack: string;
  tecneu_warehouse_id: string;
}

export interface TecneuWarehouseBayId {
  _id: string;
  bay: number;
  tecneu_warehouse_rack_id: TecneuWarehouseRackId;
}

interface TecneuWarehouseBin2 {
  _id: string;
  bin: number;
  level: number;
  tecneu_warehouse_bay_id: TecneuWarehouseBayId;
}

export interface TecneuWarehouseBin {
  _id: string;
  name: string;
  bins: TecneuWarehouseBin2[];
}

export interface GetTecneuItemById extends TecneuItem {
  tecneu_warehouses: TecneuWarehouseBin[];
}

export interface GetTecneuItemVariationsCanBeAdded {
  tecneu_item?: GetTecneuItemById,
  variationsCanBeAdded: boolean
}
