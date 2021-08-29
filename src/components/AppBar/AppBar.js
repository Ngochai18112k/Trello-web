import React from 'react'
import './AppBar.scss';
import { Container as BSContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import imgLogo from 'resources/images/Trello-logo.png';

function AppBar() {
    return (
        <nav className="navbar-app">
            <BSContainer className="trello-container">
                <Row>
                    <Col sm={5} xs={12} className="col-no-padding">
                        <div className="app-actions">
                            <div className="item all"><i className="fa fa-th" /></div>
                            <div className="item home"><i className="fa fa-home" /></div>
                            <div className="item boards"><i className="fa fa-columns" />&nbsp;&nbsp;<strong>Boards</strong></div>
                            <div className="item search">
                                <InputGroup className="group-search">
                                    <FormControl
                                        className="input-search"
                                        placeholder="Jump to..."
                                    />
                                    <InputGroup.Text className="input-icon-search"><i className="fa fa-search" /></InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                    <Col sm={2} xs={12} className="col-no-padding">
                        <div className="app-branding text-center">
                            <a href="#">
                                <img src={imgLogo} className="top-logo" alt="trello-logo" />
                            </a>
                        </div>
                    </Col>
                    <Col sm={5} xs={12} className="col-no-padding">
                        <div className="user-actions">
                            <div className="item quick"><i className="fa fa-plus-square-o" /></div>
                            <div className="item news"><i className="fa fa-info-circle" /></div>
                            <div className="item notification"><i className="fa fa-bell-o" /></div>
                            <div className="item user-avatar">
                                <img src="https://picsum.photos/200" alt="avatar" title="avatar" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </BSContainer>
        </nav>
    )
}

export default AppBar
