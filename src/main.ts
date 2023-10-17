import './style.css'
import { event } from "./event.ts";
import { Man, Base, Rain, ranger } from './common.ts'

function main() {
    const cvs = document.getElementById('app') as HTMLCanvasElement
    cvs.width = cvs.clientWidth
    cvs.height = cvs.clientHeight
    const context = cvs.getContext('2d')
    if (!context) return

    const state = {
        rains: [] as Rain[],
        people: [] as Man[]
    }

    const born = () => {
        const dead = state.people.filter(i => i.disabled)
        state.people = state.people.filter(i => !i.disabled)
        dead.length && event.emit('dead', dead)
        if (!state.people.length) {
            state.people.push(
                new Man({
                    age: cvs.width,
                    speed: ranger(1, 2000),
                    x: 0,
                    y: cvs.height - 110,
                    w: 50,
                    h: 100,
                    color: 'yellowgreen'
                })
            )
        }
    }

    const mkRains = () => {
        const rains = Array(ranger(1, 5)).fill(0).map(() => new Rain({
            color: 'red',
            x: ranger(0, cvs.width),
            y: -10,
            speed: ranger(100, 200),
            age: cvs.height
        }))
        state.rains = [
            ...state.rains.filter(r => !r.disabled),
            ...rains
        ]
    }


    // 逻辑loop
    function logicLoop() {
        // 降雨频率
        setInterval(() => {
            mkRains()
            born() // 出生人数为1，其实不受影响
        }, 16)

        // 逻辑loop的频率是1ms，可以将它看作这个游戏的普朗克时间，即时间像素
        setInterval(() => {
            Base.now = Date.now()
            // 每轮都会触发下坠/前进/碰撞
            state.rains.forEach(r => {
                r.fall()
                state.people.forEach(m => m.beRain(r))
            })
            state.people.forEach(m => m.run())
        }, 1)
    }


    // 绘制loop
    const renderLoop = () => {
        const draw = () => {
            context.fillStyle = 'rgba(255,255,255,0.2)'
            context.fillRect(0, 0, cvs.width, cvs.height)
            state.rains.forEach(r => r.draw(context))
            state.people.forEach(r => r.draw(context))

            requestAnimationFrame(draw)
        }

        draw()
    }


    logicLoop()
    renderLoop()
}

main()


