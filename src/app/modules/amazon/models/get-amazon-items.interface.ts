import {TecneuItem} from "../../tecneu/models/get-tecneu-items.interface";

interface Paging {
  offset: number;
  limit: number;
  items: number;
  total: number;
}

interface BrowseClassification {
  displayName: string;
  classificationId: string;
}

export interface Summary {
  marketplaceId: string;
  brand: string;
  browseClassification: BrowseClassification;
  itemClassification: string;
  itemName: string;
  manufacturer: string;
  websiteDisplayGroup: string;
  websiteDisplayGroupName: string;
  modelNumber: string;
  partNumber: string;
  packageQuantity?: number;
  color: string;
}

interface ProductType {
  marketplaceId: string;
  productType: string;
}

export interface Image2 {
  variant: string;
  link: string;
  height: number;
  width: number;
}

export interface Image {
  marketplaceId: string;
  images: Image2[];
}

interface Identifier2 {
  identifierType: string;
  identifier: string;
}

interface Identifier {
  marketplaceId: string;
  identifiers: Identifier2[];
}

interface ListingPrice {
  currency_code: string;
  amount: number;
}

interface LandedPrice {
  currency_code: string;
  amount: number;
}

interface Shipping {
  currency_code: string;
  amount: number;
}

interface BuyingPrice {
  listing_price: ListingPrice;
  landed_price: LandedPrice;
  shipping: Shipping;
}

interface TotalFeesEstimate {
  currency_code: string;
  amount: number;
}

interface FulfillmentAvailability {
  fulfillment_channel: string;
  quantity: number;
}

export interface CostAndProfitsByProduct {
  profit_percent: string;
  profit: string;
  color_of_profit: string;
  product_cost: string;
  price: string;
  available_quantity: number;
  sale_fee_amount: string;
  landed_price: string;
  shipping: string;
}

export interface ItemsTreeDataInterface {
  expandable: boolean,
  level: number,
  isExpanded?: boolean;
  product?: Partial<IAmazonItem>;
  costs_and_profits?: CostAndProfitsByProduct;
  // model?: Partial<Model>;
  // tier_variation?: Partial<OptionList>;
  // tier_variation_name?: string;
}

export interface TecneuItemRelationship {
  tecneu_item_id: string;
  tecneu_item_variation_id?: string;
  quantity: number;
  relationship_type: string;
  tecneu_item?: TecneuItem;
}

export interface IAmazonItem {
  _id: string;
  amazon_user_id: string;
  asin: string;
  seller_sku: string;
  summaries: Summary[];
  productTypes: ProductType[];
  images: Image[];
  identifiers: Identifier[];
  fulfillment_availability: FulfillmentAvailability;
  merchant_shipping_group: string;
  status: string;
  open_date: Date;
  tecneu_item_relationships: TecneuItemRelationship[];
  buying_price: BuyingPrice;
  total_fees_estimate: TotalFeesEstimate;
  has_tecneu_item_relationships: boolean;
}

export interface IGetAmazonItems {
  paging: Paging;
  items_without_tecneu_item_relationships: IAmazonItem[];
  items_with_partial_tecneu_item_relationships: IAmazonItem[];
  items: IAmazonItem[];
}

export interface IUpdateAllAmazonItems {
  new_products: IAmazonItem[];
  updated_products: IAmazonItem[];
}
