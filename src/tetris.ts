export const WIDTH = 10;
export const HEIGHT = 20;

export enum Field {
  Empty = "EMPTY",
  Filled = "FILLED",
}

export class Game {
  fields: Field[][] = new Array(WIDTH).fill(false).map(() => new Array(HEIGHT).fill(Field.Empty));
  cur_piece: Field[][] = new Array(4).fill(false).map(() => new Array(4).fill(Field.Empty));
  //cur_pos: [number, number] = [0, -];
  cur_x: number = 0;
  cur_y: number = -1;
  score:number = 0;
  actions:number = 0;

  constructor() {
    this.new_piece();
  }

  rand() {
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        this.fields[i][j] = Math.random() > 0.5 ? Field.Empty : Field.Filled;
      }
    }
  }

  move_left() {
    this.move(-1);
  }

  move(size: number) {
    /* for (let i = 0; i < 4; i++) {
       if (this.cur_x + i + size < 0 || this.cur_x + i + size >= WIDTH) {
         for (let j = 0; j < 4; j++) {
           if (this.cur_piece[i][j] == Field.Filled) {
             return;
           }
         }
       }
     }*/
    this.cur_x += size;
    if (this.collides_or_oob()) {
      this.cur_x -= size;
    }
  }

  move_right() {
    this.move(1);
  }

  rotate_cw() {
    rotateCw(this.cur_piece);
    if (this.collides_or_oob()) {
      rotateCcw(this.cur_piece);
    }
  }

  rotate_ccw() {
    rotateCcw(this.cur_piece);
    if (this.collides_or_oob()) {
      rotateCw(this.cur_piece);
    }
  }

  move_down() {
    do {
      this.cur_y++;
    } while (!this.collides_or_oob());
    this.cur_y--;
  }
  move_up() {
    do {
      this.cur_y--;
    } while (!this.collides_or_oob());
    this.cur_y++;
  }

  collides_or_oob() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.cur_piece[i][j] == Field.Filled) {
          if (this.cur_x + i < 0 || this.cur_x + i >= WIDTH || this.cur_y + j < 0 || this.cur_y + j >= HEIGHT) {
            return true;
          }
          let field_at_pos = this.fields[this.cur_x + i][this.cur_y + j];
          if (field_at_pos == undefined || field_at_pos == Field.Filled) {
            return true;

          }
        }
      }
    }
    return false;
  }

  collides(): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.cur_piece[i][j] == Field.Filled) {
          //console.log(this.cur_x + i, this.cur_y + j);
          let field_at_pos = this.fields[this.cur_x + i][this.cur_y + j];
          if (field_at_pos == undefined || field_at_pos == Field.Filled) {
            return true;

          }
        }
        //console.log(this.fields[this.cur_x + i][this.cur_y + j]);
      }

    }
    return false;
  }

  new_piece() {
    for (let i = 0; i < 4; i++) {
      this.cur_piece[i].fill(Field.Empty);
    }
    // todo
    switch (Math.round(Math.random() * 7) % 7) {
      case 0: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 1: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[3][2] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 2: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[1][3] = Field.Filled;
        this.cur_piece[1][0] = Field.Filled;
        break;
      }
      case 3: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][0] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 4: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[3][1] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 5: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[1][3] = Field.Filled;
        this.cur_piece[2][3] = Field.Filled;
        break;
      }
      case 6: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[1][3] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        break;
      }

    }
  }

  place() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.cur_piece[i][j] == Field.Filled) {
          this.fields[this.cur_x + i][this.cur_y + j] = Field.Filled;
        }
      }
    }
  }

  tick() {
    this.remove_complete();
    this.cur_y += 1;
    if (this.collides()) {
      this.cur_y -= 1;
      this.place();
      this.cur_x = 0;
      this.cur_y = 0;
      this.new_piece();
      if (this.collides()) {
        this.fields = new Array(WIDTH).fill(false).map(() => new Array(HEIGHT).fill(Field.Empty));
        this.move_up();
      }
    }
  }

  remove_complete() {
    for (let j = 0; j < HEIGHT; j++) {
      let complete = true;
      for (let i = 0; i < WIDTH; i++) {
        if (this.fields[i][j] == Field.Empty) {
          complete = false;
          break;
        }
      }
      if (complete) {
        this.score++;
        for (let j2 = j; j2 > 0; j2--) {
          for (let i = 0; i < WIDTH; i++) {
            this.fields[i][j2] = this.fields[i][j2 - 1];
          }
        }
      }
    }
  }
}

// tohle jsem už programoval kvůli leetcodu lol
function rotateCw<T>(matrix: T[][]): void {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j <= i; j++) {
      let original = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = original;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].reverse();
  }
};

function rotateCcw<T>(matrix: T[][]): void {
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].reverse();
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j <= i; j++) {
      let original = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = original;
    }
  }

};





