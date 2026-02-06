export interface IAdmin {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateAdminDto {
  id: string;
  email?: string;
}
