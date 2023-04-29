import {Injectable} from '@angular/core';

interface AnyObject {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ArrayUtilsService {
  hasMin<T extends AnyObject>(array: T[], attrib: string): T | null {
    return (
      (array.length &&
        array.reduce((prev, curr) => {
          return prev[attrib] < curr[attrib] ? prev : curr;
        })) ||
      null
    );
  }

  hasMax<T extends AnyObject>(array: T[], attrib: string): T | null {
    return (
      (array.length &&
        array.reduce((prev, curr) => {
          return prev[attrib] > curr[attrib] ? prev : curr;
        })) ||
      null
    );
  }
}
