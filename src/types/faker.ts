export interface FakerList {
  [x: string]: any;
  [index: number]: FakerItem[];
}

export interface FakerItem {
  value: string;
}
