import { Epoch } from "./epoch.types";
import { Organization } from "./organization.types";

export interface User {
  id?: string;
  address?: string;
  nickname: string;
  primaryRol?: string;
  roles? : string[];
  isActive? : boolean;
  lastUpdateBy?: User;
  organizations?: Organization[];
  epochs?: Epoch[];
}