from flask import Flask, Response, request
from flask_cors import CORS

from solver.solver import solve_the_maze

app = Flask(__name__)
CORS(app)

start_square = None
end_square = None
maze_to_solve = list()


@app.route('/api/maze', methods=['POST'])
def solve_maze():
    global maze_to_solve, start_square, end_square

    body = request.json
    maze_to_solve = body.get('grid')
    start_square = body.get('startSquare')
    end_square = body.get('endSquare')

    return 'Request accepted', 202


@app.route('/api/maze/stream')
def stream():
    global maze_to_solve, start_square, end_square

    return Response(solve_the_maze(maze_to_solve, start_square, end_square), mimetype='text/event-stream')


@app.route('/')
def home():
    return 'HELLO'


if __name__ == '__main__':
    app.run(debug=True)
