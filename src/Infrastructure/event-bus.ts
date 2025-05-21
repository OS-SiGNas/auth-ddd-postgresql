import { EventEmitter } from "node:events";
import { ACTIONS } from "#Domain";

import { getLoginSubscriber } from "#subscribers/applications/login.subscriber.js";
import { getAccountAcctivatedSubscriber } from "#subscribers/applications/account-activated.subscriber.js";
import { QueueConsumeSubscriber } from "#subscribers/applications/queue-consume.subscriber.js";

import type { DomainEventBus } from "#Domain";

export const bus: DomainEventBus = new EventEmitter();

bus.on(ACTIONS.AUTH_LOGIN, getLoginSubscriber());
bus.on(ACTIONS.AUTH_ACCOUNT_ACTIVATED, getAccountAcctivatedSubscriber());

new QueueConsumeSubscriber(bus);
