import { BaseEntity } from "@/core/entities/base-entity";
import { Optional } from "@/core/types/optional";
import { ModuleKey } from "@prisma/client";

export interface IEnabledModuleProps {
  tenantId: string;
  module: ModuleKey;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class EnabledModule extends BaseEntity<IEnabledModuleProps> {
  get tenantId() {
    return this.props.tenantId;
  }

  get module() {
    return this.props.module;
  }

  get enabled() {
    return this.props.enabled;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  setEnabled(enabled: boolean) {
    this.props.enabled = enabled;
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<IEnabledModuleProps, "enabled" | "createdAt" | "updatedAt">, id?: string) {
    return new EnabledModule(
      {
        ...props,
        enabled: props.enabled ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
