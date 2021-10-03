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
  emailTo: { [type: string]: string | string[] };
  emailFilesDir: string;
  maxAttempts: number;
  failedEmailsTracker: string;
  jobInterval: number;
  removeSent: boolean;
  getToAddresses: (subject: string) => string | string[];
}
