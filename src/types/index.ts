export class BaseDTO {
  [key: string]: any;
  type: string;
  removeKey: boolean;
  timesToRepeat?: number;
  id: string;
  value: any;

  constructor ({ type, timesToRepeat, removeKey, id, value }: { type?: string; timesToRepeat?: number; removeKey?: boolean; id?: string; value?: any } = {}) {
    this.type = type ?? '';
    this.id = id ?? '';
    this.removeKey = removeKey ?? false;
    this.value = value ?? {};
    if (timesToRepeat) {
      this.timesToRepeat = timesToRepeat;
    }
  }
}

export interface BaseResponseDTO {
  endpoints: BaseDTO;
}
