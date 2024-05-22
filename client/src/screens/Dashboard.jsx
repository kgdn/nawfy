import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Image, Nav, Row, Col, Modal, ModalBody, Button } from "react-bootstrap";
import NavbarComponent from "../containers/Navbar";
import PostContainer from "../containers/PostContainer"
import WordInput from "../containers/WordInput";
import PostAPI from "../api/PostAPI";
import { useParams } from 'react-router-dom';

function Dashboard() {
    const [show, setShow] = useState(false);
    const [pagePosts, setPagePosts] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { page } = useParams();

    const decodedLogo = (logo) => {
        return `data:image/png;base64,${logo}`;
    }

    //     @post_endpoints.route("/api/post/page/<int:page>", methods=["GET"])
    // def post_list(page):
    //     """Returns a list of posts.

    //     Args:
    //         page (int): The page number.

    //     Returns:
    //         JSON: A JSON object with a list of posts.
    //     """
    //     # Get the posts and replies
    //     posts = Post.query.paginate(page=page, per_page=10)
    //     replies = Reply.query.all()
    //     post_items = []
    //     for post in posts.items:
    //         post_item = {
    //             "id": post.id,
    //             "body": post.body,
    //             "created": post.created,
    //             "author": [
    //                 {
    //                     "username": convert_uuid_to_username(post.uuid),
    //                     "uuid": post.uuid,
    //                     "userword": get_user_word(post.uuid),
    //                     "icon_path": convert_icon_path_to_base64(
    //                         User.query.filter_by(id=post.uuid).first().icon_path
    //                     ),
    //                 }
    //             ],
    //             "replies": [],
    //         }
    //         for reply in replies:
    //             if reply.post_id == post.id:
    //                 post_item["replies"].append(
    //                     {
    //                         "id": reply.id,
    //                         "body": reply.body,
    //                         "created": reply.created,
    //                         "author": [
    //                             {
    //                                 "username": convert_uuid_to_username(reply.uuid),
    //                                 "uuid": reply.uuid,
    //                                 "userword": get_user_word(reply.uuid),
    //                                 "icon_path": convert_icon_path_to_base64(
    //                                     User.query.filter_by(id=reply.uuid)
    //                                     .first()
    //                                     .icon_path
    //                                 ),
    //                             }
    //                         ],
    //                     }
    //                 )
    //         post_items.append(post_item)

    //     return (
    //         jsonify(
    //             {
    //                 "items": post_items,
    //                 "has_next": posts.has_next,
    //                 "has_prev": posts.has_prev,
    //                 "next_num": posts.next_num,
    //                 "prev_num": posts.prev_num,
    //                 "page": posts.page,
    //                 "pages": posts.pages,
    //                 "per_page": posts.per_page,
    //                 "total": posts.total,
    //             }
    //         ),
    //         200,
    //     )

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await PostAPI.getPostsForPage(page || 1);
            setPagePosts(response.data);
        }
        fetchPosts();
    }, [page]);

    // PostContainer.propTypes = {
    //     data: PropTypes.shape({
    //         icon: PropTypes.string.isRequired,
    //         author: PropTypes.string.isRequired,
    //         body: PropTypes.string.isRequired,
    //         created: PropTypes.string.isRequired,
    //         replies: PropTypes.arrayOf(PropTypes.shape({
    //             icon: PropTypes.string.isRequired,
    //             username: PropTypes.string.isRequired,
    //             body: PropTypes.string.isRequired,
    //             created: PropTypes.string.isRequired,
    //         })).isRequired,
    //     }).isRequired,
    // };

    return (
        <div id="dashboard">
            <NavbarComponent />
            <Container >
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        {pagePosts && pagePosts.items.map((post) => {
                            return (
                                <PostContainer key={post.id} data={{
                                    icon: decodedLogo(post.author[0].icon_path),
                                    author: post.author[0].username,
                                    body: post.body,
                                    created: post.created,
                                    replies: post.replies.map((reply) => {
                                        return {
                                            icon: decodedLogo(reply.author[0].icon_path),
                                            username: reply.author[0].username,
                                            body: reply.body,
                                            created: reply.created
                                        }
                                    })
                                }} />
                            )
                        })}
                    </Col>
                </Row>
            </Container >
            <div id="button">
                <Button className="position-fixed bottom-0 end-0 btn-circle m-5" size="lg" onClick={handleShow}>+</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Join The Conversation</Modal.Title>
                    </Modal.Header>
                    <ModalBody>
                        <WordInput />
                    </ModalBody>
                </Modal>
            </div>
        </div>
    )
}

export default Dashboard;