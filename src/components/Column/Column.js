import Card from 'components/Card/Card';
import React, { useCallback, useEffect, useState } from 'react';
import './Column.scss';
import ConfirmModal from 'components/Commons/ConfirmModal';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';
import { saveContentAfterTitleBlur, selectAllInlineText } from 'utilities/contetEditable';
import { mapOrder } from 'utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';

function Column(props) {
    const { column, onCardDrop, onUpdateColumn } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [showCofirmModal, setShowConfirmModal] = useState(false);
    const toggleShowConfirmModal = () => {
        setShowConfirmModal(!showCofirmModal);
    }

    const [columnTitle, setColumnTitle] = useState('');
    const handleColumnTitleChange = useCallback((e) => {
        setColumnTitle(e.target.value);
    }, []);

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            //remove column
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn);
        }
        toggleShowConfirmModal();
    }

    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newColumn);
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
                            <Dropdown.Item>Add card...</Dropdown.Item>
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
                    onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
            </div>
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon"></i>
                    Add another card
                </div>
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
