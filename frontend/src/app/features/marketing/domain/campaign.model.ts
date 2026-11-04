export type CampaignType = 'offer' | 'release' | 'season';
export type CampaignCtaAction = 'filter' | 'route' | 'url';

export interface CampaignCta {
  label: string;
  action: CampaignCtaAction;
  value: string;
}

export interface CampaignSlide {
  id: number;
  theme?: 'blue';
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  order: number;
  startsAt?: string;
  endsAt?: string;
  cta?: CampaignCta;
}

export interface Campaign {
  id: number;
  theme?: 'blue';
  name: string;
  type: CampaignType;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  order: number;
  slides: CampaignSlide[];
}
