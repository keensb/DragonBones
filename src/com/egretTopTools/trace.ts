/**
 * Created by YeXin on 2015/12/12.
 */

/**
 * 自定义信息输出
 * 可以输出较完整的数组元素信息
 * @param args
 */
function trace(...args):void
{
    console.log(Array.prototype.join.call(arguments, " "));
}
