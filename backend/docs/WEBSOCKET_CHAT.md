# Chat WebSocket Implementation

This is a minimal WebSocket implementation for real-time chat functionality using NestJS and Socket.IO.

## Features

- Real-time conversation creation
- Real-time message sending
- Room-based communication (each conversation has its own room)
- JWT authentication for WebSocket connections
- Automatic event emission for both REST and WebSocket endpoints

## WebSocket Events

### Client to Server Events

#### `createConversation`

Creates a new conversation between two users.

```javascript
socket.emit('createConversation', {
   user2_id: 123,
});
```

#### `sendMessage`

Sends a message to an existing conversation.

```javascript
socket.emit('sendMessage', {
   convId: 1,
   message: {
      message: 'Hello, how are you?',
   },
});
```

#### `joinConversation`

Joins a specific conversation room to receive real-time updates.

```javascript
socket.emit('joinConversation', {
   convId: 1,
});
```

#### `leaveConversation`

Leaves a specific conversation room.

```javascript
socket.emit('leaveConversation', {
   convId: 1,
});
```

### Server to Client Events

#### `conversationCreated`

Emitted when a new conversation is created.

```javascript
socket.on('conversationCreated', (data) => {
   console.log('New conversation:', data.conversation);
   console.log('Participants:', data.participants);
});
```

#### `newMessage`

Emitted when a new message is sent to a conversation.

```javascript
socket.on('newMessage', (data) => {
   console.log('New message:', data.message);
   console.log('Sender:', data.sender);
});
```

#### `joinedConversation`

Confirmation that the client has joined a conversation room.

```javascript
socket.on('joinedConversation', (data) => {
   console.log('Joined conversation:', data.convId);
});
```

#### `leftConversation`

Confirmation that the client has left a conversation room.

```javascript
socket.on('leftConversation', (data) => {
   console.log('Left conversation:', data.convId);
});
```

#### `error`

Emitted when an error occurs.

```javascript
socket.on('error', (data) => {
   console.error('Error:', data.message);
});
```

## Connection

Connect to the WebSocket server:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
   auth: {
      token: 'your-jwt-token',
   },
});
```

## Authentication

WebSocket connections require JWT authentication. Include your JWT token in the auth object when connecting.

## Room Management

- Each conversation creates a room named `conversation_{id}`
- Users are automatically joined to rooms when creating conversations
- Users should manually join rooms for existing conversations they want to monitor
- All participants in a conversation room receive real-time updates

## REST API Integration

The WebSocket implementation works alongside the existing REST API:

- `POST /chats` - Create conversation (also emits WebSocket event)
- `POST /chats/:id/message` - Send message (also emits WebSocket event)

Both REST endpoints will trigger corresponding WebSocket events to all connected clients in the relevant conversation rooms.

## Error Handling

- Authentication errors are handled by the JWT guard
- Conversation not found errors are emitted to the client
- All errors include descriptive messages for debugging
