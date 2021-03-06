import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, ModalHeader, Modal, ModalBody, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            isModalOpen: false
        };
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.celebId, values.rating, values.author, values.text);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render() {
        return (
            <React.Fragment>

                <Button outline onClick={this.toggleModal}>
                    <i className="fa fa-pencil fa-lg" />Submit a Question for a Featured Guest!
                                </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Question for a Guest!</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text className="form-control" model=".author" id="author" name="author"
                                    validators={{
                                        required,
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />

                            </div>
                            <div className="group">
                                <Label htmlFor="comment">Question</Label>

                                <Control.textarea className="form-control" model=".text" id="text" name="text"
                                    rows="6"
                                />

                            </div>
                            <div className="group">
                                <Col>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </div>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}



function RenderCeleb({ celeb }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + celeb.image} alt={celeb.name} />
                    <CardBody>
                        <CardText>{celeb.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({ comments, postComment, celebId }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Questions</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}<br />
                                        -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm celebId={celebId} postComment={postComment} />
            </div>

        );
    }
    return (
        <div>
        </div>
    )
}


function GuestInfo(props) {
    if (props.celeb) {
        return (
            <div className="container" >
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/Guests">Guests</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.celeb.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.celeb.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCeleb celeb={props.celeb} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        celebId={props.celeb.id}
                    />
                </div>
            </div >
        );
    }
    return (
        <div>
        </div>
    );
}


export default GuestInfo;