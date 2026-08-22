declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface Permissions {
  employees: { create: boolean; read: boolean; update: boolean; delete: boolean };
  revenues: { create: boolean; read: boolean; update: boolean; delete: boolean };
  users: { create: boolean; read: boolean; update: boolean; delete: boolean };
  collections: { create: boolean; read: boolean; update: boolean; delete: boolean };
  office_reports?: { create: boolean; read: boolean; update: boolean; delete: boolean };
  freezed_collections?: { create: boolean; read: boolean; update: boolean; delete: boolean };
  dashboard: { access: boolean };
  control_panel: { access: boolean };
};

/** Resources that have CRUD permissions (used by usePermissions / PermissionGate). */
type CrudResource =
  | "employees"
  | "revenues"
  | "users"
  | "collections"
  | "office_reports"
  | "freezed_collections";

// ---- Server-side pagination -------------------------------------------------
type SortOrder = "asc" | "desc";

/** Envelope returned by every paginated list endpoint. */
type Paginated<T> = { data: T[]; total: number; page: number; limit: number };

type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  /** true = return the full list (dropdowns) in the same envelope */
  all?: boolean;
};

type EmployeeListParams = PaginationParams & { office_id?: number | null };
type RevenueListParams = PaginationParams & {
  office_id?: number | null;
  employee_id?: number | null;
  destination_id?: number | null;
  currency_id?: number | null;
  date_from?: string;
  date_to?: string;
  /** Compared against the raw stored revenue_amount */
  amount_min?: number;
  amount_max?: number;
};
/** GET /revenues/dashboard params (charts/KPIs use all:true, table uses page/limit). */
type DashboardRevenueParams = RevenueListParams & {
  currency_type?: CurrencyType;
};
/** Row shape returned by GET /revenues/dashboard */
type DashboardRevenueRow = {
  id: number;
  date: string; // YYYY-MM-DD
  notes: string | null;
  /** raw amount as entered */
  revenue_amount: number;
  /** OTHERS ÷ rate, USD/LBP raw — for KPIs + tables */
  display_amount: number;
  /** USD units for charts: USD raw, LBP ÷ rate, OTHERS ÷ rate */
  chart_amount: number;
  /** legend label: currency name, "لورال" for LBP, "عملات أخرى" for OTHERS */
  chart_series: string;
  employee: { id: number; name: string };
  office: { id: number; name: string };
  destination: { id: number; name: string };
  currency: { id: number; name: string; code: string; currency_type: CurrencyType; rate: number };
};
type DashboardRevenuesResponse = Paginated<DashboardRevenueRow> & {
  meta: { lbp_rate: number | null };
};
type CollectionListParams = PaginationParams & {
  office_id?: number | null;
  employee_id?: number | null;
  date_from?: string;
  date_to?: string;
  collection_type?: CollectionType;
};
type FreezedCollectionListParams = CollectionListParams;
type UserListParams = PaginationParams;
type OfficeReportListParams = PaginationParams & {
  office_id?: number | null;
  employee_id?: number | null;
  date_from?: string;
  date_to?: string;
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
  office_id: number | null; // null = access to all offices
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
  rate: number;
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
  office_id?: number;
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
  officeId?: number; // omitted = access to all offices
  permissionGroupId: number;
};

type UpdateUserRequest = {
  name?: string;
  username?: string;
  password?: string;
  officeId?: number;
  permissionGroupId?: number;
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
  email?: string;
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
  currency?: { id: number; name: string; code: string; currency_type: CurrencyType; rate: number };
  created_at?: string;
  updated_at?: string;
};

interface RevenueRecord {
  id: number;
  employeeName: string;
  office: string;
  destination: string;
  currency: string;
  date: string;
  revenueAmount: number;
  notes: string;
}


enum CollectionType {
  SPONSORSHIP = "SPONSORSHIP",
  BOX = "BOX",
}

enum CurrencyType {
  USD = "USD",
  LBP = "LBP",
  OTHERS = "OTHERS",
}

/** Same shape as Collection — independent table/endpoint (/freezed-collections). */
type FreezedCollection = Collection;

type OfficeReport = {
  id?: number;
  date: string; // YYYY-MM-DD
  employee_id: number;
  description: string;
  employee?: { id: number; name: string; office_id?: number; office?: { id: number; name: string } };
  created_at?: string;
  updated_at?: string;
};

type Collection = {
  id?: number;
  employee_id: number;
  office_id: number;
  collection_type: CollectionType;
  date: string;
  count: number;
  notes?: string | null;
  employee?: { id: number; name: string };
  office?: { id: number; name: string };
  user?: { id: number; name: string; username: string };
  employeeName?: string;
  officeName?: string;
  userName?: string;
  created_at?: string;
  updated_at?: string;
};
