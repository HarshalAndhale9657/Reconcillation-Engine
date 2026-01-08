import { EachMessagePayload, KafkaConfig } from 'kafkajs';
import { KafkaManager } from './KafkaManager'

const kafkaConfig: KafkaConfig = { clientId: 'ingestion-service', brokers: ['localhost:9092'] };
const kafkaManager = new KafkaManager(kafkaConfig);
export const init = async () => {
    // Admin operations
    await kafkaManager.connectAdmin();
    await kafkaManager.createTopics([
        { topic: 'BANK', numPartitions: 2, replicationFactor: 1 },
        { topic: 'GATEWAY', numPartitions: 2, replicationFactor: 1 },
        { topic: 'APP', numPartitions: 2, replicationFactor: 1 }
    ]);


    // await kafkaManager.deleteTopics([
    //     'BANK',
    //     'GATEWAY',
    //     'APP'
    // ])
    await kafkaManager.connectProducer();
};
let producerConnected = false;

export const connectProducer = async () => {
    if (!producerConnected) {
        await kafkaManager.connectProducer();
        producerConnected = true;
    }

}
export const produceMessage = async (data: any, topic: 'BANK' | 'GATEWAY' | 'APP') => {
    await connectProducer()
    await kafkaManager.initializeProducer(topic, data);

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