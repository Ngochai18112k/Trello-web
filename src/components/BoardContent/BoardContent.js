import Column from 'components/Column/Column';
import React, { useState, useEffect, useRef, useCallback } from 'react'
import './BoardContent.scss';
import { initialData } from 'actions/initialData';
import { isEmpty } from 'lodash';
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BContainer, Row, Col, Form, Button } from 'react-bootstrap';
function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumn, setOpenNewColumn] = useState(false);

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');
    const onNewColumnTitleChange = useCallback((e) => {
        setNewColumnTitle(e.target.value);
    }, []);


    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);

            //sort column
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumn]);

    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];

            let currentColumn = newColumns.find(c => c.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id);

            setColumns(newColumns);
        }
    }

    const toggleOpenNewColumn = () => {
        setOpenNewColumn(!openNewColumn);
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5), //random 5 char,will remove when we implement code api
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: [],
        }

        let newColumns = [...columns];
        newColumns.push(newColumnToAdd);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        setNewColumnTitle('');
        toggleOpenNewColumn();
    }

    const onUpdateColumn = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id;

        let newColumns = [...columns];
        const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate);

        if (newColumnToUpdate._destroy) {
            //remove column
            newColumns.splice(columnIndexToUpdate, 1);
        } else {
            //update column info
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
        }

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
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
                            <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
                        </Draggable>
                    ))
                }
            </Container>
            <BContainer className="bs-container">
                {!openNewColumn &&
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenNewColumn}>
                            <i className="fa fa-plus icon"></i>
                            Add another card
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
                            <span className="cancel-new-column" onClick={toggleOpenNewColumn}>
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
