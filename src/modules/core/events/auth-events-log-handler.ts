import { logger } from "@/core/logger";
import { DomainEvents } from "@/core/events/domain-events";
import { AccountLoggedInEvent } from "./account-logged-in.event";
import { AccountLoginFailedEvent } from "./account-login-failed.event";
import { AccountLoggedOutEvent } from "./account-logged-out.event";
import { PasswordChangedEvent } from "./password-changed.event";
import { PasswordResetEvent } from "./password-reset.event";

/**
 * Provisional handler: only logs auth events. Sprint 03 replaces this
 * registration with the real AuditService once the audit module exists
 * (see docs/project/sprint_tasks/sprint-03-auditoria-infraestrutura).
 */
export function setupAuthEventsLogHandler() {
  DomainEvents.register((event) => {
    const { accountId, email } = event as AccountLoggedInEvent;
    logger.info({ accountId, email }, "auth.login.succeeded");
  }, AccountLoggedInEvent.name);

  DomainEvents.register((event) => {
    const { email, reason } = event as AccountLoginFailedEvent;
    logger.warn({ email, reason }, "auth.login.failed");
  }, AccountLoginFailedEvent.name);

  DomainEvents.register((event) => {
    const { accountId } = event as AccountLoggedOutEvent;
    logger.info({ accountId }, "auth.logout");
  }, AccountLoggedOutEvent.name);

  DomainEvents.register((event) => {
    const { accountId } = event as PasswordChangedEvent;
    logger.info({ accountId }, "auth.password.changed");
  }, PasswordChangedEvent.name);

  DomainEvents.register((event) => {
    const { accountId } = event as PasswordResetEvent;
    logger.info({ accountId }, "auth.password.reset");
  }, PasswordResetEvent.name);
}
