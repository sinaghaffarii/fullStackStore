export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  children?: ICategory[];
}
