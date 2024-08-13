export interface NotificationConfig<D = any>{
    enabled?: boolean; 
    recipients?: string[]; 
    successMessage?: string; 
    errorMessage?: string; 
    timeoutMessage?: string;
}

export const NotificationConfigDefault: NotificationConfig = {
    enabled: true, 
    recipients: [], 
    successMessage: "succeeded", 
    errorMessage: "failed", 
    timeoutMessage: "timed out",
};




