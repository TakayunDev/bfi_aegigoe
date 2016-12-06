aegi_ebnf = {
    memory: [],
    pointer: 0,
    prog: '++[>++  あふぇ+あf<-]',
    pc: 0,
    expr: function() {
    },
    term: function() {
    },
    factor: function() {
        var c;
        while(c = this.prog[this.pc++]) {
        }
    }
}