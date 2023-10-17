// noinspection JSConstantReassignment

import './style.css'
import { event } from "./event.ts";
import {Man, Base, Rain, ranger} from './common.ts'

const cvs = document.getElementById('app') as HTMLCanvasElement
cvs.width = cvs.clientWidth
cvs.height = cvs.clientHeight
const context = cvs.getContext('2d')
if (context) {

    const state = {
        rains: [] as Rain[],
        people: [] as Man[]
    }
    
    const born = () => {
        const dead =  state.people.filter(i => i.disabled)
        state.people = state.people.filter(i => !i.disabled)
        dead.length && event.emit('dead', dead)
        dead.forEach(it => {
            console.log('%s 速度 %i 被淋了 %i 点雨',it.name, it.speed,  it.rainCount)
        })
        
        if (!state.people.length) {
            state.people.push(
                new Man({age: cvs.width, speed: ranger(100, 1000),x: 0, y: cvs.height - 110, w: 50, h: 100, color: 'yellowgreen'})
            )
        }
        
    }

    const mkRains = () => {
        const rains = Array(ranger(0, 50)).fill(0).map(() => new Rain({
            color: 'red',
            x: ranger(0, cvs.width),
            y: -1,
            speed: ranger(100, 200),
            age: cvs.height
        }))
        state.rains = [
            ...state.rains.filter(r => !r.disabled),
            ...rains
        ]
    }
    

    function gameLoop() {
        setInterval(() => {
            mkRains()
            born()

        }, 16)

        setInterval(() => {
            Base.now = Date.now()
            state.rains.forEach(r => {
                r.fall()
                state.people.forEach(m => m.beRain(r))
            })
            state.people.forEach(m => m.run())
        }, 1)
    }


    const draw = () => {
        context.fillStyle = 'rgba(255,255,255,0.2)'
        context.fillRect(0, 0, cvs.width, cvs.height)
        state.rains.forEach(r => r.draw(context))
        state.people.forEach(r => r.draw(context))
    }

    function main() {
        mkRains()
        gameLoop()
        setInterval(() => draw(), 16)
    }

    main()
}



