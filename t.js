// var str = '.bottomArea .item button ';
// let reg = /.(\S*)\s/
// var res =str.match(reg)
// console.log(res)


// var str = "sadfas'dsafsa'safd'"
// str = str.replace(/\'/g,'"')
// console.log(str)

// var str = ' <view class="circle1"></view>asdfasdf<view class="spinner-container container1">sdafasdf <view class="circle2"></view>'
// let reg = /class=\"(.*?)\"/g; //匹配 . 和 { 之间的
// arr = str.match(reg)
// console.log(arr)

var str='11231<!--sadfasd --><!--sadfaqweqwsdf -->sadf'
let reg = /\<\!\-\-(.*?)\-\-\>/g
let arr = str.match(reg)
console.log(arr)
