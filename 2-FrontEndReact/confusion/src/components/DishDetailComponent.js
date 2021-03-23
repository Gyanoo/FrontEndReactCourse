import React from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Col, Row } from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
// import { FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => !(val) || (val.length >= len);


class CommentForm extends React.Component{

    constructor(props){
        super(props);
        this.state={
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }   

    handleComment(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.name, values.comment)
    }

    render(){
        return(
            <>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleComment(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" xs={12}>Rating</Label>
                                <Col>
                                    <Control.select model=".rating" className="form-control" name="rating">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" xs={12}>Name</Label>
                                <Col>
                                    <Control.text model=".name" className="form-control" name="name" placeholder="Your Name" validators={{required, minLength: minLength(3), maxLength: maxLength(15)}} />
                                    <Errors className="text-danger" model=".name" show="touched" messages={{
                                        required: "Required",
                                        minLength: "Name length must be greater than 2",
                                        maxLength: "Name length must be not longer than 15"
                                    }}/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" xs={12}>Comment</Label>
                                <Col>
                                    <Control.textarea model=".comment" className="form-control" name="comment" rows="6" />
                                </Col>
                            </Row>
                            <Row>
                                <Button type="submit" color="primary" className="ml-3">Submit</Button>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    };
}

function RenderDish({dish}){
    return(
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg width="100%" object src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle heading>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({commentsArray, postComment, dishId}){
    if(commentsArray.length === 0){
        return(<div></div>)
    }
    const commentsListView = commentsArray.map((comment) =>
        <li key={comment.id} ><p>{comment.comment} </p>
        <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', {year:'numeric', month:'short', day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</p></li>
    );
    return(
        <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            <div className="list-unstyled">{commentsListView}</div>
            <CommentForm dishId={dishId} postComment={postComment} />
        </div>
    );
}

const DishDetail = (props) => {
    const dish = props.dish;
    if(props.isLoading){
        return(
            <div className="container">
                <div className="row">
                    <Loading/>
                </div>
            </div>
        );
    }
    else if (props.errMess){
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    if (dish == null){
        return(<div></div>)
    }
    return(
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
        <div className="row">
            <RenderDish dish={props.dish} />
            <RenderComments commentsArray={props.comments}
                postComment={props.postComment}
                dishId={props.dish.id} />
        </div>
        </div>
    );
}


export default DishDetail;