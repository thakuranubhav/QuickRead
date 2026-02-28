export interface Article {
  uuid: string;
  title: string;
  description?: string;
  url?: string;
  image_url?: string;
  [key: string]: any;
}
