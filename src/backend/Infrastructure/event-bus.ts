import type { DomainEventBus } from "#Domain";

import { EventEmitter } from "node:events";
import { ACTIONS } from "#Domain";
import { getLoginSubscriber } from "#auth/v1/application/subscribers/login.subscriber.js";
import { getAccountAcctivatedSubscriber } from "#auth/v1/application/subscribers/account-activated.subscriber.js";
import { authEmailSubscriber } from "#auth/v1/make.js";
import { QueueConsumeSubscriber } from "#subscribers/applications/queue-consume.subscriber.js";

export const bus: DomainEventBus = new EventEmitter();
new QueueConsumeSubscriber(bus);
bus.on(ACTIONS.AUTH_LOGIN, getLoginSubscriber());
bus.on(ACTIONS.AUTH_EMAIL_ACTIVATE_ACCOUNT, authEmailSubscriber.sendActivateAccountEmail);
bus.on(ACTIONS.AUTH_EMAIL_FORGOT_PASSWORD, authEmailSubscriber.sendForgotPasswordEmail);
bus.on(ACTIONS.AUTH_ACCOUNT_ACTIVATED, getAccountAcctivatedSubscriber());
