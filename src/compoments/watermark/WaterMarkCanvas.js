// Created by liuliyuan on 2018/8/1
export default function getWaterMarkCanvas(text, options) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const canvasWidth = 4000
    const canvasHeight = 4000
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx.textAlign = options.textAlign
    ctx.textBaseline = options.textBaseline
    ctx.globalAlpha = options.globalAlpha
    ctx.font = options.font

    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate(options.rotateAngle)

    ctx.translate(-canvasWidth / 2 * 1.2, -canvasHeight / 2 * 1.2)
    ctx.fillStyle = options.fillStyle

    const waterMarkText = []
    const chunkWidth = options.chunkWidth
    const chunkHeight = options.chunkHeight
    const horizontalChunkCount = Math.ceil(canvasWidth / chunkWidth) + 1
    const verticalChunkCount = Math.ceil(canvasHeight / chunkHeight) + 1

    for (let j = 0, initY = chunkHeight / 2, indent = 0; j <= verticalChunkCount; j += 1) {
        indent = parseInt(j % 2, 0)

        for (let i = 0, initX = chunkWidth / 2; i <= horizontalChunkCount; i += 1) {
            waterMarkText.push({
                text,
                x: i * chunkWidth + indent * initX,
                y: j * chunkHeight + initY
            })
        }
    }

    waterMarkText.forEach((item) => {
        //ctx.fillText(item.text, item.x, item.y)
        //ctx.fillText(moment().format('YYYY-MM-DD HH:mm'), item.x-25, item.y+20)
        let txt = item.text.split(',');
        txt.forEach((t,i)=>{
            switch (i){
                case 0:
                    ctx.fillText(t, item.x, item.y)
                    break
                case 1:
                    ctx.fillText(t, item.x-10, item.y+25)
                    break
                case 2:
                    ctx.fillText(t, item.x-40, item.y+50)
                    break
                default:
                    ctx.fillText(t, item.x, item.y)
                    break
            }
            /*i=i+1;
            if(i===1){
                ctx.fillText(t, item.x, item.y)
            }else{
                ctx.fillText(t, item.x-45*i, item.y+30*i)
            }*/
        })

    })

    return ctx.canvas.toDataURL()
}
