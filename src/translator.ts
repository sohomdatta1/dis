import { ops } from './ops'
import { print } from './print'
import * as fs from 'fs'
import * as child_proc from 'child_process'

function run_cmd(cmd: string, args: string[]) : void {
    print(`[CMD] Running ${cmd} ${args.join(' ')}`)
    const _out = child_proc.spawnSync(cmd, args);
    const output = _out.output.toString().slice(2)
    if ( output !== "" ) {
        print(output)
    }
    if ( _out.status !== 0 ) {
        process.exit(255);
    }
}

class Translator {
    _buf: string
    constructor() {
        this._buf = "";
    }
    start() {
        this._buf = "";
        this.write_raw_routine(`\tglobal _start\n\tsection .text\n
print:  sub     rsp, 56
        mov     byte [rsp+46], 10
        test    rdi, rdi
        je      _L4
        lea     rax, [rsp+48]
        lea     rcx, [rsp+45]
        mov     r8, -3689348814741910323
        mov     [rsp+8], rax
        lea     r9d, [rax]
_L3:
        mov     rax, rdi
        mul     r8
        mov     rax, rdi
        shr     rdx, 3
        lea     rsi, [rdx+rdx*4]
        add     rsi, rsi
        sub     rax, rsi
        mov     esi, r9d
        add     eax, 48
        sub     esi, ecx
        sub     rcx, 1
        mov     [rcx+1], al
        mov     rax, rdi
        mov     rdi, rdx
        cmp     rax, 9
        ja      _L3
        lea     edx, [rsi+1]
        mov     eax, 32
        mov     rsi, rsi
        mov     rdx, rdx
        sub     rax, rsi
_L2:
        lea     rsi, [rsp+15+rax]
        mov     edi, 1
        mov     rax, 1
        syscall
        add     rsp, 56
        ret
_L4:
        mov     eax, 30
        mov     edx, 3
        jmp     _L2`)
        this.write_raw_routine(`;; ------------------------------------------`)
        this.write_raw_routine(`;; ----- start actual program from here -----`)
        this.write_raw_routine(`;; ------------------------------------------`)
        this.write_raw_routine(`_start: xor rax, rax`)
    }
    end() {
        this.write(';; -- end --')
        this.write('mov rax, 60')
        this.write('mov rdi, 0')
        this.write('syscall')
        this.write('ret')
    }
    write(txt: string) {
        this._buf = this._buf + '\t' + txt + '\n';
    }
    write_raw_routine(txt: string) {
        this._buf = this._buf + txt + '\n';
    }
    push(x: number) {
        this.write(';; -- push --')
        this.write(`push ${x}`)
    }
    add() {
        this.write(';; -- add --')
        this.write('pop rax')
        this.write('pop rdi')
        this.write('add rax, rdi')
        this.write('push rax')
    }
    sub() {
        this.write(';; -- sub --')
        this.write('pop rax')
        this.write('pop rdi')
        this.write('sub rdi, rax')
        this.write('push rdi')
    }
    mul() {
        this.write(';; -- mul --')
        this.write('pop rax')
        this.write('pop rdi')
        this.write('imul rax, rdi')
        this.write('push rax')
    }
    print() {
        this.write(';; -- print --')
        this.write('pop rdi')
        this.write('call print')
    }
    abort(error_msg: string) {
        throw new Error(`Compilation Error: ${error_msg}`)
    }
    translate(ins: number[][], output_file: string) {
        this.start();
        ins.forEach(async op => {
            switch ( op[0] ) {
                case ops.OP_ADD: {
                    this.add();
                }
                break;
                case ops.OP_SUB: {
                    this.sub();
                }
                break;
                case ops.OP_PUSH: {
                    this.push(op[1]);
                } break;
                case ops.OP_MUL: {
                    this.mul();
                } break;
                case ops.OP_PRINT: {
                    this.print();
                } break;
                default: {
                    this.abort(`Unrecognized op, ${op[0]}`)
                }
            }
        })
        this.end();
        fs.writeFileSync(`${output_file}.asm`, this._buf);
        run_cmd('nasm', ['-f', 'elf64', `${output_file}.asm`]);
        run_cmd('ld', ['-o', output_file, `${output_file}.o`]);
    }
}

export default Translator;