import { EventEmitter } from "node:events";
import { Actions } from "#Domain/index.js";
import { getLoginSubscriber } from "#subscribers/applications/login.subscriber.js";
import { getAccountAcctivatedSubscriber } from "#subscribers/applications/account-activated.subscriber.js";

import type { DomainEventBus } from "#Domain/events/DomainEventBus";

export const eventBus: DomainEventBus = new EventEmitter();

eventBus.on(Actions.LOGIN, getLoginSubscriber());
eventBus.on(Actions.ACCOUNT_ACTIVATED, getAccountAcctivatedSubscriber());
