import { AxiosRequestConfig } from 'axios';

export interface IAxiosRequestExtended extends AxiosRequestConfig {
  dataServer: string,
  userName: string,
  userPassword: string,
  knowledgeVault: string
}
