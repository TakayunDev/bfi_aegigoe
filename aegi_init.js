// デバックを隠す
function hiddenDebug() {
    var debug = document.getElementById('debug_section');
    debug.hidden = true;
}
// デバックを表示
function showDebug() {
    var debug = document.getElementById('debug_section');
    debug.hidden = false;
}
// 初期化
window.onload = function() {
    document.getElementById('run').onclick = function() {
        step.enabled = false;
        document.getElementById('run').disabled = true;
        document.getElementById('stop').disabled = false;
        document.getElementById('step').disabled = true;
        if(isDebug) {
            if(!isInit) init();
            step.sec = document.getElementById('step_sec').value;
            interpret();
        } else {
            init();
            isRun = true;
            aegi_fast.setProgram(encodeBF());
            aegi_fast.interpret(function(){
                isInit = false;
                isRun = false;
                show();
                document.getElementById('run').disabled = false;
                document.getElementById('stop').disabled = true;
                document.getElementById('step').disabled = false;
            });
        }
    };
    document.getElementById('stop').onclick = function() {
        if(!isInit) init();
        step.enabled = true;
        document.getElementById('run').disabled = false;
        document.getElementById('stop').disabled = true;
        document.getElementById('step').disabled = false;
    };
    document.getElementById('stop').disabled = true;
    document.getElementById('step').onclick = function() {
        if(!isInit) init();
        step.enabled = true;
        interpret();
    };
    document.getElementById('reset').onclick = function() {
        step.enabled = true;
        setTimeout(function() {
            if(isRun == false){
                step.enabled = false;
            }}, 1000);
        init();
        document.getElementById('run').disabled = false;
        document.getElementById('stop').disabled = true;
        document.getElementById('step').disabled = false;
    };
    isDebug = document.getElementById('check_debug').checked;
    document.getElementById('check_debug').onchange = function() {
        isDebug = document.getElementById('check_debug').checked;
        if(this.checked) {
            showDebug();
        } else {
            hiddenDebug();
        }
    };
};