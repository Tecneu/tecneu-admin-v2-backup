import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {
  IAmazonItem,
  IGetAmazonItems,
  IUpdateAllAmazonItems,
  TecneuItemRelationship
} from "../models/get-amazon-items.interface";

const API_AMAZON_URL = `${environment.apiBaseUrl}/amazon`;

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  constructor(private http: HttpClient) {
  }

  getAmazonItems(offset?: number, limit?: number, query?: string) {
    const url = `${API_AMAZON_URL}/local_items`;

    const fromObject: any = {
      offset,
      limit
    };
    if (query) {
      fromObject.q = query;
    }
    const params = new HttpParams({fromObject});

    // console.log(fromObject);

    return this.http.get<IGetAmazonItems>(url, {params});
  }

  getAmazonItem(amazon_product_id: string) {
    const url = `${API_AMAZON_URL}/local_items/${amazon_product_id}`;

    return this.http.get<IAmazonItem>(url);
  }

  updateAllAmazonItems() {
    const url = `${API_AMAZON_URL}/local_items/update_all`;

    return this.http.put<IUpdateAllAmazonItems>(url, {});
  }

  updateAmazonItemRelationships(amazon_item_id: string, relationships: TecneuItemRelationship[]) {
    const url = `${API_AMAZON_URL}/local_items/${amazon_item_id}`;

    return this.http.put<IAmazonItem>(url, {relationships});
  }
}
