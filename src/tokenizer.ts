import { Token, TokenType } from './tokens'
import * as fs from 'fs'
import * as rd from 'readline'

function is_wsp(x: string) {return x == ' ' || x == '\n' || x == '\t' || x == '\r'}

class Tokenizer {
    fd: fs.ReadStream
    rl: rd.Interface
    lines: number
    offset: number
    buffer: string[]
    currentLine: string
    ptr: number
    constructor(input_file: fs.PathLike) {
        this.fd = fs.createReadStream(input_file)
        this.rl = rd.createInterface({
            input: this.fd,
            crlfDelay: Infinity
        })
        this.lines = 1;
        this.offset = 1;
        this.buffer = [];
        this.currentLine = "";
        this.ptr = 0;
        this.getLine()
    }

    abort(error_msg: string) {
        throw new Error(`Tokenization error: ${error_msg} at ${this.lines}:${this.offset}`);
    }

    getLine() : string|undefined {
        this.rl.once('line', (line) => {
            this.buffer.push(line)
        })
        this.ptr = 0;
        this.lines++;
        this.offset = 1;
        return this.buffer.pop();
    }

    createToken(type: TokenType = TokenType.ERR, token: string = '') : Token {
        return {
            type: type,
            token: token,
            line: this.lines,
            offset: this.offset
        }
    }

    get_until_wsp(): string {
        let temp_ptr = this.ptr;
        let temp_buf = ""
        while ( !is_wsp(this.currentLine[temp_ptr]) && temp_ptr < this.currentLine.length ) {
            temp_buf += this.currentLine[temp_ptr]
            temp_ptr++
        }
        this.ptr = temp_ptr - 1
        return temp_buf
    }

    next() : Token {
        if ( this.ptr >= this.currentLine.length ) {
            const temp = this.getLine();
            if ( !temp ) {
                return this.createToken();
            }
            this.currentLine = temp;
            
        }
        switch(this.currentLine[this.ptr++]) {
            case '\r':{/* nop */} break;
            case '\n':{
                this.lines++;
                this.offset = 1;
            } break;
            case '\t':
            case  ' ': {
                this.offset++;
            } break;
            case '-':
            case '*':
            case '+': {
                this.offset++;
                return this.createToken(TokenType.ARITH_OP,this.currentLine[this.ptr-1]);
            } break;
            case '$': {
                this.offset++;
                return this.createToken(TokenType.PRINT, '$');
            } break;
            case '@': {
                this.offset++;
                return this.createToken(TokenType.INPUT, '@');
            } break;
            case '=': {
                if ( this.currentLine[this.ptr] == '=' ) {
                    this.offset += 2;
                    this.ptr++;
                    return this.createToken(TokenType.BOOL_OP, '==');
                }
            } break;
            case '>':
            case '<': {
                if ( is_wsp(this.currentLine[this.ptr]) ) {
                    this.offset++;
                    this.ptr++;
                    return this.createToken(TokenType.BOOL_OP, this.currentLine[this.ptr-1]);
                } else if ( this.currentLine[this.ptr] === '=' ) {
                    this.offset++;
                    this.ptr++;
                    return this.createToken(TokenType.BOOL_OP, this.currentLine.slice(this.ptr-1, this.ptr+1))
                }
            } break;
            case '{':
            case '}': {
                this.offset++;
                return this.createToken(TokenType.SPECIAL_SYMBOL, this.currentLine[this.ptr-1])
            } break;
            case 'n': {
                if ( this.get_until_wsp() == 'ot' ) {
                    this.ptr += 2;
                    this.offset += 3;
                    return this.createToken(TokenType.BOOL_OP, 'not');
                }
            } break;
            case 'a': {
                if ( this.get_until_wsp() == 'nd' ) {
                    this.ptr += 2;
                    this.offset += 3;
                    return this.createToken(TokenType.BOOL_OP, 'and');
                }
            } break;
            case 'o': {
                if ( this.get_until_wsp() == 'r' ) {
                    this.ptr++;
                    this.offset += 2;
                    return this.createToken(TokenType.BOOL_OP, 'or');
                }
            } break;
            case 'd': {
                if ( this.currentLine[this.ptr] === 'o' ) {
                    this.ptr++;
                    this.offset += 2;
                    return this.createToken(TokenType.DO, 'do');
                } else if ( this.get_until_wsp() === "up" ) {
                    this.offset += 3;
                    this.ptr += 2;
                    return this.createToken(TokenType.DUP, 'dup')
                }
            } break;
            case 'i': {
                if ( this.currentLine[this.ptr] === 'f' ) {
                    this.ptr++;
                    this.offset += 2;
                    return this.createToken(TokenType.IF, 'if');
                }
            } break;
            case 'e': {
                if ( this.get_until_wsp() === "lse" ) {
                    this.ptr += 3;
                    this.offset += 4;
                    return this.createToken(TokenType.ELSE, 'else');
                }
            }
            case 'w': {
                if ( this.get_until_wsp() === "hile" ) {
                    this.ptr += 4;
                    this.offset += 5;
                    this.createToken(TokenType.WHILE, 'while');
                }
            } break;
            default: {
                this.ptr--;
                const token = this.get_until_wsp();
                const number = parseInt(token);
                if ( !isNaN(number) ) {
                    this.offset += token.length;
                    this.ptr += token.length;
                    return this.createToken()
                } else {
                    this.ptr++;
                }
            } break;
        }
        this.abort("Unrecognized token")
        return this.createToken();
    }
}

export default Tokenizer;