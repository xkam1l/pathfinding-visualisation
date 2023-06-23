import React from 'react';
import SquareState from "../SquareState";

const Square = props => {
    const {coords, state, isLastSquareInTheRow, onChangeSquareState, onResetSquareState} = props;

    const logSquare = () => {
        const {x, y} = coords;
        console.log(`Square(${x},${y})`);
        console.log(`State ${state}`);
        console.log(`isLastSquareInTheRow ${isLastSquareInTheRow}`);
    }

    const handleContextMenu = event => {
        event.preventDefault();
        // logSquare();
    }

    const handleMouseDown = event => {
        // console.log('handleMouseDown');
        // logSquare();
        // console.log(event);

        switch (event.buttons) {
            case 1:
                onChangeSquareState(coords);
                return;
            case 2:
                onResetSquareState(coords);
                return;
            case 4: //scroll button
                logSquare();
                return;
            default:
                return;
        }
    }

    const handleMouseEnter = event => {
        // console.log('handleMouseEnter');
        // logSquare();
        // console.log(event);

        switch (event.buttons) {
            case 1:
                onChangeSquareState(coords);
                return;
            case 2:
                onResetSquareState(coords);
                return;
            default:
                return;
        }
    }

    const getClassNameFromState = () => {
        switch (state) {
            case SquareState.START:
                return 'start';
            case SquareState.EMPTY:
                return 'empty';
            case SquareState.VISITED:
                return 'visited';
            case SquareState.WALL:
                return 'wall';
            case SquareState.PATH:
                return 'path';
            case SquareState.END:
                return 'end';

            default:
                return 'empty';
        }
    }

    return (
        <>
            <div className={`square ${getClassNameFromState()}`}
                 onContextMenu={event => handleContextMenu(event)}
                 onMouseDown={event => handleMouseDown(event)}
                 onMouseEnter={event => handleMouseEnter(event)}/>
            {isLastSquareInTheRow && <br/>}
        </>
    );
}

export default Square;