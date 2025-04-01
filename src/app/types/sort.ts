import { Advocate } from "@custom-types/advocate";

export type SortDirection = "asc" | "desc";
export type SortKey = keyof Advocate | "";

export type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};
