export interface CategoryAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryCreationAttributes
  extends Omit<
    CategoryAttributes,
    'created_at' | 'id' | 'is_active' | 'sort_order' | 'updated_at'
  > {
  sort_order?: number;
  is_active?: boolean;
}
