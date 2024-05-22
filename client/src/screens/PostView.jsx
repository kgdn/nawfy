import PostAPI from '../api/PostAPI';
import { Card, Row, Col, Container, Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarComponent from '../containers/Navbar';

// {
//     "has_next": false,
//     "has_prev": false,
//     "items": [
//       {
//         "author": [
//           {
//             "icon_path": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAACwklEQVR4nO3bMUsyARzH8f95j9eig2hbW+kWODtHL0HJK6EhWgQxdBAcWkwiB0HaQziJKIjUE+8NuDm4KDj0AhyCu604e4aDaPP5YeoT/D7TDf7v/vdFTxeVvb09oX/j2/QCvwljARgLwFgAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgLwFgAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBVgcy7IswzBUVV3ySqqqGoZhWdaS59mgxbEikYiu667rDodD9OzfR1zX1XU9EongS/4v+DEEYLEuLi5arVa32z08PBSRaDR6f39vmubp6amIhEKh29tbwzDu7u7C4fDXVDgc7nQ60Wh0BfuvFRBL07S3t7d0Op3NZsvlsoicnJzUarWjo6OzszMRKZVKvV5P1/V2u53L5bwpv99fr9crlcp0Ol3ZXawJEEtRlKenJxF5fX0NBoMicn19vbu7e35+HggERCSRSPT7fRF5fn6+ubnxpi4vL19eXgaDwcpuYX2AWB8fH7Zte8efn58i0mg0RKTZbM7ncxHx+XyKonjPcsdxvDdjLBaLx+Mr23+tgFheke/29/dN09za2tI0TURGo9HBwYGIJJPJQqEgIu/v76lUamdnJ5VK/fTmG/BnmWHDMB4eHiaTiW3bmqZdXV1Vq9Xj42PHcYrFovea+Xyez+cfHx/H4/FoNPqhtTdDWfhPVsuyZrNZJpNxXXeZK6mq2mw2t7e3vW/S32hxLPrCH6UAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgLwFgAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgL8BcASqqT2WoGCwAAAABJRU5ErkJggg==",
//             "username": "steven",
//             "userword": "hack",
//             "uuid": "11a8623aefbb4c86b4d75a166b1c3d23"
//           }
//         ],
//         "body": "gay",
//         "created": "Wed, 15 May 2024 12:09:16 GMT",
//         "id": 1,
//         "replies": [
//           {
//             "author": [
//               {
//                 "icon_path": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAADLElEQVR4nO3bPUvrUADG8dOc20KF6hJnF91ERC1O2kVb/AhJUUEQiqtI38RBjCKOfgChWOjiKKUZnDulUBzELoLt1KHQRaumvUOgBOHe3keNL5fnN6U5p8nJnyTQob7x8XFB/0b56gX8JIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgLwFgAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWYHAs0zTz+byU0qMVSCnz+bxpmh4d/wMNjqWqajwet23bsiz3/omJCV3XoZO9OoLDtu14PK6qKnSoL/Hrzd+s1Wq1Wu1DF/PdYbGSyeT09LQQYmdnp16vW5Y1MzPj3DLn5+dzc3OhUOj09NQ0TVVVDcMYHh5uNBqRSCQcDvcPMjIysre3p6pqIBA4OjqqVqseXJcngBd8IBC4vr7WNK1QKGQyGfeQ3+9vtVq6rm9tbe3u7gohUqnU5eWlpmmlUmloaMg9OZlM5nK59fX17e1twzA+7lo8B9xZvV7PeQ0Xi8VUKuUeUhTl4uJCCHF/fx8KhYQQ8/PzTtCrqyvbtt2TFxYWxsbGnO1gMCilfDXh28JidbtdZ/vp6ck99Pz83G63+9Oce835qCiKz+dzT5ZSbmxsdDodRVFmZ2d/SinsMZRSRiIRIcTKykq5XHYP9SP2WZa1tLQkhIhGo69iWZa1vLwshFhcXEwkEu9b/6cC7qxOpxOLxTY3N9vtdjqd/vvkw8PDk5OT1dXVSqXy8PDg7Ly7u0skEoZhHBwc6Lr+8vKSzWbft/5P5Rv4T1bTNJvN5traGvS8HB8fn52d3dzcTE1NpdNpTdP+NFNKmcvlRkdHo9EosvIvMDjW20xOTmaz2cfHR7/fv7+/f3t768VZPplXsf5L/CENYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgLwFgAxgIwFoCxAIwFYCwAYwEYC8BYAMYCMBaAsQCMBWAsAGMBGAvAWADGAjAWgLEAjAVgLABjARgLwFgAxgIwFuA3GrPYYJIEKx8AAAAASUVORK5CYII=",
//                 "username": "steven2",
//                 "userword": "bingle",
//                 "uuid": "492b8fd1a59b4deca478b9aea1208671"
//               }
//             ],
//             "body": "dick und balls",
//             "created": "Wed, 15 May 2024 12:22:56 GMT",
//             "id": 1
//           }
//         ]
//       }
//     ],
//     "next_num": null,
//     "page": 1,
//     "pages": 1,
//     "per_page": 10,
//     "prev_num": null,
//     "total": 1
//   }

function PostView() {
    const { postId } = useParams();

    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostAPI.getPostById(postId);
                setPost(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [postId]);

    const decodeIcon = (icon) => {
        return `data:image/png;base64,${icon}`
    }

    return (
        <div id="post-view">
            <NavbarComponent />
            <Container>
                <Row>
                    <Col>
                        <Card className="mt-3">
                            <Card.Header className="d-flex justify-content-between">
                                <Image src={decodeIcon(post?.author[0].icon_path)} rounded />
                                <div className="d-flex flex-column">
                                    <span>{post?.author[0].username}</span>
                                    <span>{post?.created}</span>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{post?.body}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <span>Replies: {post?.replies.length}</span>
                            </Card.Footer>
                        </Card>
                        {post?.replies.map(reply => (
                            <Card key={reply.id} className="mt-3">
                                <Card.Header className="d-flex justify-content-between">
                                    <Image src={decodeIcon(reply.author[0].icon_path)} rounded />
                                    <div className="d-flex flex-column">
                                        <span>{reply.author[0].username}</span>
                                        <span>{reply.created}</span>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>{reply.body}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PostView;