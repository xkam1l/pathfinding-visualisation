import json
import time
from queue import Queue

from solver.entity.Square import Square
from solver.type.SquareState import SquareState
from solver.util import log


def solve_the_maze(temp_grid: list, start_square: dict, end_square: dict):
    def _recreate_grid():
        _temp_grid = list()

        for iy, y in enumerate(temp_grid):
            row = list()
            for ix, x in enumerate(y):
                row.append(Square(ix, iy, SquareState[x]))

            _temp_grid.append(row)

        return _temp_grid

    def _get_valid_neighbours(r: int, c: int):
        """
        Find valid neighbours for a square:
        valid means it's not a wall, has not been visited
        :param r: row
        :param c: column
        :return: valid neighbours
        :rtype: list()
        """
        up_neighbour = (r, c + 1)
        down_neighbour = (r, c - 1)
        left_neighbour = (r - 1, c)
        right_neighbour = (r + 1, c)

        neighbours = [up_neighbour, down_neighbour, left_neighbour, right_neighbour]
        v_neighbours = list()

        for neighbour in neighbours:
            r, c = neighbour
            if r in range(rows) and c in range(columns):
                if grid[c][r].state not in [SquareState.VISITED, SquareState.WALL, SquareState.START]:
                    v_neighbours.append(neighbour)

        return v_neighbours

    grid = _recreate_grid()
    rows = len(grid)
    columns = len(grid[0])

    start_pos = start_square.get('x'), start_square.get('y')
    end_pos = end_square.get('x'), end_square.get('y')

    log(f'Solving maze {rows}x{columns}')
    log(f'Start: {start_pos}')
    log(f'End: {end_pos}')

    finished = False

    final_moves = None
    q = Queue()
    q.put([start_pos])

    while not finished:
        moves_so_far = q.get()

        rx, cy = moves_so_far[len(moves_so_far) - 1]
        valid_neighbours = _get_valid_neighbours(rx, cy)

        for vn in valid_neighbours:
            moves_so_far_copy = moves_so_far.copy()
            rvn, cvn = vn
            moves_so_far_copy.append(vn)
            q.put(moves_so_far_copy)

            if (rvn, cvn) == end_pos:
                final_moves = moves_so_far_copy
                print()
                log(f'Path found, took {len(final_moves)} moves')
                log(f'Moves: {final_moves}')
                print()

                finished = True

                moves_dict_list = [{'x': d[0], 'y': d[1]} for d in final_moves]
                data = json.dumps({'finished': finished, 'moves': moves_dict_list})
                yield f'data: {data} \n\n'

                break

            data = json.dumps({'finished': finished, 'x': rvn, 'y': cvn})
            yield f'data: {data} \n\n'
            time.sleep(0.1)

            grid[cvn][rvn].change_state(SquareState.VISITED)
