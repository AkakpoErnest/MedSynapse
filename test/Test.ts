import assert from "assert";
import { 
  TestHelpers,
  MedSynapseConsent_ConsentCreated
} from "generated";
const { MockDb, MedSynapseConsent } = TestHelpers;

describe("MedSynapseConsent contract ConsentCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for MedSynapseConsent contract ConsentCreated event
  const event = MedSynapseConsent.ConsentCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("MedSynapseConsent_ConsentCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await MedSynapseConsent.ConsentCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualMedSynapseConsentConsentCreated = mockDbUpdated.entities.MedSynapseConsent_ConsentCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedMedSynapseConsentConsentCreated: MedSynapseConsent_ConsentCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      consentId: event.params.consentId,
      contributor: event.params.contributor,
      dataHash: event.params.dataHash,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualMedSynapseConsentConsentCreated, expectedMedSynapseConsentConsentCreated, "Actual MedSynapseConsentConsentCreated should be the same as the expectedMedSynapseConsentConsentCreated");
  });
});
