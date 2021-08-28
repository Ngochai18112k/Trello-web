import Card from 'components/Card/Card';
import React, { useEffect, useRef, useState } from 'react';
import './Column.scss';
import ConfirmModal from 'components/Commons/ConfirmModal';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';
import { saveContentAfterTitleBlur, selectAllInlineText } from 'utilities/contetEditable';
import { mapOrder } from 'utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { createNewCard, updateColumn } from 'actions/ApiCall';

function Column(props) {
    const { column, onCardDrop, onUpdateColumnState } = props;
    const cards = mapOrder(column.cards, column.cardOrder, '_id');

    const [showCofirmModal, setShowConfirmModal] = useState(false);
    const toggleShowConfirmModal = () => {
        setShowConfirmModal(!showCofirmModal);
    }

    const [columnTitle, setColumnTitle] = useState('');
    const handleColumnTitleChange = (e) => {
        setColumnTitle(e.target.value);
    };

    const [openNewCard, setOpenNewCard] = useState(false);
    const toggleOpenNewCard = () => {
        setOpenNewCard(!openNewCard);
    }

    const [newCardTitle, setNewCardTitle] = useState('');
    const onNewCardTitleChange = (e) => {
        setNewCardTitle(e.target.value);
    };

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    const newCardTextareaRef = useRef(null);
    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus();
            newCardTextareaRef.current.select();
        }
    }, [openNewCard]);

    //remove column
    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            //remove column
            const newColumn = {
                ...column,
                _destroy: true
            }

            //call api remove column
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                onUpdateColumnState(updatedColumn);
            });
        }
        toggleShowConfirmModal();
    }

    //update column title
    const handleColumnTitleBlur = () => {
        if (columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle
            }

            //call api update column
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                updatedColumn.cards = newColumn.cards;
                onUpdateColumnState(updatedColumn);
            });
        }
    }

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus();
            return;
        }

        const newCardToAdd = {
            boardId: column.boardId,
            columnId: column._id,
            title: newCardTitle.trim()
        }
        //call API
        createNewCard(newCardToAdd).then(card => {
            let newColumn = cloneDeep(column);
            newColumn.cards.push(card);
            newColumn.cardOrder.push(card._id);

            onUpdateColumnState(newColumn);
            setNewCardTitle('');
            toggleOpenNewCard();
        })
    }

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        className="trello-content-editable"
                        value={columnTitle}
                        onChange={handleColumnTitleChange}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterTitleBlur}
                        onClick={selectAllInlineText}
                        onMouseDown={e => e.preventDefault()}
                        spellCheck="false"
                    />
                </div>
                <div className="column-drop-down-actions">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" id="dropdown-basic" className="dropdown-btn" />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={toggleOpenNewCard}>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
                            <Dropdown.Item>Move all cards in this column...</Dropdown.Item>
                            <Dropdown.Item>Archire all cards in this column...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="card-list">
                <Container
                    orientation="vertical"
                    groupName="columns"
                    onDrop={dropResult => onCardDrop(column._id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-previrew'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card} />
                        </Draggable>
                    ))}
                </Container>
                {openNewCard &&
                    <div className="add-new-card-area">
                        <Form.Control
                            size="sm"
                            as="textarea"
                            rows="3"
                            placeholder="Enter a title for this card..."
                            className="textarea-enter-new-card"
                            ref={newCardTextareaRef}
                            value={newCardTitle}
                            onChange={onNewCardTitleChange}
                            onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                        />
                    </div>
                }
            </div>
            <footer>
                {openNewCard &&
                    <div className="add-new-card-actions">
                        <Button
                            variant="success"
                            size="sm"
                            onClick={addNewCard}
                        >
                            Add card
                        </Button>
                        <span className="cancel-icon" onClick={toggleOpenNewCard}>
                            <i className="fa fa-trash icon"></i>
                        </span>
                    </div>
                }
                {!openNewCard &&
                    <div className="footer-actions" onClick={toggleOpenNewCard}>
                        <i className="fa fa-plus icon"></i>
                        Add another card
                    </div>
                }
            </footer>
            <ConfirmModal
                show={showCofirmModal}
                onAction={onConfirmModalAction}
                title="Remove list"
                content={`Are you sure you want to remove <strong>${column.title}</strong>! <br />All related cards will also be removed!`}
            />
        </div>
    )
}

export default Column
