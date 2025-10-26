/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIGHTHOUSE_API_KEY: string
  readonly VITE_ENVIO_API_KEY: string
  readonly VITE_ENVIO_ENDPOINT: string
  readonly VITE_MEDSYNAPSE_CONTRACT: string
  readonly VITE_PRIVATE_KEY: string
  readonly VITE_1MB_CONTRACT_ADDRESS: string
  readonly VITE_DATA_VALIDATOR_CONTRACT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

