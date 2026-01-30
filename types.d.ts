declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
type DecodedToken = { username: string; sub: number; iat: number; exp: number };

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
