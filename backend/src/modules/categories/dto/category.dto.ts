export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
}
