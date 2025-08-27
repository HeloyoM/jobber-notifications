import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@heloyom/shared-develope-tools';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: 'https://my-elasticsearch-project-a49e7f.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'WFRfTjVaZ0JETWhtelBHaVJQYk46dVZQeTdBazFzdDQtZmhXMFB1dlJ4Zw=='
  },
  serverMode: 'serverless',
});


export async function checkConnection(): Promise<void> {
    let isConnected = false;

    while (!isConnected) {
        try {
            const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
            log.info(`NotificationService Elasticsearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'NotificationService checkConnection() method:', error);
        }
    }
}