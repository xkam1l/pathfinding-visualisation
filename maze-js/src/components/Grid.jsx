import React from "react";

import ControlPanel from "./ControlPanel";
import Square from "./Square";

import SquareState from "../SquareState";
import SquareSelector from "../SquareSelector";

import axios from "axios";

const X_MAX = 23;
const Y_MAX = 23;

const Grid = () => {
    const [grid, setGrid] = React.useState([]);
    const [startSquare, setStartSquare] = React.useState({x: undefined, y: undefined});
    const [endSquare, setEndSquare] = React.useState({x: undefined, y: undefined});
    const [squareSelector, setSquareSelector] = React.useState(SquareSelector.DEFAULT);
    const [resolutionRequested, setResolutionRequested] = React.useState(false);

    const onSolveRequest = async () => {
        setResolutionRequested(true);
        
        return axios.post('http://localhost:5000/api/maze', {
            grid: grid,
            startSquare: startSquare,
            endSquare: endSquare
        });
    }

    const makePath = coords => {
        changeSquareState(coords, SquareState.PATH);
    }

    const visitSquare = coords => {
        changeSquareState(coords, SquareState.VISITED);
    }

    const resetStartSquare = () => {
        if (startSquare.x !== undefined) {
            resetSquareState({x: startSquare.x, y: startSquare.y});
        }

        setStartSquare({x: undefined, y: undefined});
    }

    const resetEndSquare = () => {
        if (endSquare.x !== undefined) {
            resetSquareState({x: endSquare.x, y: endSquare.y});
        }
        setEndSquare({x: undefined, y: undefined});
    }

    const initGrid = () => {
        const tempGrid = Array.from(Array(Y_MAX), () => new Array(X_MAX).fill(SquareState.DEFAULT));
        setGrid(tempGrid);

        resetStartSquare();
        resetEndSquare();
    };

    const changeSquareState = (coords, enforcedState = null) => {
        const {x, y} = coords;

        const tempGrid = [...grid]; // arrays are mutable => reference stays the same

        if (!enforcedState) {
            if (squareSelector === SquareSelector.START) {
                resetStartSquare();
                setStartSquare(({x: x, y: y}));
            } else if (squareSelector === SquareSelector.END) {
                resetEndSquare();
                setEndSquare(({x: x, y: y}));
            }
        }

        tempGrid[y][x] = enforcedState ? enforcedState : squareSelector;

        setGrid(tempGrid);
    };

    const resetSquareState = coords => {
        const {x, y} = coords;

        const tempGrid = [...grid]; // arrays are mutable => reference stays the same
        tempGrid[y][x] = SquareState.DEFAULT;

        setGrid(tempGrid);
    }

    React.useState(() => {
        initGrid();
    }, []);

    return (
        <div id='grid'>
            <ControlPanel startSquare={startSquare}
                          endSquare={endSquare}
                          squareSelector={squareSelector}
                          onSetSquareSelector={setSquareSelector}
                          onResetGrid={resolutionRequested ? null : initGrid}
                          onResetStartSquare={resolutionRequested ? null : resetStartSquare}
                          onResetEndSquare={resolutionRequested ? null : resetEndSquare}
                          onSetStartSelector={() => setSquareSelector(SquareSelector.START)}
                          onSetEndSelector={() => setSquareSelector(SquareSelector.END)}
                          onSolveRequest={resolutionRequested ? null : onSolveRequest}
                          onVisitSquare={visitSquare}
                          onMakePath={makePath}/>

            {grid.map((row, _y) =>
                row.map((_, _x) =>
                    <Square key={`Square(${_x},${_y})`}
                            coords={{x: _x, y: _y}}
                            state={grid[_y][_x]}
                            isLastSquareInTheRow={_x === X_MAX - 1}
                            onChangeSquareState={resolutionRequested ? null : changeSquareState}
                            onResetSquareState={resolutionRequested ? null : resetSquareState}/>))}
        </div>
    );
}

export default Grid;