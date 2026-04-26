declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface Permissions {
  employees: { create: boolean; read: boolean; update: boolean; delete: boolean };
  revenues: { create: boolean; read: boolean; update: boolean; delete: boolean };
  users: { create: boolean; read: boolean; update: boolean; delete: boolean };
  dashboard: { access: boolean };
  control_panel: { access: boolean };
};

type OfficeAssignment = {
  office_id: number;
  office_name: string;
};

type DecodedToken = {
  sub: number;
  username: string;
  is_admin: boolean;
  permissions: Permissions;
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
  permissions: Permissions;
  created_at?: string;
  updated_at?: string;
};

type User = {
  id?: number;
  name: string;
  username: string;
  permission_group_id?: number;
  permission_group_name?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

type OfficeUser = {
  id?: number;
  user_id: number;
  office_id: number;
  user?: User;
  office?: Office;
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
};

type CreateUserRequest = {
  name: string;
  username: string;
  password: string;
};

type UpdateUserRequest = {
  username?: string;
  password?: string;
};

type Employee = {
  id?: number;
  name: string;
  gender: string;
  date_of_birth: string;
  born_in: string;
  blood_type: string;
  family_status: string;
  office_id: number;
  number_of_children: number;
  phone: string;
  email: string;
  lives_in: string;
  address: string;
  insurance: boolean;
  insurance_number: string;
  contract_type: string;
  first_employment_date: string;
  job_title_id: number;
  education_level_id: number;
  salary: number;
  notes?: string;
  office?: { id: number; name: string; address: string; city_id: number };
  job_title?: { id: number; name: string };
  education_level?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
};

type Revenue = {
  id?: number;
  employee_id: number;
  office_id: number;
  destination_id: number;
  currency_id: number;
  date: string;
  revenue_amount: number;
  notes?: string;
  employee?: { id: number; name: string };
  office?: { id: number; name: string };
  destination?: { id: number; name: string };
  currency?: { id: number; name: string; code: string };
  created_at?: string;
  updated_at?: string;
};
