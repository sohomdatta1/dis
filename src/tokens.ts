export enum TokenType {
    NUMBER,
    ARITH_OP,
    IF,
    ELSE,
    DO,
    WHILE,
    BOOL_OP,
    PRINT,
    INPUT,
    SPECIAL_SYMBOL,
    DUP,
    ERR
}

export interface Token {
    type: TokenType,
    token: string,
    line: number,
    offset: number
}