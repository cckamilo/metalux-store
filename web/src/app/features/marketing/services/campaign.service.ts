import { Injectable } from '@angular/core';
import { campaigns } from '../data/campaigns.mock';
import { Campaign, CampaignSlide } from '../domain/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly campaigns = campaigns;

  getHomeCarouselSlides(now = Date.now()): CampaignSlide[] {
    return this.getActiveCampaigns(now)
      .filter(campaign => campaign.slides.length > 0)
      .sort((first, second) => first.order - second.order)
      .flatMap(campaign => campaign.slides
        .sort((first, second) => first.order - second.order)
        .map(slide => ({
          ...slide,
          theme: campaign.theme,
          startsAt: campaign.startsAt,
          endsAt: campaign.endsAt
        })));
  }

  getActiveCampaigns(now = Date.now()): Campaign[] {
    return this.campaigns.filter(campaign => {
      if (!campaign.isActive) {
        return false;
      }

      const startsAt = campaign.startsAt ? new Date(campaign.startsAt).getTime() : -Infinity;
      const endsAt = campaign.endsAt ? new Date(campaign.endsAt).getTime() : Infinity;

      return now >= startsAt && now <= endsAt;
    });
  }
}