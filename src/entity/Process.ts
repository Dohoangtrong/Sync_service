export interface ProcessBasicCredentials {
    username: string;
    password: string;
}

export interface ProcessCredentials {
    username: string;
    password: string;
    secret_key: string;
}

export interface AxiosDefaults<D = any> extends Omit<ProcessConfig<D>, 'headers'> {
    headers: string;
}

export class Process{
  private config : ProcessConfig | undefined;
  constructor(config?: ProcessConfig){
    this.config = config
  };
}

export interface ProcessConfig<D = any> {
    url?: string;
}