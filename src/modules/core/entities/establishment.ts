import { BaseEntity } from "@/core/entities/base-entity";
import { Optional } from "@/core/types/optional";

export interface IEstablishmentProps {
  tenantId: string;
  name: string;
  document: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Establishment extends BaseEntity<IEstablishmentProps> {
  get tenantId() {
    return this.props.tenantId;
  }

  get name() {
    return this.props.name;
  }

  get document() {
    return this.props.document;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  static create(
    props: Optional<IEstablishmentProps, "document" | "createdAt" | "updatedAt" | "deletedAt">,
    id?: string,
  ) {
    return new Establishment(
      {
        ...props,
        document: props.document ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );
  }
}
