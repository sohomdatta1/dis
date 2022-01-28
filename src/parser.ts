import { op_gen } from  './ops'
import { print } from './print'
import * as fs from 'fs'

function is_wsp(x:string): Boolean {
    return x === ' ' || x === '\t' || x === '\n' || x === '\r'
}

class Parser {
    _buf: string
    ptr: number
    chars: number
    lines: number
    constructor(input_file: string) {
        this._buf = fs.readFileSync(input_file).toString()
        this.ptr = 0
        this.chars = 1
        this.lines = 1
    }

    error(error_msg: string) {
        throw new Error(`Parsing Error: ${error_msg}`)
    }

    get_until_wsp(): string {
        let temp_ptr = this.ptr;
        let temp_buf = ""
        while ( !is_wsp(this._buf[temp_ptr]) && this.ptr < this._buf.length ) {
            temp_buf += this._buf[temp_ptr]
            temp_ptr++
        }
        this.ptr = temp_ptr - 1
        return temp_buf
    }

    parse() : number[][] {
        let ins: number[][] = []
        for (this.ptr = 0;this.ptr < this._buf.length; this.ptr++) {
            switch( this._buf[this.ptr] ) {
                case '\t':
                case  ' ': {
                    this.chars++;
                }
                break;
                case '\n': {
                    this.chars = 1;
                    this.lines++;
                }
                break;
                case '\r': {
                    /*nop*/
                }
                break;
                case '+': {
                    ins.push(op_gen.add())
                }
                break;
                case '-': {
                    ins.push(op_gen.sub())
                }
                break;
                case '*': {
                    ins.push(op_gen.mul())
                }
                break;
                case '$': {
                    ins.push(op_gen.print())
                }
                break;
                case ';': {
                    while(this._buf[this.ptr] !== '\n' && this.ptr < this._buf.length) {
                        this.ptr++
                    }
                }
                break;
                default: {
                    ins.push(op_gen.push(parseInt(this.get_until_wsp())))
                }
            }
        }
        return ins
    }
}

export default Parser;
