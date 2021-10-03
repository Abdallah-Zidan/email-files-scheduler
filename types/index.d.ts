export interface IEmail {
  subject: string;
  content: string;
  cc?: string;
}

export interface IConfig {
  emailUser: string;
  emailPassword: string;
  emailHost: string;
  emailPort: number;
  emailSecure: boolean;
  emailFrom: string;
  emailTo: string | string[];
  emailFilesDir: string;
  maxAttempts: number;
  failedEmailsTracker: string;
  jobInterval: number;
}
