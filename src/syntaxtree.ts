import { Token } from './tokens'

interface Start {
    everything: Block[] 
}

interface IfLadderStatement {
    if: IfStatement
    elseIfs: ElseIfStatement[]
    else: ElseStatement|null
}

interface ElseStatement {
    body: Block
}

interface ElseIfStatement {
    choose: BoolExpression
    body: Block
}

interface IfStatement {
    choose: BoolExpression,
    body: Block
}

interface WhileStatement {
    choose: BoolExpression
    body: Block
}

interface Block {
    statments: Statement[]
}

interface BoolExpression {
    tokens: Token[]
}

interface Statement {
    tokens: [Token, IfLadderStatement, WhileStatement][]
}

export default Start