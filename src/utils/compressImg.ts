import { Toast } from 'vant'


// 图片压缩(先放著吧，用了compressjs)
export const imgCompress = (path: any, obj: any, cb: Function) => { // path是指上传的图片，obj是压缩的品质，越低越模糊
    // let _this = this // 这里的this 是把vue的实例对象指向改变为_this
    var img = new Image()
    var urlFile
    img.src = path.src
    img.onload = function () {
        var that = this // 这里的this 是把img的对象指向改变为that
        // 默认按比例压缩
        let w = that.width
        let h = that.height
        let scale = w / h
        w = obj.width || w
        h = obj.height || (w / scale)
        var quality = 0.7 // 默认图片质量为0.7
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        // 创建属性节点
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL(path.type, quality)
        // 回调函数返回base64的值
        urlFile = convertBase64UrlToBlob(base64) // 这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断
        // console.log(urlFile)
        if (urlFile.size / 2048 > 1025) {
            Toast('图片过大，请重新选择图片')
        } else {
            cb.call(this, urlFile)
        }
    }
}
// 将base64码转化为file（Blob）
// 此处函数对压缩后的base64经过处理返回{size: "", type: ""}
const convertBase64UrlToBlob = (urlData: string) => {
    var byteString = atob(urlData.split(',')[1])
    var mimeString = urlData.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {
        type: mimeString
    })
}

