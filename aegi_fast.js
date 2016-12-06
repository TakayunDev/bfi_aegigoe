aegi_fast = {
    program: [],
    pc: 0,
    // ソースプログラムをBrainfuckに変換
    setProgram: function(str) {
        this.program = [];
        for(var i = 0, len = str.length; i < len; i++) {
            this.program.push(str[i]);
        }
    },
    init: function() {
        this.pc = 0;
        memory = [0];
        pointer = 0;
    },
    findBracket: function(seek) {
        // 対応する括弧の位置を検索
        var stack = 0;
        var point = 0;
        var added = 1;
        var close = '['
        if(seek == '[') {
            added = -1;
            close = ']';
        }
        for(var i = this.pc - 1, len = this.program.length; i < len || i >= 0; i += added) {
            if(this.program[i] == seek) {
                stack--;
                if(!stack) {
                    point = i + 1;
                    break;
                }
            }
            if(this.program[i] == close) {
                stack++;
            }
        }
        return point;
    },
    interpret: function(callback) {
        this.init();
        setTimeout(function(callback) {
            var key = '';
            do {
                key = aegi_fast.program[aegi_fast.pc++];
                switch(key) {
                    case '+':
                    memory[pointer]++;
                    if(memory[pointer] > 255) memory[pointer] = 0;
                    break;
                    case '-': 
                    memory[pointer]--;
                    if(memory[pointer] < 0) memory[pointer] = 255;
                    break;
                    case '>': pointer++; break;
                    case '<': pointer--; break;
                    case '.': str_buff.push(memory[pointer]); break;
                    case '[': 
                    if(!memory[pointer]) {
                        aegi_fast.pc = aegi_fast.findBracket(']');
                    }
                    break;
                    case ']':
                    if(memory[pointer]) {
                        aegi_fast.pc = aegi_fast.findBracket('[');
                    }
                    break;
                    default: break;
                }
                memory[pointer] = memory[pointer] || 0;
            } while (key);
            if(typeof callback == 'function') {
                callback();
            }
        }, 0, callback);
    },
}