import { EventEmitter } from "node:events";
import { Actions as a } from "#Domain/index.js";
import { getLoginSubscriber } from "#subscribers/applications/login.subscriber.js";
import { getAccountAcctivatedSubscriber } from "#subscribers/applications/account-activated.subscriber.js";

import type { DomainEventBus } from "#Domain/events/DomainEventBus";

export const eventBus: DomainEventBus = new EventEmitter();

eventBus.on(a.LOGIN, getLoginSubscriber());
eventBus.on(a.ACCOUNT_ACTIVATED, getAccountAcctivatedSubscriber());
// eventBus.on(a.NEW_ACCOUNT_REGISTERED, getNewAccountRegisteredSubscriber());
// eventBus.on(a.USER_PASSWORD_CHANGED, getUserPasswordChangedSubscriber());
