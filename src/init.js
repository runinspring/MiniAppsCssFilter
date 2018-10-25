const readline = require('readline');
const filter = require('./filter.js')

function readSyncByRl(tips) {
    tips = tips || '> ';

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

readSyncByRl('请输入文件夹的绝对路径:').then((res) => {
    // res = '/Users/zhangyu/jeff/git/Working/upupGame/project/pages/index'
    res = '/Users/zhangyu/jeff/git/Working/upupGame/project/pages/member'
    console.log("路径为:", res);
    console.log('请稍后，处理中...')

    filter.start(res)
});
