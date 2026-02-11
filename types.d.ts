declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

type OfficePermissions = {
  employees: { create: boolean; read: boolean; update: boolean; delete: boolean };
  revenues: { create: boolean; read: boolean; update: boolean; delete: boolean };
  users: { create: boolean; read: boolean; update: boolean; delete: boolean };
  dashboard: { access: boolean };
  control_panel: { access: boolean };

};

type OfficeAssignment = {
  office_id: number;
  office_name: string;
  permission_group_id: number;
  permission_group_name: string;
  permissions: OfficePermissions;
};

type DecodedToken = {
  sub: number;
  username: string;
  is_admin: boolean;
  office_ids: number[];
  offices: OfficeAssignment[];
  iat: number;
  exp: number;
};

type LoginType = {
  username: string;
  password: string;
};

type LoginFormData = {
  username: string;
  password: string;
};

interface CrudApi {
  CREATE: string;
  GET: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
}

type Destination = {
  id?: number;
  name: string;
};

type EducationLevel = {
  id?: number;
  name: string;
};

type JobTitle = {
  id?: number;
  name: string;
};

type Governorate = {
  id?: number;
  name: string;
};

type District = {
  id?: number;
  name: string;
  governorate_id: number;
};

type City = {
  id?: number;
  name: string;
  district_id: number;
};

type Office = {
  id?: number;
  name: string;
  address: string;
  city_id: number;
};

type Currency = {
  id?: number;
  name: string;
  code: string;
};

type PermissionGroup = {
  id?: number;
  name: string;
  permissions: OfficePermissions;
  created_at?: string;
  updated_at?: string;
};

type User = {
  id?: number;
  username: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

type OfficeUser = {
  id?: number;
  user_id: number;
  office_id: number;
  permission_group_id: number;
  user?: User;
  office?: Office;
  permission_group?: PermissionGroup;
  created_at?: string;
  updated_at?: string;
};
type OfficeUserByUserId = {
  offices_Ids: number[];
  permission_group_id: number;
};

type AssignOfficesRequest = {
  user_id: number;
  office_ids: number[];
  permission_group_id: number;
};

type CreateUserRequest = {
  username: string;
  password: string;
};

type UpdateUserRequest = {
  username?: string;
  password?: string;
};