export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  // return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  // eslint-disable-next-line no-console
  // console.log(params);
  // return axios.get<TableData[]>('/api/popular/list', { params });
}
