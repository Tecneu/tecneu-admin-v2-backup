interface TaxData {
  name: string;
  rfc: string;
  zip_code_id: string;
  neighborhood: string;
  street: string;
  ex_number: string;
  logo_url: string;
}

export interface Business {
  _id: string;
  name: string;
  mercadolibre_user_id: string;
  amazon_user_id: string;
  __v: number;
  tax_data: TaxData;
}
