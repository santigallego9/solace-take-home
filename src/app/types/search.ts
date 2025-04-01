import { Advocate } from "@custom-types/advocate";
import { SortConfig } from "@custom-types/sort";
import { ExperienceRange } from "@custom-types/filter";

export type SearchParams = {
  search?: string;
  cities?: string[];
  degrees?: string[];
  specialties?: string[];
  experience?: ExperienceRange;
  page?: number;
  limit?: number;
  sortConfig?: SortConfig;
};

export type SearchResponse = {
  data: Advocate[];
  total: number;
  page: number;
  limit: number;
};
