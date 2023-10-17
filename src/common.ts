
export const limit = (min: number, max: number) => (value: number) => Math.max(Math.min(max, value), min);
export const ranger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const rdm = () => Math.random().toString(36).substr(2, 15);

interface IRect {
    left: number
    right: number
    top: number
    bottom: number
}

export function intersect(a: IRect, b: IRect) {
    return (
        a.left <= b.right &&
        a.right >= b.left &&
        a.top <= b.bottom &&
        a.bottom >= b.top
    );
}

export class Base {
    static now = Date.now()
    create_time = Date.now()
    x = 0
    y = 0
    w = 2
    h = 3
    // 一秒跑多少像素
    speed = 1
    color = '#000'
    age = 100
    disabled = false

    be() {
        return (Base.now - this.create_time) * (this.speed / 1000)
    }

    constructor(opt: Partial<Rain> = {}) {
        Object.assign(this, opt)
    }

    get top() {
        return this.y
    }

    get bottom() {
        return this.y + this.h
    }

    get left() {
        return this.x
    }

    get right() {
        return this.x + this.w
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.disabled) return
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    destroy() {
        if (this.disabled) return
        this.disabled = true
    }

    hit(rect: Base) {
        return intersect(this, rect)
    }
}

export class Rain extends Base{
    // constructor(o) {
    //     super(o);
    // }
    fall() {
        if (this.disabled) return
        this.y = this.be()
        if (this.y > this.age) {
            this.destroy()
        }
    }

    kill() {
        this.color = 'red'
        this.destroy()
    }
}

export class Man extends Base{
    name = rdm()
    rainCount = 0
    behind: number[] = []

    run() {
        if (this.disabled) return
        this.behind.push(this.x)
        this.x = this.be()

        if (this.x > this.age) {
            this.destroy()
        }
    }

    beRain(rain: Rain) {
        if (this.hit(rain)) {
            rain.kill()
            this.rainCount+=1
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.behind.forEach(x => {
            ctx.clearRect(x, this.y, 1, this.h)
        })
        this.behind.length = 0
        super.draw(ctx);
    }
}
