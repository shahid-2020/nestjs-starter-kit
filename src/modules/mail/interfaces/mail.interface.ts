export interface SendMailOptions {
  to: string;
  from: string;
  template: string;
  subject: string;
}

export interface SendMailContext {
  [name: string]: any;
}
