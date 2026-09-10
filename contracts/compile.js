const fs = require("fs");
const path = require("path");
const solc = require(path.join(process.cwd(), "node_modules", "solc"));

const CONTRACTS_DIR = path.join(process.cwd(), "contracts");
const OUT_DIR = path.join(process.cwd(), "artifacts", "contracts");

function findImports(importPath) {
  let resolved;
  if (importPath.startsWith("@openzeppelin/")) {
    resolved = path.join(process.cwd(), "node_modules", importPath);
  } else {
    resolved = path.join(CONTRACTS_DIR, importPath);
  }
  try {
    return { contents: fs.readFileSync(resolved, "utf8") };
  } catch (e) {
    return { error: "File not found: " + importPath };
  }
}

const targets = ["HoneyChain.sol", "HoneyChainQR.sol"];
const sources = {};
for (const t of targets) {
  sources[t] = { content: fs.readFileSync(path.join(CONTRACTS_DIR, t), "utf8") };
}

const input = {
  language: "Solidity",
  sources,
  settings: {
    viaIR: true,
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"] },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

let hasError = false;
if (output.errors) {
  for (const err of output.errors) {
    console.log(err.severity.toUpperCase() + ":", err.formattedMessage || err.message);
    if (err.severity === "error") hasError = true;
  }
}
if (hasError) process.exit(1);

for (const t of targets) {
  const contractsInFile = output.contracts[t];
  for (const contractName of Object.keys(contractsInFile)) {
    const c = contractsInFile[contractName];
    const dir = path.join(OUT_DIR, t);
    fs.mkdirSync(dir, { recursive: true });
    const artifact = {
      contractName,
      abi: c.abi,
      bytecode: "0x" + c.evm.bytecode.object,
      deployedBytecode: "0x" + c.evm.deployedBytecode.object,
    };
    fs.writeFileSync(path.join(dir, contractName + ".json"), JSON.stringify(artifact, null, 2));
    console.log("Wrote artifact:", path.join(dir, contractName + ".json"));
  }
}
console.log("Compilation complete.");
