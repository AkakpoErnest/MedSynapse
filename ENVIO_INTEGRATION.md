# Envio Integration in MedSynapse

## Overview

Envio provides real-time blockchain indexing via HyperSync, transforming slow RPC calls into sub-100ms GraphQL queries. It indexes all MedSynapse on-chain events (consents, research requests, approvals) and provides a GraphQL API for the frontend.

## Usage in MedSynapse

Envio acts as the real-time data layer between blockchain and the React frontend. It continuously indexes blockchain events, stores them in Postgres via Docker, and exposes them through a GraphQL API that the frontend queries for instant dashboard updates.

### Implementation Locations

**Indexer Configuration:**
- `config.yaml` - Contract addresses, event definitions, and indexing configuration
- `schema.graphql` - GraphQL schema defining indexed entities
- `src/EventHandlers.ts` - Event handlers that process and store blockchain events

**Frontend Integration:**
- `frontend/src/config/envio.ts` - GraphQL queries and configuration (lines 1-180)
- `frontend/src/services/envioService.ts` - GraphQL client and service methods
- `frontend/src/hooks/useEnvio.ts` - React hooks for data fetching (useContributorConsents, useResearchRequests, etc.)

**Dashboard Usage:**
- `frontend/src/pages/ContributorDashboard.tsx` - Uses `useContributorConsents()` hook
- `frontend/src/pages/ResearcherDashboard.tsx` - Queries via `useResearchRequests()` hook
- `frontend/src/components/AIInsightsDashboard.tsx` - Uses `useAnalytics()` for AI insights

**Indexer Runtime:**
- `package.json` - Envio v2.31.0 dependency and dev scripts
- Docker containers for Postgres + Hasura providing GraphQL API

### Key Features Used

- **HyperIndex** - Multi-chain blockchain event indexing
- **HyperSync** - Real-time GraphQL API at http://localhost:8080/v1/graphql  
- **Event Handlers** - Processes ConsentCreated, ResearchRequested, ResearchApproved events
- **Sub-Second Queries** - Consent queries complete in <100ms vs 1-3 seconds with RPC

