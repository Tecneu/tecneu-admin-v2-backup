import {AuthModel} from './auth.model';
import {Business} from "../../tecneu/models/business.model";
import {Warehouse} from "../../tecneu/models/warehouse.interface";

export class UserModel extends AuthModel {
  _id: string;
  password: string;
  name: string;
  email: string;
  status: string;
  image: string;
  business_id: string;
  mercadolibre_user_id: string;
  amazon_user_id: string;
  default_warehouse_id: string;

  contact_information: {
    email: string;
    phone: string;
    seller_name: string;
  };

  roles: string[];
  date_created: Date;
  last_updated: Date;

  business?: Partial<Business>;
  warehouse?: Partial<Warehouse>;

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this._id = user._id;
    this.name = user.name || '';
    this.password = user.password || '';
    this.email = user.email || '';
    this.image = user.image || './assets/media/avatars/blank.png';
    this.default_warehouse_id = user.default_warehouse_id || '';
    this.contact_information = user.contact_information || '';
  }
}

// class NewPassword {
//   current_password: string;
//   new_password: string;
// }
//
// export class UserNewPassword extends UserModel {
//   new_password: NewPassword;
//
//   constructor(user: Partial<UserNewPassword>) {
//     super(user);
//     this.new_password = user.new_password || new NewPassword();
//   }
// }
//
// export class GetUserById extends UserModel {
//   business: Partial<Business>;
//   warehouse: Partial<Warehouse>;
//
//   constructor(user: Partial<GetUserById>) {
//     super(user);
//     this.business = user.business || {};
//     this.warehouse = user.warehouse || {};
//   }
// }
