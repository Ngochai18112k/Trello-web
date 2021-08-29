import React from 'react'
import './BoardBar.scss';
import { Container as BSContainer, Row, Col } from 'react-bootstrap';

function BoardBar() {
    return (
        <nav className="navbar-board">
            <BSContainer className="trello-container">
                <Row>
                    <Col sm={10} xs={12} className="col-no-padding">
                        <div className="board-info">
                            <div className="item board-logo-icon"><i className="fa fa-coffee" />&nbsp;&nbsp;<strong>Trello To do list</strong></div>
                            <div className="divider"></div>

                            <div className="item board-type">Private workspace</div>
                            <div className="divider"></div>

                            <div className="item member-avatar">
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                                <span className="more-members">+7</span>
                                <span className="invite">Invite</span>
                            </div>
                        </div>
                    </Col>
                    <Col sm={2} xs={12} className="col-no-padding">
                        <div className="board-actions">
                            <div className="item menu"><i className="fa fa-ellipsis-h mr-2" />&nbsp;&nbsp;Show menu</div>
                        </div>
                    </Col>
                </Row>
            </BSContainer>
        </nav>
    )
}

export default BoardBar
