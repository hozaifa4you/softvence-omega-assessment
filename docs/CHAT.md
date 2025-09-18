# Chat Module API Documentation

This document describes the chat and messaging API endpoints for the backend service, including both REST API and WebSocket functionality.

## REST API Endpoints

### 1. Create Conversation

-  **URL:** `/chats`
-  **Method:** `POST`
-  **Description:** Create a new conversation between two users.
-  **Access:** All authenticated users
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "user2_id": 2
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "user1_id": 1,
      "user2_id": 2,
      "created_at": "2025-09-18T10:00:00.000Z"
   }
   ```

### 2. Send Message

-  **URL:** `/chats/:id/message`
-  **Method:** `POST`
-  **Description:** Send a message to an existing conversation.
-  **Access:** All authenticated users (must be participant in the conversation)
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "message": "Hello, how are you?"
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "conversation_id": 1,
      "sender_id": 1,
      "message": "Hello, how are you?",
      "is_read": false,
      "created_at": "2025-09-18T10:05:00.000Z"
   }
   ```

## WebSocket Events

The chat module supports real-time communication through WebSocket connections on the `/chat` namespace.

### Connection

-  **Namespace:** `/chat`
-  **URL:** `ws://localhost:3000/chat`
-  **Access:** WebSocket connection (authentication may be required)

### Events You Can Send

#### 1. Create Conversation

-  **Event:** `createConversation`
-  **Description:** Create a new conversation via WebSocket.
-  **Payload:**
   ```json
   {
      "createConvDto": {
         "user2_id": 2
      },
      "userId": 1
   }
   ```

#### 2. Send Message

-  **Event:** `sendMessage`
-  **Description:** Send a message to a conversation via WebSocket.
-  **Payload:**
   ```json
   {
      "convId": 1,
      "message": {
         "message": "Hello via WebSocket!"
      },
      "userId": 1
   }
   ```

#### 3. Join Conversation

-  **Event:** `joinConversation`
-  **Description:** Join a conversation room to receive real-time updates.
-  **Payload:**
   ```json
   {
      "convId": 1
   }
   ```

#### 4. Leave Conversation

-  **Event:** `leaveConversation`
-  **Description:** Leave a conversation room.
-  **Payload:**
   ```json
   {
      "convId": 1
   }
   ```

### Events You Can Receive

#### 1. Conversation Created

-  **Event:** `conversationCreated`
-  **Description:** Emitted when a new conversation is created.
-  **Payload:** Conversation object

#### 2. New Message

-  **Event:** `newMessage`
-  **Description:** Emitted when a new message is sent to a conversation you're in.
-  **Payload:** Message object

## Example Usage

### REST API Examples

#### Create Conversation

```bash
curl -X POST http://localhost:3000/chats \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"user2_id":2}'
```

#### Send Message

```bash
curl -X POST http://localhost:3000/chats/1/message \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'
```

### WebSocket Examples (JavaScript)

#### Connect to Chat

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat", {
   transports: ["websocket"],
});

socket.on("connect", () => {
   console.log("Connected to chat server");
});
```

#### Create Conversation via WebSocket

```javascript
socket.emit("createConversation", {
   createConvDto: {
      user2_id: 2,
   },
   userId: 1,
});
```

#### Send Message via WebSocket

```javascript
socket.emit("sendMessage", {
   convId: 1,
   message: {
      message: "Hello via WebSocket!",
   },
   userId: 1,
});
```

#### Join Conversation Room

```javascript
socket.emit("joinConversation", {
   convId: 1,
});
```

#### Listen for New Messages

```javascript
socket.on("newMessage", (message) => {
   console.log("New message received:", message);
});
```

#### Listen for New Conversations

```javascript
socket.on("conversationCreated", (conversation) => {
   console.log("New conversation created:", conversation);
});
```

## Data Models

### Conversation Object

```json
{
   "id": 1,
   "user1_id": 1,
   "user2_id": 2,
   "created_at": "2025-09-18T10:00:00.000Z"
}
```

### Message Object

```json
{
   "id": 1,
   "conversation_id": 1,
   "sender_id": 1,
   "message": "Hello, how are you?",
   "is_read": false,
   "created_at": "2025-09-18T10:05:00.000Z"
}
```

## Data Validation

### Create Conversation Requirements:

-  **user2_id:** Integer (required) - ID of the second user in the conversation

### Send Message Requirements:

-  **message:** String (required)
-  **Length:** 1-400 characters
-  **Cannot be empty**

## Access Control

-  **All chat endpoints require authentication** (JWT token)
-  **Users can only:**
   -  Create conversations with other users
   -  Send messages to conversations they are participants in
   -  Receive messages from conversations they are participants in

## Error Responses

Common error responses for chat endpoints:

-  **400 Bad Request:** Invalid request body or validation errors
-  **401 Unauthorized:** Missing or invalid JWT token
-  **404 Not Found:** Conversation not found
-  **403 Forbidden:** User not participant in conversation

Example error response:

```json
{
   "statusCode": 404,
   "message": "Conversation with id 1 not found",
   "error": "Not Found"
}
```

Example validation error:

```json
{
   "statusCode": 400,
   "message": ["message must be longer than or equal to 1 characters"],
   "error": "Bad Request"
}
```

## Real-time Features

The chat module provides real-time messaging capabilities through WebSocket connections:

1. **Instant Message Delivery:** Messages are delivered in real-time to all participants
2. **Conversation Notifications:** Users are notified when new conversations are created
3. **Room Management:** Users can join/leave conversation rooms for targeted message delivery
4. **Connection Management:** Automatic handling of client connections and disconnections
