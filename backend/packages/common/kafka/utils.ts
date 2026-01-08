import { EachMessagePayload, KafkaConfig } from 'kafkajs';
import {KafkaManager} from './KafkaManager'

const kafkaConfig: KafkaConfig = { clientId: 'ingestion-service', brokers: ['localhost:9092'] };
const kafkaManager = new KafkaManager(kafkaConfig);
export const init = async () => {
    // Admin operations
    await kafkaManager.connectAdmin();
    await kafkaManager.createTopics([{ topic: 'topic', numPartitions: 2, replicationFactor: 1 }]);
    await kafkaManager.connectProducer();
    // await kafkaManager.deleteTopics(['topic']);
    // await kafkaManager.disconnectAdmin();
    // // Consumer operations
    // const eachMessageHandler = async (payload: EachMessagePayload) => {
    //     const { topic, partition, message } = payload;
    //     console.log({
    //         topic,
    //         partition,
    //         key: message.key?.toString(),
    //         value: message.value?.toString(),
    //     });
    // };
    // await kafkaManager.initializeConsumer('consumer', 'group-Id', eachMessageHandler);
    // await kafkaManager.disconnectConsumer('consumer');
};
export const produceMessage = async (data: any) => {
    await kafkaManager.connectProducer();
    await kafkaManager.initializeProducer('yur-topic', data);
    await kafkaManager.disconnectProducer();
};
export const consumeMessages = async (topic: string, groupId: string) => {
    const eachMessageHandler = async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log({
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value?.toString(),
        });
    };
    await kafkaManager.initializeConsumer(topic, groupId, eachMessageHandler);
}
export const disconnectKafka = async () => {
    await kafkaManager.disconnectAdmin();
    await kafkaManager.disconnectProducer();
    await kafkaManager.disconnectConsumer('topic-name');
}