import enum


class SquareState(enum.Enum):
    START = 'START'
    EMPTY = 'EMPTY'
    VISITED = 'VISITED'
    WALL = 'WALL'
    PATH = 'PATH'
    END = 'END'
