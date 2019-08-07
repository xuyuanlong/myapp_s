const codeMsg = {
  200: '操作成功',
  // 参数相关
  300: '参数错误',
  // 用户相关
  1001: '手机号已存在',
  1002:'用户已存在',


}
function returnJson(code,data) {
  let returnData = {
    code,
    msg: codeMsg[code],
  }
  if (data) {
    returnData.data = data;
  }
  return returnData;
}

module.exports = returnJson;