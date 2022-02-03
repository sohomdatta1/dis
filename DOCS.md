# Notes

## 0.0.0

- Basic structure, a compiler and emulator mode
- Only 5 operations
- `Number` =  push operation,
- `+` = Add operation
- `-` = Subtract operation
- `*` = Multiply operation
- `$` = Pop and display operation
- `;` = As start of comments
- Can only calulate positive numbers
- Example program: ```3 4 + $``` (Ouput: ```7```)
- Operations must be written in reverse polish notation

## 0.0.1

- If ladder: ```if_ladder = if_statement else_if_statment* else_statement?```

- If statment: ```if_statement = if bool_expression { statement* }```

- Else if: ```else_if_statement = else if bool_expression { statement* }```

- Else: ```else_statement = else { statement* }```

- While: ```while_statement = while bool_expression { statement* }```

- Do while: ```do_while_statement = do { statement* } while bool_expression```
