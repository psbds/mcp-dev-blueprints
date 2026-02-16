import { existsSync, statSync } from "fs";
import { resolve } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initializeConfigManager } from "./config-manager.js";

// Parse and validate command line arguments using yargs
function parseAndValidateArgs(override_kb_path?: string): { kbPath: string; mode: string; scope?: string[] } {
    const argv = yargs(hideBin(process.argv))
        .option('kb-path', {
            type: 'string',
            demandOption: !override_kb_path,
            default: override_kb_path,
            describe: 'Path to knowledge base directory',
            alias: 'k'
        })
        .option('mode', {
            type: 'string',
            demandOption: true,
            describe: 'Server mode (http or stdio)',
            alias: 'm',
            choices: ['http', 'stdio']
        })
        .option('scope', {
            type: 'string',
            demandOption: false,
            describe: 'Comma-separated list of server names to load (if not provided, all servers are loaded)',
            alias: 's'
        })
        .check((argv) => {
            const kbPath = argv['kb-path'];
            
            if (!kbPath || kbPath.trim() === '') {
                throw new Error('kb-path argument is required and cannot be empty');
            }

            const resolvedPath = resolve(kbPath);

            if (!existsSync(resolvedPath)) {
                throw new Error(`Knowledge base path does not exist: ${resolvedPath}`);
            }

            const stats = statSync(resolvedPath);
            if (!stats.isDirectory()) {
                throw new Error(`Knowledge base path is not a directory: ${resolvedPath}`);
            }

            return true;
        })
        .help('h')
        .alias('help', 'h')
        .usage('Usage: $0 --kb-path <path-to-knowledge-base> --mode <http|stdio> [--scope <server-names>]')
        .example('$0 --kb-path ./knowledge_base --mode stdio', 'Use ./knowledge_base as the knowledge base directory with stdio mode')
        .example('$0 --kb-path ./knowledge_base --mode stdio --scope java-standards', 'Load only the java-standards server')
        .example('$0 --kb-path ./knowledge_base --mode stdio --scope java-standards,angular-standards', 'Load only java-standards and angular-standards servers')
        .parseSync();

    const kbPath = override_kb_path || argv['kb-path']!;
    const resolvedPath = resolve(kbPath);
    const mode = argv.mode;
    const scope = argv.scope ? argv.scope.split(',').map(s => s.trim()).filter(s => s.length > 0) : undefined;
    
    return { kbPath: resolvedPath, mode, scope };
}

export default function loadConfig(override_kb_path?: string): { kbPath: string; mode: string; scope?: string[] } {
    // Main application setup - parse and validate arguments
    const { kbPath, mode, scope } = parseAndValidateArgs(override_kb_path);

    // Initialize the configuration manager
    initializeConfigManager(kbPath, mode, scope);
    
    return { kbPath, mode, scope };
}