export enum ops {
    OP_PUSH,
    OP_PRINT,
    OP_ADD,
    OP_SUB,
    OP_MUL
}

export const op_gen = {
    push : function (x: number) : number[] {
        return [ops.OP_PUSH, x]
    },
    print: function () : number[] {
        return [ops.OP_PRINT]
    },
    add: function () : number[] {
        return [ops.OP_ADD]
    },
    sub: function () : number[] {
        return [ops.OP_SUB]
    },
    mul: function() : number[] {
        return [ops.OP_MUL]
    }
}