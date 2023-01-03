import React, {useState} from 'react'
import {Container, Button, Card , Form, Alert, Badge} from 'react-bootstrap'
import { gql, useMutation, useSubscription } from '@apollo/client';

const GET_MESSAGE = gql`
    subscription {
      messages {
        id,
        user,
        content
        }
    }
`

const POST_MESSAGE = gql`
    mutation ($user: String!, $content: String!) {
        postMessage(user: $user, content: $content) {
          user,
          content
        }
    }
`

const Message = ({messageUser}) => {
    const {data, error} = useSubscription(GET_MESSAGE);
    console.log('error', error)
    if(!data) {
        return
    }
    console.log('data', data)
    return (
         <div>
            {data.messages.map((each) => {
                return (
                    <div key={each.id} style={{display: "flex", justifyContent: each.user === messageUser ? "flex-end": "flex-start" }}>
                        <Badge bg="secondary" pill={true} style={{width: "50px", height: "50px", marginTop: "5px", lineHeight: "35px", fontSize: "17px", marginRight: "5px"}} >{each.user.slice(0,2).toUpperCase()}</Badge>
                        <Alert key={each.id} variant={each.user === messageUser ? "secondary" : "success"}>
          {each.content}
        </Alert>
                        </div>
                )
            })}
            </div>
    )
}

const Chat = (props) => {
    const [username, setUsername] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [postMessage , {data} ] = useMutation(POST_MESSAGE);
    const triggerSave = (e) => {
        e.preventDefault();
        postMessage({
            variables: {
                user: username,
                content:messageContent
            }
        })
        setMessageContent("")
    }
  return (
    <div>
        <Container >
        <Card bg={"light"} style={{ width: '18rem' }} >
      <Card.Body >
        <Card.Title>Your Chat Bot</Card.Title>
                    <Message messageUser={username} />
        <Form onSubmit={triggerSave}>
        <Form.Label htmlFor="inputPassword5">Enter Name</Form.Label>
      <Form.Control
        type="text"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Form.Label htmlFor="inputPassword5">Your Message</Form.Label>
      <Form.Control
        type="text"
        id="textmessage"
        aria-describedby="textMessage"
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <Form.Text id="passwordHelpBlock" muted>
        Username is needed to start the chat
      </Form.Text>
              <Button type="submit" variant="primary">Start</Button>
      </Form>
      </Card.Body>
    </Card>
    </Container>
    </div>
  )
}

export default Chat;