export interface Product {
  imageUrl: string;
  productName: string;
  productId: string;
  stock: number;
  stockDetail?: string;
  price: number;
  totalCostOfSales: {
    COGS: number;
    shippingFee: number;
    commissionFee: number;
    others?: number;
  };
  // profit: {
  //   grossProfit: number;
  //   grossProfitMargin: number;
  // };
}

