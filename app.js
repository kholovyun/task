const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

const match = /(?<value>\d+\.?\d*)/;

const setFontSize = (size) => ctx.font = ctx.font.replace(match, size);

const adjustFontSize = (amount) => {
  const newSize = parseFloat(ctx.font.match(match).groups.value + amount);
  return ctx.font = ctx.font.replace(match, newSize);
}

class Cell {
    constructor(value) {
        this.value = value
        this.children = []
        this.parent = null
        this.pos = { x: 0, y: 0 }
        this.rad = 30
    }

    get left() {
        return this.children[0]
    }

    set left(value) {
        value.parent = this
        this.children[0] = value
    }

    get right() {
        return this.children[1]
    }

    set right(value) {
        value.parent = this
        this.children[1] = value
    }

    set position(position) {
        this.pos = position
    }

    get position() {
        return this.pos
    }

    get radius() {
        return this.rad
    }

}

class Tree {
    constructor() {
        this.root = null;
        this.startPosition = { x: 1000, y: 44 }
        this.axisX = 350
        this.axisY = 80

    }

    getPosition({ x, y }, isLeft = false) {
        return { x: isLeft ? x - this.axisX + y : x + this.axisX - y, y: y + this.axisY }
    }

    add(value) {
        const newCell = new Cell(value);
        if (this.root == null) {
            newCell.position = this.startPosition
            this.root = newCell
        }
        else {
            let cell = this.root
            while (cell) {
                if (cell.value == value)
                    break;
                if (value > cell.value) {
                    if (cell.right == null) {
                        newCell.position = this.getPosition(cell.position)
                        cell.right = newCell
                        break;
                    }
                    cell = cell.right
                }
                else {
                    if (cell.left == null) {
                        newCell.position = this.getPosition(cell.position, true)
                        cell.left = newCell
                        break;
                    }
                    cell = cell.left
                }
            }
        }
    }

    all(cell) {
        if (cell === undefined)
            return
        else {
            console.log(cell.value)
            this.all(cell.left)
            this.all(cell.right)
        }
    }

    getAll() {
        this.all(this.root)
    }

    render() {
        const queue = [];

        queue.push(this.root);

        while (queue.length !== 0) {
            const cell = queue.shift();
            const { x, y } = cell.position
            ctx.beginPath();
            ctx.stroke()
            ctx.strokeText(cell.value, x, y)
            setFontSize(18);

            cell.children.forEach(child => {
                const { x: x1, y: y1 } = child.position;
                ctx.beginPath();
                ctx.moveTo(x, y + 35);
                ctx.lineTo(x1, y1 + 20)
                ctx.stroke();
                queue.push(child);
                
            });

        }
    }

}

const bTree = new Tree();
bTree.add(10)
bTree.add(5)
bTree.add(15)
bTree.render()



document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        let ran = Math.floor(Math.random() * 201) - 100;
        bTree.add(ran)
        bTree.render()
    }
  })