import { Card, Row, Col, ListGroup, ListGroupItem, Image } from "react-bootstrap";
import PropTypes from 'prop-types';

function PostContainer({ data }) {
    // @post_endpoints.route("/api/post/page/<int:page>", methods=["GET"])
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

    return (
        <div id="post-container">
            <Card style={{ width: '100%' }} className="mb-2">
                <Row>
                    <Col xs={3}>
                        <Image src={data.icon} rounded fluid />
                    </Col>
                    <Col sm={4}>
                        <Card.Body>
                            <Card.Title className="text-primary">@{data.author}</Card.Title>
                            <Card.Text>{data.body}</Card.Text>
                            <Card.Subtitle className="text-muted">Posted on {data.created}</Card.Subtitle>
                        </Card.Body>
                    </Col>
                </Row>
                <ListGroup className="list-group-flush">
                    {data.replies.map((reply, index) => (
                        <ListGroupItem key={index}>
                            <Row>
                                <Col xs={3}>
                                    <Image src={reply.icon} rounded fluid />
                                </Col>
                                <Col sm={4}>
                                    <Card.Body>
                                        <Card.Title className="text-primary">@{reply.username}</Card.Title>
                                        <Card.Text>{reply.body}</Card.Text>
                                        <Card.Subtitle className="text-muted">Posted on {reply.created}</Card.Subtitle>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Card>
        </div>
    )
}

export default PostContainer;

PostContainer.propTypes = {
    data: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        created: PropTypes.string.isRequired,
        replies: PropTypes.arrayOf(PropTypes.shape({
            icon: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
            created: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
};