// 输入输出的圆圈的外边圈，50%透明度
export function outPortColor(colorString) {
    return colorString + '80';
}

export function getOpacityColor(color, opacity) {
    let originColor = color.toLowerCase(); 
    //十六进制颜色值的正则表达式
    const pattern = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (originColor && pattern.test(originColor)) {
        if (originColor.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += originColor.slice(i, i + 1).concat(originColor.slice(i, i + 1));
            }
            originColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + originColor.slice(i, i + 2)));
        }
        return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')';
    } else {
        console.error('请输入标准16进制颜色格式');
    }
    return originColor;
}

// 选中态背景色。变淡，但不能完全由透明控制，否则连接线会透出来，会很乱
export function selectColor(colorString) {
    let r = colorString.substr(1, 2);
    let g = colorString.substr(3, 2);
    let b = colorString.substr(5, 2);
    const makeShallow = (singleColorStr) => {
        return parseInt(String(255 - (255 - parseInt(singleColorStr, 16)) * 0.5)).toString(16);
    };
    r = makeShallow(r);
    g = makeShallow(g);
    b = makeShallow(b);
    return '#' + r + g + b + 'b0';
}

/**
 * 计算 port 位置
 * @param wh 长度 / 宽度
 * @param index 当前 port 的索引，从 0 开始
 * @param len port 数组的长度
 * @param orientation 水平 / 竖直 布局
 */
export function portXY(
    wh: number,
    index: number,
    len: number,
    orientation: 'horizontal' | 'vertical' = 'vertical',
    type: 'x' | 'y' = 'x'
) {
    const distanceMap = {
        horizontal: {
            x: 0,
            y: (wh / (len + 1)) * (index + 1),
        },
        vertical: {
            x: (wh / (len + 1)) * (index + 1),
            y: 0,
        },
    };
    return distanceMap[orientation][type];
}

/**
 * 判断函数是否为布尔类型
 * @param val 需要被判断的值
 * @returns 是否为布尔类型
 */
export function isBoolean(val: unknown): boolean {
    return typeof val === 'boolean';
}
