import Column from 'components/Column/Column';
import React, { useState, useEffect, useRef } from 'react'
import './BoardContent.scss';
import { isEmpty, cloneDeep } from 'lodash';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { fetchBoardDetails, createNewColumn, updateBoard, updateColumn, updateCard } from 'actions/ApiCall';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    const [openNewColumn, setOpenNewColumn] = useState(false);
    const toggleOpenNewColumn = () => {
        setOpenNewColumn(!openNewColumn);
    }

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');
    const onNewColumnTitleChange = (e) => {
        setNewColumnTitle(e.target.value);
    };


    useEffect(() => {
        const boardId = '6129fc7c2a9963fc8c719d40';
        fetchBoardDetails(boardId).then(board => {
            setBoard(board);
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
        })
    }, []);

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumn]);

    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board not found !</div>
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = cloneDeep(columns);
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumns.map(c => c._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        //call api update columnOrder in board details
        updateBoard(newBoard._id, newBoard).catch(() => {
            setColumns(columns);
            setBoard(board);
        });

    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = cloneDeep(columns);

            let currentColumn = newColumns.find(c => c._id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(i => i._id);

            setColumns(newColumns);
            if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
                /**
                 * action: move card inside its column
                 * 1 - call api update cardOrder in current column
                 */
                updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));
            } else {
                /**
                 * action: move card beetween two column
                 */
                //1 - call api update cardOrder in current column
                updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));

                if (dropResult.addedIndex !== null) {
                    let currentCard = cloneDeep(dropResult.payload);
                    currentCard.columnId = currentColumn._id;

                    //2 - call api update columnId in current card
                    updateCard(currentCard._id, currentCard);
                }
            }
        }
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            boardId: board._id,
            title: newColumnTitle.trim()
        }
        //call API
        createNewColumn(newColumnToAdd).then(column => {
            let newColumns = cloneDeep(columns);
            newColumns.push(column);

            let newBoard = cloneDeep(board);
            newBoard.columnOrder = newColumns.map(c => c._id);
            newBoard.columns = newColumns;

            setColumns(newColumns);
            setBoard(newBoard);
            setNewColumnTitle('');
            toggleOpenNewColumn();
        });
    }

    const onUpdateColumnState = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate._id;

        let newColumns = cloneDeep(columns);
        const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate);

        if (newColumnToUpdate._destroy) {
            //remove column
            newColumns.splice(columnIndexToUpdate, 1);
        } else {
            //update column info
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
        }

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumns.map(c => c._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
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
                            <Column
                                column={column}
                                onCardDrop={onCardDrop}
                                onUpdateColumnState={onUpdateColumnState}
                            />
                        </Draggable>
                    ))
                }
            </Container>
            <BContainer className="bs-container">
                {!openNewColumn &&
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenNewColumn}>
                            <i className="fa fa-plus icon"></i>
                            Add another column
                        </Col>
                    </Row>
                }
                {openNewColumn &&
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button
                                variant="success"
                                size="sm"
                                onClick={addNewColumn}
                            >
                                Add list
                            </Button>
                            <span className="cancel-icon" onClick={toggleOpenNewColumn}>
                                <i className="fa fa-trash icon"></i>
                            </span>
                        </Col>
                    </Row>
                }
            </BContainer>
        </div>
    )
}

export default BoardContent
