import React from 'react';

import {Button, MenuItem, Paper, Select, Tooltip} from "@mui/material";
import SquareSelector from "../SquareSelector";


const ControlPanel = props => {

    const {
        startSquare, endSquare, squareSelector, onSetSquareSelector, onResetGrid,
        onResetStartSquare, onResetEndSquare, onSetStartSelector, onSetEndSelector,
        onSolveRequest, onVisitSquare, onMakePath
    } = props;

    const requestSolve = async () => {
        if (startSquare.x === undefined || endSquare.x === undefined) {
            console.log('You need a start and end point');
            return;
        }

        console.log('Requesting resolution');

        const requestResponse = await onSolveRequest();
        if (requestResponse.status !== 202) {
            console.error(`Request unsuccessful [statusCode = ${requestResponse.status}]`);
            return;
        }

        console.log(`Request successful [statusCode = ${requestResponse.status}]`);
        console.log(requestResponse.data)

        const sse = new EventSource('http://localhost:5000/api/maze/stream');

        const handleStream = e => {
            const responseData = JSON.parse(e.data);

            if (responseData.finished) {
                console.log('finished');
                responseData.moves.forEach(move => {
                    onMakePath(move);
                })

                sse.close();
                return;
            }

            onVisitSquare({x: responseData.x, y: responseData.y});
        }

        sse.onmessage = e => handleStream(e);

        return () => sse.close();
    };

    return (
        <Paper id='control-panel' elevation={3}>
            <Tooltip title={'Set or reset'} placement={'left'}>
                <Button onClick={startSquare.x === undefined ? onSetStartSelector : onResetStartSquare}>
                    {startSquare.x && <>
                        START: {`${startSquare.x},${startSquare.y}`}
                    </>}
                    {!startSquare.x && 'START NOT DEFINED'}
                </Button>
            </Tooltip>
            <Tooltip title={'Set or reset'} placement={'right'}>
                <Button onClick={endSquare.x === undefined ? onSetEndSelector : onResetEndSquare}>
                    {endSquare.x && <>
                        END: {`${endSquare.x},${endSquare.y}`}
                    </>}
                    {!endSquare.x && 'END NOT DEFINED'}
                </Button>
            </Tooltip>

            <br/>

            <Select value={squareSelector} onChange={event => onSetSquareSelector(event.target.value)}
                    sx={{height: '40px', marginRight: '10px'}}>
                {Object.keys(SquareSelector).map(key => key === 'DEFAULT' ? '' :
                    <MenuItem key={key} value={key}> {SquareSelector[key]} </MenuItem>)}
            </Select>

            <Button variant={'outlined'} onClick={onResetGrid}>
                RESET GRID
            </Button>

            <br/>

            <Button sx={{marginTop: '5px'}} onClick={requestSolve}>solve</Button>
        </Paper>
    );
}

export default ControlPanel;