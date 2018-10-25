const fs = require('fs')
const path = require('path')
let cssList = {}; //储存所有的css样式里的名称
let fileNameList = []; //文件名的数组
let dir = ''; //文件路径
/**分析页面 */
var analyzeWxml = () => {
    let reg = /class=\"(.*?)\"/g; //匹配 class=" xxxx xxx" 里的内容
    let result = {}
    for (let i = 0, len = fileNameList.length; i < len; i++) {
        let fName = fileNameList[i]
        result[fName] = {}
        let file_path = path.join(dir, fName + '.wxml')
        var str = fs.readFileSync(file_path, 'utf-8');
        str = str.replace(/\'/g, '"'); //单引号换成双引号
        console.log(111)
        str = str.replace(/(\r\n)|(\n)/g, '') //移除换行符
        // console.log(str)
        arrIgnore = str.match(/\<\!\-\-(.*?)\-\-\>/g)
        // console.log(222,arrIgnore.length,arrIgnore)
        if (arrIgnore.length > 0) {
            for (let i2 = 0, len = arrIgnore.length; i2 < len; i2++) {
                let ig = arrIgnore[i2]
                str = str.replace(ig, '')
            }
        }

        // console.log(str)
        // console.log(arr4)
        // return
        var arr1 = str.match(reg);

        var arrClassName = []; //
        for (let j = 0, len = arr1.length; j < len; j++) {
            //'class="spinner-container container2"' 拿出里面的类名称
            let strClass = arr1[j]
            strClass = strClass.replace(/class=|\"/g, '')
            arr = strClass.split(' ')
            for (let k = 0, len = arr.length; k < len; k++) {
                let className = arr[k];
                if (arrClassName.indexOf(className) === -1) {
                    arrClassName.push(className)
                    if(className =='touchbg'){
                        console.log(99999, arr1[j])
                    }
                }
            }
        }

        let varList = []
        let useList = []
        let failClassName = []; //网页中无效的 class 名称
        let arrStyleName = cssList[fName]
        for (let j = 0, len = arrClassName.length; j < len; j++) {
            let className = arrClassName[j]
            if (className.indexOf('{{') > -1) {
                varList.push(className)
            } else {
                if (useList.indexOf(className) === -1) {
                    useList.push(className); //使用的样式名称
                    if (arrStyleName.indexOf(className) === -1) {
                        failClassName.push(className); //样式中不存在该名称
                    }
                }
                // console.log(className)
            }
        }

        //获取了使用过的 useList 

        let cssUnUseList = []
        for (let j = 0, len = arrStyleName.length; j < len; j++) {
            let styleName = arrStyleName[j]
            // console.log(styleName,useList.indexOf(styleName))
            if (useList.indexOf(styleName) === -1) { //没有使用过
                cssUnUseList.push(styleName)
            }
            // console.log(styleName)
        }
        // console.log('useList',fName,useList.length,cssList[fName].length,unUseList.length)
        result[fName] = {
            '动态变量': varList,
            'wxml中无效的class名称': failClassName,
            'wxss中未使用的样式名称': cssUnUseList
        }
        console.log(failClassName.length, cssUnUseList.length)
        // console.log(useList)
        // console.log('str', varList)

    }
    console.log(result)
}
/**分析 css 文件结构 */
var analyzeWxss = () => {
    let list = fileNameList;
    console.log('分析', list)
    let reg = /\..*\{/gi; //匹配 . 和 { 之间的
    // let reg2 = /\..*\s/g
    let reg2 = /.(\S*)\s/
    cssList = {}
    for (let i = 0, len = list.length; i < len; i++) {
        let fName = list[i]
        let file_path = path.join(dir, fName + '.wxss')
        var str = fs.readFileSync(file_path, 'utf-8');
        // result[fName]=[]
        let arrCss = []
        let arr = str.match(reg)
        for (let j = 0, len = arr.length; j < len; j++) {

            let styleName = arr[j]
            // console.log(j,'a',styleName)
            //把{ > : 替换成空格
            styleName = styleName.replace(/\{|\>|\:/g, " ")
            //取第一个空格前面的内容，然后移除空格和.
            styleName = styleName.match(reg2)[0].replace(/(\.|\s*$)/g, "");
            if (arrCss.indexOf(styleName) == -1) {
                arrCss.push(styleName)
            }

        }
        cssList[fName] = arrCss
    }
    analyzeWxml()


    //分析css里的样式名
}
/**获取文件夹的结构 */
var getStructure = (callback) => {
    fs.exists(dir, (exist) => {
        if (!exist) {
            console.log('路径错误，文件夹不存在')
        } else {
            fs.readdir(dir, (err, list) => {
                let arrWxml = []
                let arrWxss = []
                let arrName = []
                let arrEnd = []; // 最终的文件名列表
                for (let i = 0, len = list.length; i < len; i++) {
                    let fName = list[i]
                    let f = path.parse(fName)
                    let extName = f.ext
                    if (extName === '.wxml') {
                        arrWxml.push(fName)
                    } else if (extName === '.wxss') {
                        arrWxss.push(fName)
                        arrName.push(f.name)
                        // console.log('f',f.name)
                    }
                    // console.log('ex',extName)
                }
                for (let i = 0, len = arrName.length; i < len; i++) {
                    let fName = arrName[i]
                    if (arrWxml.indexOf(fName + '.wxml') > -1) {
                        arrEnd.push(fName)
                    }
                }
                if (arrEnd.length > 0) {
                    fileNameList = arrEnd
                    callback()
                }
                // console.log('wx', arrWxss)
                // console.log('xml', arrWxml)
            })
        }
    })
}

var start = (_dir) => {
    dir = _dir
    getStructure(analyzeWxss)
}

module.exports = {
    start: start
}
