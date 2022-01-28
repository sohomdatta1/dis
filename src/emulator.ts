import { ops } from  './ops'
import { print } from './print'

class Emulator {
    _stack: number[]
    constructor() {
        this._stack = []
    }
    _push(x: number) : void {
        this._stack.push(x)
    }
    _print() : void {
        const res = this._stack.pop()
        if ( res ) {
            print(res)
        } else {
            this._abort("Stack underflow")
        }
    }
    _add() : void {
        const a =  this._stack.pop()
        const b = this._stack.pop()
        if ( !a || !b ) {
            this._abort("Stack underflow");
        } else {
            this._stack.push(a+b)
        }
    }
    _sub() : void {
        const a =  this._stack.pop()
        const b = this._stack.pop()
        if ( !a || !b ) {
            this._abort("Stack underflow");
        } else {
            this._stack.push(a-b)
        }
    }
    _mul() : void {
        const a =  this._stack.pop()
        const b = this._stack.pop()
        if ( !a || !b ) {
            this._abort("Stack underflow");
        } else {
            this._stack.push(a*b)
        }
    }
    _abort(error_msg: string) : void {
        throw new Error(`Emulation error: ${error_msg}`)
    }
    run(ins: number[][]) {
        ins.forEach(op => {
            switch (op[0]) {
                case ops.OP_PUSH: {
                    this._push(op[1]);
                }
                break;
                case ops.OP_PRINT: {
                    this._print();
                }
                break;
                case ops.OP_ADD: {
                    this._add();
                }
                break;
                case ops.OP_SUB: {
                    this._sub();
                }
                break;
                case ops.OP_MUL: {
                    this._mul();
                }
                break;
                default: {
                    this._abort(`Unrecognized op :${op[0]}`)
                }
            }
        })
    }
}

export default Emulator;