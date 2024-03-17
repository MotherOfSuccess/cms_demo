import { BannerEntity } from '../../../entities/banner.entity';
import { isActiveDate, returnObjectWithPagination } from '../../../utils';
import { BannerResponse } from '../interfaces/banner-response.interface';

export const generateResponseBanner = (
  pages: number,
  page: number,
  banner: BannerEntity[],
) => {
  const payload: BannerResponse[] = [];
  if (banner && banner.length > 0) {
    for (const item of banner) {
      const temp: BannerResponse = {
        id: item.id,
        startAt: item.startAt,
        endAt: item.endAt,
        status: isActiveDate(item.startAt, item.endAt),
        title: item.banner_languages[0].title,
        slug: item.banner_languages[0].slug,
      };
      payload.push(temp);
    }
  }
  return returnObjectWithPagination<BannerResponse>(page, pages, payload);
};
