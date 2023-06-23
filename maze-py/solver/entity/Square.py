from solver.type.SquareState import SquareState


class Square:
    def __init__(self, x: int, y: int, state: SquareState):
        self.x = x
        self.y = y
        self.state = state
        self.neighbours = []

    def __repr__(self):
        return f'Square (x, y): ({self.x},{self.y}) of {self.state}'

    def reset(self):
        self.state = SquareState.EMPTY

    def is_visited(self):
        return self.state == SquareState.VISITED

    def is_wall(self):
        return self.state == SquareState.WALL

    def is_start(self):
        return self.state == SquareState.START

    def is_end(self):
        return self.state == SquareState.END

    def is_empty(self):
        return self.state == SquareState.EMPTY

    def change_state(self, state: SquareState):
        self.state = state
