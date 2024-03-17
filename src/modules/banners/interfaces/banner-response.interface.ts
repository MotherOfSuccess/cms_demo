export interface BannerResponse {
  id: string;
  startAt: Date;
  endAt: Date;
  status: boolean;
  title: string;
  slug?: string;
  fileID?: string;
}
