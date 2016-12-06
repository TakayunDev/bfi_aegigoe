// Copyright (c) 2015 Takayun.
var memory, grid, code, pointer, program, result, str_buff;
var isInit = false;
var step = {
    enabled: false,
    sec: 0
};
var isRun = false;
var isDebug = false;

var token = {
    count: 0,
    max: 0,
    stack: [],
    dic_bfi: {
        'pl' : '+',
        'mi' : '-',
        'gt' : '>',
        'lt' : '<',
        'pe' : '.',
        'bb' : '[',
        'eb' : ']'
    },
    dic: {
        'pl' : 'あッ',
        'mi' : 'んッ',
        'gt' : 'ああッ！',
        'lt' : 'んんッ！',
        'pe' : 'イク！イっちゃう！',
        'bb' : 'してぇ！お願い！',
        'eb' : 'やめないでぇ！',
    },
    find: function(index) {
        for(var key in token.dic) {
            var buff = program.substr(index, token.dic[key].length);
            if(buff === token.dic[key]) {
                return key;
            }
        }
        return '';
    },
    findNext: function() {
        for(var key in token.dic) {
            var buff = program.substr(token.count, token.dic[key].length);
            if(buff === token.dic[key]) {
                return key;
            }
        }
        return '';
    },
    findBack: function() {
        for(var i = 1; i <= token.max; i++){
            for(var key in token.dic) {
                var buff = program.substr(token.count - i, i);
                if(buff == token.dic[key]) {
                    return key;
                }
            }
        }
        return '';
    },
    // トークンを見つけ後にカウンタを進める
    next: function() {
        var key = token.findNext();
        if(key) {
            token.count += token.dic[key].length;
        } else {
            token.count += 1;
        }
        return key;
    },
    // トークンを見つけ前にカウンタを進める
    back: function() {
        var key = token.findBack();
        if(key) {
            token.count -= token.dic[key].length;
        } else {
            token.count -= 1;
        }
        return key;
    },
    findBracket: function(bracket) {
        var temp = token.count;
        var staple = 0;
        var count = -1;
        switch(bracket) {
            case 'bb': 
            while(token.count < program.length) {
                var key = token.next();
                if(key == 'bb') {
                    staple++;
                }
                if(key == 'eb') {
                    if(staple == 0) {
                        count = token.count;
                        break;
                    }
                    staple--;
                }
            }
            break;
            case 'eb':
            while(token.count >= 0) {
                var key = token.back();
                if(key == 'eb') {
                    staple++;
                }
                if(key == 'bb') {
                    if(staple == 1) {
                        count = token.count;
                        break;
                    }
                    staple--;
                }
            }
            break;
        }
        token.count = temp;
        return count;
    }
};

function init() {
    pointer = 0;
    memory = [0];
    token.count = 0;

    token.max = 0;
    for(var i in token.dic) {
        if(token.max < token.dic[i].length) {
            token.max = token.dic[i].length;
        }
    }

    grid = document.getElementById('grid');
    grid.write = function(str) {
        grid.innerHTML = str;
    }
    grid.add = function(str) {
        grid.innerHTML += str;
    }

    program = document.getElementById('code').value;
    
    debug = document.getElementById('debug');
    debug.write = function(str) {
        debug.innerHTML = str;
    }
    debug.add = function(str) {
        debug.innerHTML += str;
    }

    debug2 = document.getElementById('debug2');
    debug2.write = function(str) {
        debug2.innerHTML = str;
    }
    debug2.add = function(str) {
        debug2.innerHTML += str;
    }

    result = document.getElementById('result');
    result.write = function(str) {
        result.innerHTML = str;
    }
    result.add = function(str) {
        result.innerHTML += str;
    }
    result.show = function() {
        while(str_buff.length) {
            result.add(String.fromCharCode(str_buff.shift()));
        }
    }
    
    str_buff = [];

    grid.write('');
    result.write('');
    debug.write(program);
    debug2.write('');
    show();

    isInit = true;
}

// ソースプログラムをBrainfuckに変換
function encodeBF() {
    var str = '';
    var temp = token.count;
    token.count = 0;
    var key;
    while(token.count < program.length) {
        if(key = token.next()) {
            str += token.dic_bfi[key];
        }
    }
    token.count = temp;
    return str;
}

// 整数を4桁に整形する
function getNumStr(n) {
    if(n >= 1000) return n;
    return '0' + ~~(n/100) + ~~((n % 100) / 10) + (n % 10);
}

function show() {
    result.show();

    grid.write('');
    var out = '';
    for(var i = 0; i < memory.length; i++) {
        if(i == pointer) {
            out += "<span style='color:red'>" + getNumStr(memory[i]) + '</span> ';
        } else {
            out += getNumStr(memory[i]) + ' ';    
        }
    }
    grid.add(out);
    var s, buff;
    s = buff = '';
    for(var i = 0; i < program.length; i += buff.length) {
        buff = token.dic[token.find(i)];
        if(buff) {
            if(i == token.count) {
                s += "<span style='color:lime'>" + buff + "</span>";
            } else {
                s += buff;
            }
        } else {
            buff = ' ';
            s += program.charAt(i);
        }
    }
    debug.write(s);
}

function interpret() {
    if(token.count >= program.length) {
        isInit = false;
        show();
        document.getElementById('run').disabled = false;
        document.getElementById('stop').disabled = true;
        document.getElementById('step').disabled = false;
        return;
    }
    isRun = true;
    var key = token.next();
    switch(key) {
        case 'pl':
        memory[pointer]++;
        if(memory[pointer] > 255) memory[pointer] = 0;
        break;
        case 'mi': 
        memory[pointer]--;
        if(memory[pointer] < 0) memory[pointer] = 255;
        break;
        case 'gt': pointer++; break;
        case 'lt': pointer--; break;
        case 'pe': str_buff.push(memory[pointer]); break;
        case 'bb': 
        if(memory[pointer] == 0) {
            token.count = token.findBracket('bb');
        }
        break;
        case 'eb':
        if(memory[pointer] != 0) {
            token.count = token.findBracket('eb');
        }
        break;
        default: break;
    }
    memory[pointer] = memory[pointer] || 0;
    if(isDebug){
        show();
    }
    if(!step.enabled){
        setTimeout(interpret, step.sec);
    }
    isRun = false;
}