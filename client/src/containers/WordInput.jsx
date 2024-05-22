import filterWord from "fe-business/filter/filter.js"
import { Form, Button } from "react-bootstrap"
import PostAPI from "../api/PostAPI.jsx"

// Handle post
const handlePost = (word) => {
    if (verifyWord(word)) {
        sendPost(word);
    } else {
        document.getElementById("result").innerHTML = "Word is not allowed";
    }
}

// Run the word though the filter
const verifyWord = (word) => {
    return filterWord(word);
}

const sendPost = async (word) => {
    const response = await PostAPI.createPost(word);
    console.log(response);
    if (response.status === 200) {
        window.location.reload();
    } else {
        alert("Error: " + response.data.error);
    }
}

function WordInput() {
    return (
        <div id="word-input">
            <Form>
                <Form.Group>
                    <Form.Label>Create Post</Form.Label>
                    <Form.Control id="wordInput" type="text" style={{ "textTransform": "uppercase" }}></Form.Control>
                    <Button onClick={() => { handlePost(document.getElementById("wordInput").value) }}>Go</Button>
                </Form.Group>
            </Form>
            {/* <label>Enter Word</label><br></br>
            <input id="wordInput" type="text" style={{"textTransform": "uppercase"}}></input>
            <button >Go</button> */}
            <p id="result"></p>
        </div>
    )
}

export default WordInput