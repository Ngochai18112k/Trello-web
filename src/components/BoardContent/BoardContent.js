import Column from 'components/Column/Column';
import React, { useState, useEffect } from 'react'
import './BoardContent.scss';
import { initialData } from 'actions/initialData';
import { isEmpty } from 'lodash';
import { mapOrder } from 'utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);

            //sort column
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, [])

    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
    }

    const onColumnDrop = (dropResult) => {

    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-previrew'
                }}
            >
                {
                    columns.map((column, index) => (
                        <Draggable key={index}>
                            <Column column={column} />
                        </Draggable>
                    ))
                }
            </Container>
        </div>
    )
}

export default BoardContent
