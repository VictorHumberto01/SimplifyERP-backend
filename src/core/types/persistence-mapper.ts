export interface IPersistenceMapper<DomainEntity, PersistenceEntity> {
  toPersistence(domainEntity: DomainEntity): PersistenceEntity;
  toDomain(persistenceEntity: PersistenceEntity): DomainEntity;
}
