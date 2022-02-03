#!/usr/bin/env node
import 'process'
import { print } from './print'
import './emulator'
import Emulator from './emulator';
import Translator  from './translator';
import Parser from './parser';
const ERR_CODE = -1;
function usage() : void {
    print(" Usage: dis <command> [arguments]");
    print(" Commands:")
    print("    run      - Run progam");
    print("    build    - Compile program");
    print("    help     - Prints this help message and exits")
}

function main() : void {
    try {
        if (process.argv.length < 3) {
            usage();
            print("[ERROR] No command specified")
            process.exit(ERR_CODE);
        }

        if ( process.argv[2] == 'run' ) {
            if ( process.argv.length < 4 ) {
                print("[ERROR] No file provided")
                process.exit(ERR_CODE)
            }
            print("[INFO] Parsing program")
            const ops = (new Parser(process.argv[3])).parse();
            print("[INFO] Emulating program");
            (new Emulator()).run(ops);
        } else if ( process.argv[2] == 'build' ) {
            if ( process.argv.length < 4 ) {
                print("[ERROR] No files provided")
                process.exit(ERR_CODE)
            } else if ( process.argv.length == 4 ) {
                print('[WARNING] No output file specified')
            }
            print("[INFO] Parsing program")
            const ops = (new Parser(process.argv[3])).parse();
            print("[INFO] Compiling to assembly");
            (new Translator()).translate(ops, process.argv[4] ?? "output")
        } else if ( process.argv[3] == 'help' ) {
            usage();
        } else {
            usage();
            print("[ERROR] command not recognized")
            process.exit(ERR_CODE)
        }
    } catch(e) {
        let message = 'Unknown error';
        if ( e instanceof Error ) message = e.message;
        print(`[ERROR] ${message}`)
        process.exit(ERR_CODE);
    }
}

main();