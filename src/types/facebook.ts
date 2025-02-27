export interface FacebookLead {
  id: string;
  created_time: string;
  ad_id: string;
  form_id: string;
  field_data: {
    name: string;
    value: string;
  }[];
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

export interface FacebookForm {
  id: string;
  name: string;
  status: string;
  leads_count: number;
}

export interface FacebookConfig {
  accessToken: string;
  pageId: string;
  formId: string;
  syncInterval: number;
  fieldMapping?: Record<string, string>;
  webhookSecret?: string;
}

export interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}