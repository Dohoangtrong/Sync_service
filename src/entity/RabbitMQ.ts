import { NotificationConfig, NotificationConfigDefault } from "./Notification";

export interface RabbitMQConfig<D = any> {
    protocol: string;
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost?: string;
    clientProperties?: any;
    additionalConfig?: D;
    notificationConfig?: NotificationConfig;
}

export class RabbitMQ<D = any> {
    config: RabbitMQConfig<D>;

    constructor(config?: Partial<RabbitMQConfig<D>>) {
        const defaultConfig: RabbitMQConfig = {
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username: "guest",
            password: "guest",
        };

        this.config = {
            ...defaultConfig,
            notificationConfig: {
                ...NotificationConfigDefault,
                ...config?.notificationConfig,
            },
            ...config,
        } as RabbitMQConfig<D>;
    }

    getRabbitMQConfig(): RabbitMQConfig<D> {
        return this.config;
    }

}



