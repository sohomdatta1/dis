#!/usr/bin/env node
import 'process'
import { print } from './print'
import './emulator'
import { op_gen } from './ops'
import Emulator from './emulator';
import Compiler  from './compiler';
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
    if (process.argv.length < 2) {
        usage();
        print("ERROR: No command specified")
        process.exit(ERR_CODE);
    }

    if ( process.argv[2] == 'run' ) {
        if ( process.argv.length < 3 ) {
            print("ERROR: No file provided")
            process.exit(ERR_CODE)
        }
        const ops = (new Parser(process.argv[3])).parse();
        (new Emulator()).run(ops)
    } else if ( process.argv[2] == 'build' ) {
        if ( process.argv.length < 4 ) {
            print("ERROR: No file provided")
            process.exit(ERR_CODE)
        }
        const ops = (new Parser(process.argv[3])).parse();
        (new Compiler()).compile(ops, process.argv[4])
    } else if ( process.argv[3] == 'help' ) {
        usage();
    } else {
        usage();
        print("ERROR: command not recognized")
        process.exit(ERR_CODE)
    }
}

main();