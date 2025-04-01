export type ExperienceRange = {
  min: number;
  max: number;
};

export type Filter = {
  experience?: ExperienceRange;
  cities?: string[];
  degrees?: string[];
  specialties?: string[];
};
