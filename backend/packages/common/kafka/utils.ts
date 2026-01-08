import { EachMessagePayload, KafkaConfig } from 'kafkajs';
import { KafkaManager } from './KafkaManager'

const kafkaConfig: KafkaConfig = { clientId: 'ingestion-service', brokers: ['localhost:9092'] };
const kafkaManager = new KafkaManager(kafkaConfig);
export const init = async () => {
    // Admin operations
    await kafkaManager.connectAdmin();
    await kafkaManager.createTopics([{ topic: 'BANK_STATEMENT', numPartitions: 2, replicationFactor: 1 }]);
    await kafkaManager.connectProducer();

    await consumeMessages("BANK_STATEMENT", '1')
};
let producerConnected = false;

export const connectProducer = async () => {
    if (!producerConnected) {
        await kafkaManager.connectProducer();
        producerConnected = true;
    }

}
export const produceMessage = async (data: any) => {
    await connectProducer()
    await kafkaManager.initializeProducer('BANK_STATEMENT', data);

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