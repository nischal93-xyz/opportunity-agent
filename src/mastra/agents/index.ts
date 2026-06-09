import { Mastra } from '@mastra/core';
import { opportunityAgent } from './agents';

export const mastra = new Mastra({
  agents: { opportunityAgent },
});