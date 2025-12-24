export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parent_id: string | null;
  sort_order?: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}
