// Blockchain configuration based on Move.toml
export const BLOCKCHAIN_CONFIG = {
    // Contract addresses from Move.toml
    CEDRA_GAMEFI_ADDRESS: "79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe",
    ADMIN_ADDRESS: "79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe",

    // Package info
    PACKAGE_NAME: "CedraMiniApp",
    PACKAGE_VERSION: "1.0.0",

    // Network configuration
    NETWORK_URL: process.env.CEDRA_NETWORK_URL || "https://rpc.cedra.network",
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",

    // Framework dependency
    CEDRA_FRAMEWORK_REPO: "https://github.com/cedra-labs/cedra-framework.git"
};