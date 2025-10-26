/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  MedSynapseConsent,
  MedSynapseConsent_ConsentCreated,
  MedSynapseConsent_ConsentRevoked,
  MedSynapseConsent_OwnershipTransferred,
  MedSynapseConsent_ResearchApproved,
  MedSynapseConsent_ResearchRequested,
} from "generated";

MedSynapseConsent.ConsentCreated.handler(async ({ event, context }) => {
  const entity: MedSynapseConsent_ConsentCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    consentId: event.params.consentId,
    contributor: event.params.contributor,
    dataHash: event.params.dataHash,
    dataType: event.params.dataType,
    description: event.params.description,
  };

  context.MedSynapseConsent_ConsentCreated.set(entity);
});

MedSynapseConsent.ConsentRevoked.handler(async ({ event, context }) => {
  const entity: MedSynapseConsent_ConsentRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    consentId: event.params.consentId,
    contributor: event.params.contributor,
  };

  context.MedSynapseConsent_ConsentRevoked.set(entity);
});

MedSynapseConsent.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: MedSynapseConsent_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.MedSynapseConsent_OwnershipTransferred.set(entity);
});

MedSynapseConsent.ResearchApproved.handler(async ({ event, context }) => {
  const entity: MedSynapseConsent_ResearchApproved = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    consentId: event.params.consentId,
    researcher: event.params.researcher,
  };

  context.MedSynapseConsent_ResearchApproved.set(entity);
});

MedSynapseConsent.ResearchRequested.handler(async ({ event, context }) => {
  const entity: MedSynapseConsent_ResearchRequested = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    consentId: event.params.consentId,
    researcher: event.params.researcher,
    purpose: event.params.purpose,
  };

  context.MedSynapseConsent_ResearchRequested.set(entity);
});
