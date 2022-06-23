import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {

    constructor(private readonly configService: ConfigService){};

    getOptions (_queue : string, noAck = true): RmqOptions {

        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URI')],
                queue: this.configService.get<string>(`RABBIT_MQ_${_queue}_QUEUE`),
                noAck,
                queueOptions : {
                    durable : true 
                },
            },

        }


    }
}
